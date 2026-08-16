export interface Intent {
  name?: string;
  intent: string;
  category: string;
  keywords: string[];
  patterns: string[];
  exact_phrases?: string[];
  response?: string;
  responses: string[];
  status?: string;
  priority?: number;
  matchType?: string;
  responseType?: string;
}

export type IntentRule = Intent;

export type IntentCategoryFilter =
  | 'All Categories'
  | 'Greetings'
  | 'Basic Chatbot'
  | 'Conversation'
  | 'Python'
  | 'AI / Machine Learning'
  | 'General / Project';

