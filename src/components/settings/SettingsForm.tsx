import React, { useState } from 'react';
import {
  Palette,
  MessageSquare,
  Layout,
  Bug,
  Database,
  Sun,
  Moon,
  Monitor,
  Check,
  RotateCcw,
  Trash2,
  Bot,
  Brain,
  ShieldCheck,
} from 'lucide-react';
import { useSettings } from '../../hooks/useSettings';
import { clearHistorySessions } from '../../services/storage';
import { ThemeMode } from '../../types';
import { DataRetention, ResponseStyle } from '../../types/settings';
import { ResetSettingsDialog } from './ResetSettingsDialog';

interface SettingsFormProps {
  currentTheme: ThemeMode;
  onSetTheme: (theme: ThemeMode) => void;
  onClearActiveChat?: () => void;
}

export const SettingsForm: React.FC<SettingsFormProps> = ({
  currentTheme,
  onSetTheme,
  onClearActiveChat,
}) => {
  const { settings, updateSetting, resetSettings } = useSettings();
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [showResetDialog, setShowResetDialog] = useState<boolean>(false);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleClearHistory = () => {
    clearHistorySessions();
    showToast('Local conversation history cleared successfully.');
  };

  const handleClearActive = () => {
    if (onClearActiveChat) {
      onClearActiveChat();
    }
    showToast('Active conversation cleared.');
  };

  const handleThemeChange = (newTheme: ThemeMode) => {
    onSetTheme(newTheme);
    updateSetting('theme', newTheme);
    showToast(`Theme updated to ${newTheme}.`);
  };

  const handleConfirmReset = () => {
    resetSettings();
    onSetTheme('light');
    setShowResetDialog(false);
    showToast('Settings reset to defaults.');
  };

  return (
    <div className="space-y-6 max-w-4xl pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
            Workspace Settings
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Customize your interface appearance, chat preferences, and diagnostic inspector controls.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowResetDialog(true)}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors self-start sm:self-auto focus:outline-none focus:ring-2 focus:ring-slate-400 cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Defaults</span>
        </button>
      </div>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="p-3.5 bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 rounded-xl text-xs font-medium flex items-center gap-2 animate-in fade-in duration-200 shadow-2xs">
          <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Section 1: Appearance */}
      <div className="p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
          <Palette className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
          <h3 className="font-bold text-sm text-slate-900 dark:text-white">
            Appearance
          </h3>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Select your preferred color theme for the RuleBot application.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          {/* Light Theme Option */}
          <button
            type="button"
            onClick={() => handleThemeChange('light')}
            className={`p-4 rounded-xl border flex flex-col items-center gap-3 transition-all cursor-pointer ${
              currentTheme === 'light'
                ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/30 text-indigo-600 ring-2 ring-indigo-500/20'
                : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/40 text-slate-600 dark:text-slate-400 hover:border-slate-300'
            }`}
          >
            <div className="w-12 h-8 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center">
              <Sun className="w-4 h-4 text-slate-600" />
            </div>
            <span className="text-xs font-semibold">Light</span>
          </button>

          {/* Dark Theme Option */}
          <button
            type="button"
            onClick={() => handleThemeChange('dark')}
            className={`p-4 rounded-xl border flex flex-col items-center gap-3 transition-all cursor-pointer ${
              currentTheme === 'dark'
                ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400 ring-2 ring-indigo-500/20'
                : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/40 text-slate-600 dark:text-slate-400 hover:border-slate-300'
            }`}
          >
            <div className="w-12 h-8 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center">
              <Moon className="w-4 h-4 text-slate-200" />
            </div>
            <span className="text-xs font-semibold">Dark</span>
          </button>

          {/* System Theme Option */}
          <button
            type="button"
            onClick={() => handleThemeChange('system')}
            className={`p-4 rounded-xl border flex flex-col items-center gap-3 transition-all cursor-pointer ${
              currentTheme === 'system'
                ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/30 text-indigo-600 ring-2 ring-indigo-500/20'
                : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/40 text-slate-600 dark:text-slate-400 hover:border-slate-300'
            }`}
          >
            <div className="w-12 h-8 rounded-lg bg-gradient-to-r from-slate-100 to-slate-900 border border-slate-300 dark:border-slate-700 flex items-center justify-center">
              <Monitor className="w-4 h-4 text-slate-400" />
            </div>
            <span className="text-xs font-semibold">System</span>
          </button>
        </div>
      </div>

      {/* Section 2: Bot Configuration */}
      <div className="p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
          <Bot className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
          <h3 className="font-bold text-sm text-slate-900 dark:text-white">
            Bot Configuration
          </h3>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Customize local client display attributes and response persona preferences.
        </p>

        <div className="space-y-4 pt-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label htmlFor="bot-name-input" className="text-xs font-semibold text-slate-900 dark:text-slate-100 block">
                Assistant Display Name
              </label>
              <input
                id="bot-name-input"
                type="text"
                value={settings.botName || 'RuleBot'}
                onChange={(e) => {
                  updateSetting('botName', e.target.value);
                }}
                placeholder="e.g. RuleBot"
                className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-900 dark:text-slate-100 block">
                Response Style
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['formal', 'friendly', 'concise'] as ResponseStyle[]).map((style) => (
                  <button
                    key={style}
                    type="button"
                    onClick={() => {
                      updateSetting('responseStyle', style);
                      showToast(`Response style set to ${style}.`);
                    }}
                    className={`py-2 px-2.5 rounded-xl text-xs font-semibold capitalize transition-all cursor-pointer ${
                      settings.responseStyle === style
                        ? 'bg-indigo-600 text-white shadow-xs'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                    }`}
                  >
                    {style}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="bot-persona-input" className="text-xs font-semibold text-slate-900 dark:text-slate-100 block">
              Persona / Description
            </label>
            <input
              id="bot-persona-input"
              type="text"
              value={settings.botPersona || ''}
              onChange={(e) => updateSetting('botPersona', e.target.value)}
              placeholder="e.g. Deterministic rule-based conversational assistant"
              className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="p-3 bg-indigo-50/60 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/50 rounded-xl flex items-start gap-2.5 text-xs text-indigo-900 dark:text-indigo-200">
            <ShieldCheck className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
            <span>
              <strong>Deterministic Rule Enforcement:</strong> Rule definitions and matching patterns remain strictly governed by the backend Python engine. Client settings do not alter rule execution logic.
            </span>
          </div>
        </div>
      </div>

      {/* Section 3: Session Memory & Data Retention */}
      <div className="p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
          <Brain className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
          <h3 className="font-bold text-sm text-slate-900 dark:text-white">
            Session Memory &amp; Retention
          </h3>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Configure conversation persistence and local storage retention policies.
        </p>

        <div className="space-y-4 pt-1">
          <label className="flex items-center justify-between gap-3 cursor-pointer py-1.5">
            <div>
              <span className="text-xs font-semibold text-slate-900 dark:text-slate-100 block">
                Session Memory
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                When enabled, conversation context and records remain available during your application sessions.
              </span>
            </div>
            <input
              type="checkbox"
              checked={settings.sessionMemory !== false}
              onChange={(e) => {
                updateSetting('sessionMemory', e.target.checked);
                showToast(`Session memory ${e.target.checked ? 'enabled' : 'disabled'}.`);
              }}
              className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500 cursor-pointer"
            />
          </label>

          <div className="space-y-2 pt-1 border-t border-slate-100 dark:border-slate-800">
            <label className="text-xs font-semibold text-slate-900 dark:text-slate-100 block">
              Data Retention Window
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { id: 'all', label: 'Keep All Records' },
                { id: '30days', label: '30 Days' },
                { id: '7days', label: '7 Days' },
                { id: 'session', label: 'Session Only' },
              ].map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    updateSetting('dataRetention', item.id as DataRetention);
                    showToast(`Data retention set to ${item.label}.`);
                  }}
                  className={`py-2 px-3 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    (settings.dataRetention || 'all') === item.id
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
            <p className="text-[11px] text-slate-400">
              Records are stored strictly in local client storage. No external servers or cloud databases are used.
            </p>
          </div>
        </div>
      </div>

      {/* Section 4: Chat Preferences */}
      <div className="p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
          <MessageSquare className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
          <h3 className="font-bold text-sm text-slate-900 dark:text-white">
            Chat Preferences
          </h3>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Configure how the interactive chat interface responds to inputs.
        </p>

        <div className="space-y-3 pt-1">
          <label className="flex items-center justify-between gap-3 cursor-pointer py-1.5">
            <div>
              <span className="text-xs font-semibold text-slate-900 dark:text-slate-100 block">
                Enter to Send
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                Pressing Enter immediately sends the message. Shift+Enter creates a new line.
              </span>
            </div>
            <input
              type="checkbox"
              checked={settings.enterToSend !== false}
              onChange={(e) => updateSetting('enterToSend', e.target.checked)}
              className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500 cursor-pointer"
            />
          </label>

          <label className="flex items-center justify-between gap-3 cursor-pointer py-1.5">
            <div>
              <span className="text-xs font-semibold text-slate-900 dark:text-slate-100 block">
                Show Response Source Badges
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                Display tags for "Rule Match" or "Fallback" directly beneath messages.
              </span>
            </div>
            <input
              type="checkbox"
              checked={settings.showSourceBadges !== false}
              onChange={(e) => updateSetting('showSourceBadges', e.target.checked)}
              className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500 cursor-pointer"
            />
          </label>

          <label className="flex items-center justify-between gap-3 cursor-pointer py-1.5">
            <div>
              <span className="text-xs font-semibold text-slate-900 dark:text-slate-100 block">
                Show Message Timestamps
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                Display time metadata next to message bubbles.
              </span>
            </div>
            <input
              type="checkbox"
              checked={settings.showTimestamps !== false}
              onChange={(e) => updateSetting('showTimestamps', e.target.checked)}
              className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500 cursor-pointer"
            />
          </label>
        </div>
      </div>

      {/* Section 5: Interface Density */}
      <div className="p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
          <Layout className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
          <h3 className="font-bold text-sm text-slate-900 dark:text-white">
            Interface Density
          </h3>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Adjust the spatial layout and padding density for conversation views.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          <button
            type="button"
            onClick={() => {
              updateSetting('chatDensity', 'comfortable');
              showToast('Density updated to Comfortable.');
            }}
            className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
              settings.chatDensity === 'comfortable'
                ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/30 ring-2 ring-indigo-500/20'
                : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/40 hover:border-slate-300'
            }`}
          >
            <span className="text-xs font-bold text-slate-900 dark:text-white block">
              Comfortable (Default)
            </span>
            <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 block">
              Generous bubble padding with spacious typography and breathing room.
            </span>
          </button>

          <button
            type="button"
            onClick={() => {
              updateSetting('chatDensity', 'compact');
              showToast('Density updated to Compact.');
            }}
            className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
              settings.chatDensity === 'compact'
                ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/30 ring-2 ring-indigo-500/20'
                : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/40 hover:border-slate-300'
            }`}
          >
            <span className="text-xs font-bold text-slate-900 dark:text-white block">
              Compact
            </span>
            <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 block">
              Condensed vertical spacing for higher information density.
            </span>
          </button>
        </div>
      </div>

      {/* Section 6: Debug / Logic Inspector */}
      <div className="p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
          <Bug className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
          <h3 className="font-bold text-sm text-slate-900 dark:text-white">
            Debug &amp; Logic Inspector
          </h3>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Control the visibility of the real-time RuleBot Logic Inspector panel in the Chat workspace.
        </p>

        <div className="pt-1">
          <label className="flex items-center justify-between gap-3 cursor-pointer py-1.5">
            <div>
              <span className="text-xs font-semibold text-slate-900 dark:text-slate-100 block">
                Enable Logic Inspector Panel
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                Show live matching diagnostics, 4-stage pipeline stepper, and confidence metrics on desktop.
              </span>
            </div>
            <input
              type="checkbox"
              checked={settings.showInspector !== false}
              onChange={(e) => {
                updateSetting('showInspector', e.target.checked);
                showToast(`Logic Inspector ${e.target.checked ? 'enabled' : 'hidden'}.`);
              }}
              className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500 cursor-pointer"
            />
          </label>
        </div>
      </div>

      {/* Section 7: Data Management */}
      <div className="p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
          <Database className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
          <h3 className="font-bold text-sm text-slate-900 dark:text-white">
            Data Management
          </h3>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Manage local browser cache and conversation records.
        </p>

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 pt-2">
          <button
            type="button"
            onClick={handleClearActive}
            className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400 cursor-pointer"
          >
            Clear Active Chat
          </button>

          <button
            type="button"
            onClick={handleClearHistory}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-rose-50 dark:bg-rose-950/60 hover:bg-rose-100 dark:hover:bg-rose-900/60 text-rose-700 dark:text-rose-300 border border-rose-200/80 dark:border-rose-800/80 rounded-xl text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-rose-500 cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear Saved History Logs</span>
          </button>
        </div>
      </div>

      {/* Reset Confirmation Dialog */}
      <ResetSettingsDialog
        isOpen={showResetDialog}
        onClose={() => setShowResetDialog(false)}
        onConfirm={handleConfirmReset}
      />
    </div>
  );
};
