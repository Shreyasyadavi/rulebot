import React from 'react';
import { TopIntentStat } from '../../types/analytics';
import { Layers } from 'lucide-react';

interface TopIntentsListProps {
  intents: TopIntentStat[];
}

export const TopIntentsList: React.FC<TopIntentsListProps> = ({ intents }) => {
  if (intents.length === 0) {
    return (
      <div className="py-6 text-center text-xs text-slate-500 dark:text-slate-400 space-y-2">
        <Layers className="w-6 h-6 mx-auto text-slate-400 dark:text-slate-500" />
        <p className="font-medium text-slate-700 dark:text-slate-300">No Intent Triggers Logged Yet</p>
        <p className="text-[11px] max-w-sm mx-auto">
          Predefined rules matched in conversations will appear here ranked by trigger frequency.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {intents.map((item) => (
        <div key={item.name} className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className="font-mono font-medium text-slate-800 dark:text-slate-200">
                @{item.name}
              </span>
              <span className="px-1.5 py-0.5 rounded text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400">
                {item.category}
              </span>
            </div>
            <span className="font-mono font-bold text-slate-600 dark:text-slate-400">
              {item.count} {item.count === 1 ? 'trigger' : 'triggers'}
            </span>
          </div>

          <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
            <div
              style={{ width: `${Math.max(item.percentage, 8)}%` }}
              className="h-full bg-indigo-600 dark:bg-indigo-500 rounded-full transition-all duration-500"
            />
          </div>
        </div>
      ))}
    </div>
  );
};

