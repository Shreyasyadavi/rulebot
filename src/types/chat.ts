export type MessageRole = 'user' | 'assistant';

export type ResponseType = 'rule' | 'fallback';

export type ApiMatchType = 'exact' | 'pattern' | 'keyword' | 'fallback' | 'none';

export interface ChatApiRequest {
  message: string;
  sessionId?: string;
}

export interface ChatApiResponse {
  response: string;
  responseType: ResponseType;
  intent: string | null;
  category: string | null;
  matchType: string;
  confidence: number;
  sessionId: string;
  pipelineStep: string;
}

export interface ChatMessage {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: string;
  responseType?: ResponseType;
  intentName?: string;
  category?: string;
  matchType?: string;
  confidence?: number;
  sessionId?: string;
  isError?: boolean;
  retryPayload?: string;
}

export interface InspectorState {
  currentIntent: string;
  matchStatus: 'Exact Match' | 'Pattern Match' | 'Fallback' | 'Standby';
  confidence: number;
  sessionId: string;
  responseSource: 'rule' | 'fallback';
  pipelineStage: 'idle' | 'input_received' | 'intent_matching' | 'logic_execution' | 'completed';
  activeStep: 1 | 2 | 3 | 4;
}

