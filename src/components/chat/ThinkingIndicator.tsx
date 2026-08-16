import React from 'react';
import { Bot } from 'lucide-react';

export const ThinkingIndicator: React.FC = () => {
  return (
    <div className="flex items-start gap-3 w-full justify-start animate-fade-in">
      <div className="w-8 h-8 rounded-xl bg-indigo-100 dark:bg-indigo-950/80 border border-indigo-200/50 dark:border-indigo-800/50 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5 shadow-xs">
        <Bot className="w-4 h-4 animate-pulse" />
      </div>

      <div className="flex flex-col items-start space-y-1">
        <div className="px-4 py-3 bg-slate-100 dark:bg-slate-800/90 text-slate-700 dark:text-slate-300 rounded-2xl rounded-tl-xs border border-slate-200/60 dark:border-slate-700/60 flex items-center gap-2 text-xs font-medium shadow-xs">
          <div className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 dark:bg-indigo-400 animate-bounce" style={{ animationDelay: '0ms' }} />
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 dark:bg-indigo-400 animate-bounce" style={{ animationDelay: '150ms' }} />
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 dark:bg-indigo-400 animate-bounce" style={{ animationDelay: '300ms' }} />
          </div>
          <span className="text-slate-500 dark:text-slate-400">RuleBot is thinking...</span>
        </div>
      </div>
    </div>
  );
};
