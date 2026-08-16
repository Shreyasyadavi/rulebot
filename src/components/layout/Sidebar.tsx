import React from 'react';
import {
  Bot,
  MessageSquare,
  GitFork,
  History,
  TrendingUp,
  Settings,
  Cpu,
  Layers,
  CheckCircle2,
} from 'lucide-react';
import { TabType } from '../../types';

interface SidebarProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onTabChange,
  onCloseMobile,
}) => {
  const navItems: { id: TabType; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'chat', label: 'Chat', icon: MessageSquare },
    { id: 'intents', label: 'Intents', icon: GitFork },
    { id: 'history', label: 'History', icon: History },
    { id: 'analytics', label: 'Analytics', icon: TrendingUp },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const handleNavClick = (id: TabType) => {
    onTabChange(id);
    if (onCloseMobile) {
      onCloseMobile();
    }
  };

  return (
    <aside className="w-64 h-full flex flex-col justify-between bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 select-none transition-colors duration-200">
      {/* Brand Header */}
      <div>
        <div className="p-6 pb-5 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 dark:bg-indigo-500 text-white flex items-center justify-center shadow-md shadow-indigo-500/20">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-lg text-slate-900 dark:text-white tracking-tight">
                RuleBot
              </span>
              <span className="px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 rounded">
                v1.0
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              Rule-Based AI Assistant
            </p>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="px-3 py-2 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                id={`nav-${item.id}`}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all text-left group relative ${
                  isActive
                    ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 font-semibold shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100/80 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-slate-100'
                }`}
              >
                {isActive && (
                  <span className="absolute left-0 top-2 bottom-2 w-1 bg-indigo-600 dark:bg-indigo-400 rounded-r-full" />
                )}
                <Icon
                  className={`w-4 h-4 transition-transform group-hover:scale-110 ${
                    isActive
                      ? 'text-indigo-600 dark:text-indigo-400'
                      : 'text-slate-400 dark:text-slate-500 group-hover:text-slate-700 dark:group-hover:text-slate-300'
                  }`}
                />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Engine Info Box & Footer */}
      <div className="p-4 m-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-800 dark:text-slate-200">
            <Cpu className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
            <span>Rule Engine</span>
          </div>
          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Active
          </span>
        </div>
        <p className="text-[11px] leading-relaxed text-slate-500 dark:text-slate-400">
          50+ Predefined intents, pattern matching &amp; deterministic responses.
        </p>
        <div className="pt-1 flex items-center gap-1 text-[11px] text-indigo-600 dark:text-indigo-400 font-medium">
          <CheckCircle2 className="w-3 h-3" />
          <span>Deterministic Priority</span>
        </div>
      </div>
    </aside>
  );
};
