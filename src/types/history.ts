export type HistorySessionStatus = 'RESOLVED' | 'FALLBACK' | 'INCOMPLETE';

export interface HistoryMessageItem {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  responseType?: 'rule' | 'fallback';
  intent?: string;
  confidence?: number;
  matchType?: string;
}

export interface HistorySessionRecord {
  sessionId: string;
  startedAt: string;
  lastUpdatedAt: string;
  messageCount: number;
  matchedIntents: string[];
  responseSources: ('rule' | 'fallback')[];
  status: HistorySessionStatus;
  snippet: string;
  messages: HistoryMessageItem[];
}
