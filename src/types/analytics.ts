export interface TopIntentStat {
  name: string;
  count: number;
  category: string;
  percentage: number;
}

export interface DailyActivityStat {
  day: string;
  date: string;
  conversations: number;
  messages: number;
}

export interface ResponseDistributionStat {
  name: string;
  count: number;
  percentage: number;
  color: string;
}

export interface AnalyticsSummary {
  totalConversations: number;
  totalMessages: number;
  ruleMatchRate: number;
  fallbackRate: number;
}

export interface AnalyticsMetrics {
  totalConversations: number;
  totalMessages: number;
  totalResponses: number;
  ruleMatches: number;
  fallbackResponses: number;
  ruleMatchRate: number;
  fallbackRate: number;
  topIntents: TopIntentStat[];
  activityByDay: DailyActivityStat[];
  responseDistribution: ResponseDistributionStat[];
}

