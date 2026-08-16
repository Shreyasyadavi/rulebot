import { ChatApiResponse } from '../types/chat';

/**
 * Resolves the base API URL from environment variables or defaults to same-origin relative path ("").
 *
 * Environment Awareness:
 * 1. When running in the AI Studio preview environment or full-stack container (port 3000 / Cloud Run),
 *    requests route cleanly via same-origin relative path `""` (`/api/*`), handled by the full-stack server.
 * 2. When VITE_API_URL is set to a custom reachable remote URL (e.g., https://api.example.com), it is respected.
 * 3. Localhost:8000 is avoided when the browser is connected to the full-stack host on a different port or over HTTPS.
 */
export const getBaseUrl = (): string => {
  const envUrl = import.meta.env.VITE_API_URL;

  if (typeof window !== 'undefined') {
    // If the frontend is loaded over HTTPS (Cloud Run preview), http://localhost:* causes Mixed Content errors.
    if (
      envUrl &&
      typeof envUrl === 'string' &&
      envUrl.startsWith('http://localhost') &&
      window.location.protocol === 'https:'
    ) {
      return '';
    }

    // When the browser is loaded from the full-stack server (e.g. port 3000) and envUrl points to local port 8000,
    // use same-origin relative path so the full-stack server handles and routes the request.
    if (
      envUrl &&
      typeof envUrl === 'string' &&
      (envUrl.includes('localhost:8000') || envUrl.includes('127.0.0.1:8000')) &&
      window.location.port !== '8000'
    ) {
      return '';
    }
  }

  if (envUrl && typeof envUrl === 'string' && envUrl.trim() !== '') {
    return envUrl.replace(/\/+$/, '');
  }

  return '';
};

export class ApiError extends Error {
  statusCode?: number;
  data?: unknown;

  constructor(message: string, statusCode?: number, data?: unknown) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.data = data;
  }
}

/**
 * Sends a message payload to the RuleBot FastAPI / Backend chat endpoint.
 *
 * @param message The user text to be processed by the deterministic rule engine.
 * @param sessionId Optional session tracking identifier.
 * @param timeoutMs Request timeout in milliseconds (default: 15000ms).
 * @returns Standardized ChatApiResponse containing deterministic intent and metadata.
 */
export async function sendChatMessage(
  message: string,
  sessionId?: string,
  timeoutMs = 15000
): Promise<ChatApiResponse> {
  const trimmed = message.trim();
  if (!trimmed) {
    throw new ApiError('Message cannot be empty or whitespace only.', 400);
  }

  const baseUrl = getBaseUrl();
  const endpoint = `${baseUrl}/api/chat`;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        message: trimmed,
        ...(sessionId ? { sessionId } : {}),
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      let errorMessage = `Server responded with status ${response.status}`;
      try {
        const errorData = await response.json();
        if (errorData.detail) {
          if (Array.isArray(errorData.detail)) {
            errorMessage = errorData.detail.map((d: { msg?: string }) => d.msg || '').join(', ');
          } else if (typeof errorData.detail === 'string') {
            errorMessage = errorData.detail;
          }
        } else if (errorData.error) {
          errorMessage = errorData.error;
        }
      } catch {
        // Non-JSON response body
      }
      throw new ApiError(errorMessage, response.status);
    }

    const data = await response.json();

    // Validate and format ChatApiResponse schema
    return {
      response: typeof data.response === 'string' ? data.response : 'No response content returned.',
      responseType: data.responseType === 'rule' || data.responseType === 'gemini' || data.responseType === 'fallback'
        ? data.responseType
        : 'fallback',
      intent: data.intent ?? null,
      category: data.category ?? null,
      matchType: data.matchType || (data.responseType === 'rule' ? 'keyword' : 'none'),
      confidence: typeof data.confidence === 'number' ? data.confidence : (data.responseType === 'rule' ? 0.95 : 0.0),
      sessionId: data.sessionId || sessionId || `RB-${Date.now().toString(36).toUpperCase()}`,
      pipelineStep: data.pipelineStep || 'response_delivery',
    };
  } catch (err: unknown) {
    clearTimeout(timeoutId);

    if (err instanceof ApiError) {
      throw err;
    }

    if (err instanceof DOMException && err.name === 'AbortError') {
      throw new ApiError('Request timed out. The RuleBot backend took too long to respond.', 408);
    }

    throw new ApiError(
      'Unable to connect to RuleBot right now.',
      0
    );
  }
}

/**
 * Checks the operational health of the backend API.
 */
export async function checkBackendHealth(): Promise<{ status: string; service: string }> {
  const baseUrl = getBaseUrl();
  const endpoint = `${baseUrl}/api/health`;

  const response = await fetch(endpoint, {
    method: 'GET',
    headers: { Accept: 'application/json' },
  });

  if (!response.ok) {
    throw new ApiError(`Health check failed with status ${response.status}`, response.status);
  }

  return response.json();
}
