import React from 'react';
import {
  Menu,
  Sun,
  Moon,
  RotateCcw,
  Sparkles,
  ShieldCheck,
} from 'lucide-react';
import { TabType, ThemeMode } from '../../types';

interface HeaderProps {
  activeTab: TabType;
  theme: ThemeMode;
  onToggleTheme: () => void;
  onOpenMobileMenu: () => void;
  onClearChat?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  theme,
  onToggleTheme,
  onOpenMobileMenu,
  onClearChat,
}) => {
  const pageTitles: Record<TabType, { title: string; subtitle: string }> = {
    chat: {
      title: 'Chat Workspace',
      subtitle: 'Rule-based deterministic conversation with live logic tracer',
    },
    intents: {
      title: 'Intents',
      subtitle: 'Manage and explore rule-based matching patterns & responses',
    },
    analytics: {
      title: 'Analytics Overview',
      subtitle: 'Monitor rule-based AI performance and conversational metrics',
    },
    history: {
      title: 'History',
      subtitle: 'Review previous RuleBot sessions and execution logs',
    },
    settings: {
      title: 'Workspace Settings',
      subtitle: 'Manage rules, behavior, and visual preferences',
    },
  };

  const { title, subtitle } = pageTitles[activeTab];

  return (
    <header className="h-16 px-4 sm:px-6 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between z-10 transition-colors duration-200">
      <div className="flex items-center gap-3">
        {/* Mobile menu trigger */}
        <button
          id="mobile-menu-toggle"
          onClick={onOpenMobileMenu}
          className="lg:hidden p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          aria-label="Open navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Page Title & Subtitle */}
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white tracking-tight">
              {title}
            </h1>
            <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/60">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Online
            </span>
          </div>
          <p className="hidden md:block text-xs text-slate-500 dark:text-slate-400">
            {subtitle}
          </p>
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-2 sm:gap-3">
        {activeTab === 'chat' && onClearChat && (
          <button
            id="header-clear-chat"
            onClick={onClearChat}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors"
            title="Reset active chat stream"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Clear Chat</span>
          </button>
        )}

        {/* Theme Toggle */}
        <button
          id="theme-toggle"
          onClick={onToggleTheme}
          className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
          title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} mode`}
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? (
            <Sun className="w-4 h-4 text-amber-400" />
          ) : (
            <Moon className="w-4 h-4 text-slate-600" />
          )}
        </button>
      </div>
    </header>
  );
};
