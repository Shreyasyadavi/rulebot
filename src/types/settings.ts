import { ThemeMode } from './index';

export type ChatDensity = 'comfortable' | 'compact';
export type DataRetention = 'all' | '7days' | '30days' | 'session';
export type ResponseStyle = 'formal' | 'friendly' | 'concise';

export interface UserSettings {
  theme: ThemeMode;
  enterToSend: boolean;
  showSourceBadges: boolean;
  showInspector: boolean;
  chatDensity: ChatDensity;
  showTimestamps: boolean;
  botName: string;
  botPersona: string;
  responseStyle: ResponseStyle;
  sessionMemory: boolean;
  dataRetention: DataRetention;
}

export const DEFAULT_USER_SETTINGS: UserSettings = {
  theme: 'light',
  enterToSend: true,
  showSourceBadges: true,
  showInspector: true,
  chatDensity: 'comfortable',
  showTimestamps: true,
  botName: 'RuleBot',
  botPersona: 'Deterministic rule-based conversational assistant with 50+ predefined intents.',
  responseStyle: 'formal',
  sessionMemory: true,
  dataRetention: 'all',
};
