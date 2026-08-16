import { HistorySessionRecord, HistoryMessageItem, HistorySessionStatus } from '../types/history';
import { AnalyticsMetrics, TopIntentStat, DailyActivityStat, ResponseDistributionStat } from '../types/analytics';
import { UserSettings, DEFAULT_USER_SETTINGS } from '../types/settings';

const STORAGE_KEYS = {
  SESSIONS: 'rulebot_history_sessions',
  SETTINGS: 'rulebot_settings',
};

// Seed initial history sample if storage is empty so the portfolio reviewer sees a realistic initialized workspace
const INITIAL_DEMO_SESSIONS: HistorySessionRecord[] = [
  {
    sessionId: 'RB-INIT-1204',
    startedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    lastUpdatedAt: new Date(Date.now() - 24 * 60 * 60 * 1000 + 5 * 60 * 1000).toISOString(),
    messageCount: 4,
    matchedIntents: ['greeting_hello', 'python_definition', 'python_lists_tuples'],
    responseSources: ['rule', 'rule', 'rule'],
    status: 'RESOLVED',
    snippet: 'What is the difference between list and tuple in Python?',
    messages: [
      {
        id: 'msg-1',
        role: 'user',
        content: 'Hello RuleBot',
        timestamp: '10:00 AM',
      },
      {
        id: 'msg-2',
        role: 'assistant',
        content: 'Hello! Welcome to RuleBot. How can I help you today?',
        timestamp: '10:00 AM',
        responseType: 'rule',
        intent: 'greeting_hello',
        confidence: 0.99,
      },
      {
        id: 'msg-3',
        role: 'user',
        content: 'What is the difference between list and tuple in Python?',
        timestamp: '10:02 AM',
      },
      {
        id: 'msg-4',
        role: 'assistant',
        content: 'In Python, Lists are mutable (can be changed after creation using brackets [ ]) while Tuples are immutable (cannot be altered after creation using parentheses ( )). Tuples are hashable and faster for fixed data.',
        timestamp: '10:02 AM',
        responseType: 'rule',
        intent: 'python_lists_tuples',
        confidence: 0.99,
      },
    ],
  },
  {
    sessionId: 'RB-INIT-1203',
    startedAt: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
    lastUpdatedAt: new Date(Date.now() - 48 * 60 * 60 * 1000 + 3 * 60 * 1000).toISOString(),
    messageCount: 2,
    matchedIntents: ['ai_definition'],
    responseSources: ['rule'],
    status: 'RESOLVED',
    snippet: 'What is artificial intelligence?',
    messages: [
      {
        id: 'msg-5',
        role: 'user',
        content: 'What is AI?',
        timestamp: '02:15 PM',
      },
      {
        id: 'msg-6',
        role: 'assistant',
        content: 'Artificial Intelligence (AI) is the field of computer science dedicated to building computational systems capable of performing tasks that traditionally require human intelligence, such as visual recognition, language understanding, reasoning, and planning.',
        timestamp: '02:15 PM',
        responseType: 'rule',
        intent: 'ai_definition',
        confidence: 0.99,
      },
    ],
  },
];

export function getHistorySessions(): HistorySessionRecord[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SESSIONS);
    if (!raw) {
      return [];
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];

    // Apply data retention policy
    const settings = getUserSettings();
    if (settings.dataRetention === '7days') {
      const cutoff = Date.now() - 7 * 24 * 60 * 60 * 1000;
      return parsed.filter((s) => new Date(s.lastUpdatedAt).getTime() >= cutoff);
    } else if (settings.dataRetention === '30days') {
      const cutoff = Date.now() - 30 * 24 * 60 * 60 * 1000;
      return parsed.filter((s) => new Date(s.lastUpdatedAt).getTime() >= cutoff);
    }

    return parsed;
  } catch {
    return [];
  }
}

export function saveHistorySession(session: HistorySessionRecord): void {
  try {
    const sessions = getHistorySessions();
    const index = sessions.findIndex((s) => s.sessionId === session.sessionId);
    if (index >= 0) {
      sessions[index] = session;
    } else {
      sessions.unshift(session);
    }
    localStorage.setItem(STORAGE_KEYS.SESSIONS, JSON.stringify(sessions));
  } catch (err) {
    console.error('Failed to save history session to localStorage', err);
  }
}

export function recordMessageTurn(
  sessionId: string,
  userText: string,
  botResponse: string,
  responseType: 'rule' | 'fallback',
  intent?: string,
  confidence?: number,
  matchType?: string
): void {
  const sessions = getHistorySessions();
  const existing = sessions.find((s) => s.sessionId === sessionId);
  const nowStr = new Date().toISOString();
  const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const userMsg: HistoryMessageItem = {
    id: `u-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    role: 'user',
    content: userText,
    timestamp: timeStr,
  };

  const botMsg: HistoryMessageItem = {
    id: `b-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    role: 'assistant',
    content: botResponse,
    timestamp: timeStr,
    responseType,
    intent,
    confidence,
    matchType,
  };

  let status: HistorySessionStatus = 'RESOLVED';
  if (responseType === 'fallback') {
    status = 'FALLBACK';
  }

  if (existing) {
    existing.lastUpdatedAt = nowStr;
    existing.messages.push(userMsg, botMsg);
    existing.messageCount = existing.messages.length;
    if (intent && !existing.matchedIntents.includes(intent)) {
      existing.matchedIntents.push(intent);
    }
    if (!existing.responseSources.includes(responseType)) {
      existing.responseSources.push(responseType);
    }
    existing.status = status;
    existing.snippet = userText;
    saveHistorySession(existing);
  } else {
    const newSession: HistorySessionRecord = {
      sessionId,
      startedAt: nowStr,
      lastUpdatedAt: nowStr,
      messageCount: 2,
      matchedIntents: intent ? [intent] : [],
      responseSources: [responseType],
      status,
      snippet: userText,
      messages: [userMsg, botMsg],
    };
    saveHistorySession(newSession);
  }
}

export function clearHistorySessions(): void {
  try {
    localStorage.setItem(STORAGE_KEYS.SESSIONS, JSON.stringify([]));
  } catch (err) {
    console.error('Failed to clear history sessions', err);
  }
}

export function calculateAnalyticsMetrics(timeRange: '7d' | '30d' | 'all' = '7d'): AnalyticsMetrics {
  const sessions = getHistorySessions();

  const now = new Date();
  const cutoffTime = timeRange === '7d'
    ? now.getTime() - 7 * 24 * 60 * 60 * 1000
    : timeRange === '30d'
    ? now.getTime() - 30 * 24 * 60 * 60 * 1000
    : 0;

  const filteredSessions = timeRange === 'all'
    ? sessions
    : sessions.filter((s) => {
        const t = new Date(s.startedAt || s.lastUpdatedAt || 0).getTime();
        return t >= cutoffTime;
      });

  let totalConversations = filteredSessions.length;
  let totalMessages = 0;
  let ruleMatches = 0;
  let fallbackResponses = 0;
  const intentCounts: Record<string, number> = {};

  // Group by day for the last 7 days (or 30 days if 30d selected)
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const activityMap: Record<string, { conversations: number; messages: number; dateStr: string }> = {};

  const daysToGenerate = timeRange === '30d' ? 30 : 7;
  for (let i = daysToGenerate - 1; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const key = d.toISOString().slice(0, 10); // YYYY-MM-DD
    const dayLabel = daysToGenerate <= 7 ? dayNames[d.getDay()] : `${d.getMonth() + 1}/${d.getDate()}`;
    activityMap[key] = {
      conversations: 0,
      messages: 0,
      dateStr: dayLabel,
    };
  }

  filteredSessions.forEach((s) => {
    totalMessages += s.messageCount || (s.messages ? s.messages.length : 0);

    // Track activity by date
    const dateKey = (s.startedAt || s.lastUpdatedAt || '').slice(0, 10);
    if (activityMap[dateKey]) {
      activityMap[dateKey].conversations += 1;
      activityMap[dateKey].messages += s.messageCount || (s.messages ? s.messages.length : 0);
    }

    if (s.messages && Array.isArray(s.messages)) {
      s.messages.forEach((m) => {
        if (m.role === 'assistant') {
          if (m.responseType === 'rule') {
            ruleMatches += 1;
            if (m.intent) {
              intentCounts[m.intent] = (intentCounts[m.intent] || 0) + 1;
            }
          } else {
            fallbackResponses += 1;
          }
        }
      });
    }
  });

  const totalResponses = ruleMatches + fallbackResponses;
  const ruleMatchRate = totalResponses > 0 ? Math.round((ruleMatches / totalResponses) * 100) : 0;
  const fallbackRate = totalResponses > 0 ? Math.round((fallbackResponses / totalResponses) * 100) : 0;

  // Format top intents
  const sortedIntents = Object.entries(intentCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  const maxIntentCount = sortedIntents.length > 0 ? sortedIntents[0][1] : 1;

  const topIntents: TopIntentStat[] = sortedIntents.map(([name, count]) => {
    let category = 'General';
    if (name.startsWith('python')) category = 'Python';
    else if (name.startsWith('ai') || name.startsWith('ml')) category = 'AI / ML';
    else if (name.startsWith('greeting')) category = 'Greetings';
    else if (name.startsWith('bot') || name.startsWith('help')) category = 'Basic Chatbot';
    else if (name.startsWith('conversation') || name.startsWith('thank')) category = 'Conversation';

    return {
      name,
      count,
      category,
      percentage: Math.round((count / maxIntentCount) * 100),
    };
  });

  // Format activity by day
  const activityByDay: DailyActivityStat[] = Object.entries(activityMap).map(([key, data]) => ({
    day: data.dateStr,
    date: key,
    conversations: data.conversations,
    messages: data.messages,
  }));

  // Response Distribution
  const responseDistribution: ResponseDistributionStat[] = [
    {
      name: 'Rule Match',
      count: ruleMatches,
      percentage: totalResponses > 0 ? ruleMatchRate : 0,
      color: '#4f46e5', // indigo-600
    },
    {
      name: 'Local Fallback',
      count: fallbackResponses,
      percentage: totalResponses > 0 ? fallbackRate : 0,
      color: '#f59e0b', // amber-500
    },
  ];

  return {
    totalConversations,
    totalMessages,
    totalResponses,
    ruleMatches,
    fallbackResponses,
    ruleMatchRate,
    fallbackRate,
    topIntents,
    activityByDay,
    responseDistribution,
  };
}

export function getUserSettings(): UserSettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    if (!raw) return DEFAULT_USER_SETTINGS;
    return { ...DEFAULT_USER_SETTINGS, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_USER_SETTINGS;
  }
}

export function saveUserSettings(settings: UserSettings): void {
  try {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  } catch (err) {
    console.error('Failed to save user settings', err);
  }
}
