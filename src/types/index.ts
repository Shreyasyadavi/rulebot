export type TabType = 'chat' | 'intents' | 'analytics' | 'history' | 'settings';

export type ThemeMode = 'light' | 'dark' | 'system';

export interface NavItem {
  id: TabType;
  label: string;
  iconName: 'MessageSquare' | 'GitFork' | 'History' | 'TrendingUp' | 'Settings';
  badge?: string;
}
