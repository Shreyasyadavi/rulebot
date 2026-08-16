import { Intent } from '../types/intents';
import { STATIC_INTENTS_CATALOG } from '../data/intentsCatalog';

export async function fetchIntentsCatalog(): Promise<Intent[]> {
  try {
    const response = await fetch('/api/intents');
    if (!response.ok) {
      throw new Error(`Failed to fetch intents (${response.status})`);
    }
    const data = await response.json();
    if (Array.isArray(data) && data.length > 0) {
      return data.map((item: any) => ({
        name: item.name || item.intent || 'unnamed_intent',
        intent: item.intent || item.name || 'unnamed_intent',
        category: item.category || 'General',
        keywords: Array.isArray(item.keywords) ? item.keywords : [],
        patterns: Array.isArray(item.patterns) ? item.patterns : [],
        exact_phrases: Array.isArray(item.exact_phrases) ? item.exact_phrases : [],
        response: item.response || (Array.isArray(item.responses) ? item.responses[0] : '') || '',
        responses: Array.isArray(item.responses) ? item.responses : (item.response ? [item.response] : []),
        status: item.status || 'Active',
        priority: typeof item.priority === 'number' ? item.priority : 50,
        matchType: item.matchType || 'Exact / Regex / Keyword',
        responseType: item.responseType || 'rule',
      }));
    }
    return STATIC_INTENTS_CATALOG.map((item) => ({
      ...item,
      name: item.intent,
      response: item.responses?.[0] || '',
      status: 'Active',
    }));
  } catch (err) {
    // If backend is unavailable, throw error so UI can display standard error state
    throw new Error('Unable to load intents right now.');
  }
}

