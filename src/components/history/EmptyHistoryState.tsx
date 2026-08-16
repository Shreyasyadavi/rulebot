import React from 'react';
import { History as HistoryIcon, MessageSquarePlus } from 'lucide-react';

interface EmptyHistoryStateProps {
  onStartChat?: () => void;
}

export const EmptyHistoryState: React.FC<EmptyHistoryStateProps> = () => {
  return (
    <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
      <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto">
        <HistoryIcon className="w-6 h-6" />
      </div>
      <div className="space-y-1 max-w-sm mx-auto">
        <h3 className="text-base font-bold text-slate-900 dark:text-white">
          No conversation history yet.
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
          History will appear after using RuleBot. Start a conversation in the Chat workspace to generate conversation records.
        </p>
      </div>
    </div>
  );
};
