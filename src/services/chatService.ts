/**
 * Chat API Service Client for connecting to the RuleBot FastAPI backend.
 * 
 * Provides type-safe requests and responses matching backend/app/schemas.py.
 */

import { getBaseUrl } from './api';

export interface BackendChatRequest {
  message: string;
}

export interface BackendChatResponse {
  response: string;
  responseType: 'rule' | 'gemini' | 'fallback';
  intent: string | null;
  matchType: 'exact' | 'pattern' | 'keyword' | 'none';
  confidence: number;
  sessionId: string;
  pipelineStep: string;
}

export interface BackendHealthResponse {
  status: string;
  service: string;
}

/**
 * Checks connectivity to the RuleBot backend service.
 */
export async function checkBackendHealth(): Promise<BackendHealthResponse> {
  const baseUrl = getBaseUrl();
  const response = await fetch(`${baseUrl}/api/health`);
  if (!response.ok) {
    throw new Error(`Health check failed with status: ${response.status}`);
  }
  return response.json();
}

/**
 * Sends a chat message to the RuleBot rule engine backend.
 */
export async function sendChatMessage(message: string): Promise<BackendChatResponse> {
  const baseUrl = getBaseUrl();
  const response = await fetch(`${baseUrl}/api/chat`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ message }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.detail || `Chat request failed with status: ${response.status}`
    );
  }

  return response.json();
}
