import React from 'react';
import { Tag, KeyRound, Gauge } from 'lucide-react';
import { MatchType } from '../../types/inspector';

interface MatchDetailsProps {
  isIdle: boolean;
  matchType: MatchType;
  matchedPattern: string;
  confidence: number;
}

export const MatchDetails: React.FC<MatchDetailsProps> = ({
  isIdle,
  matchType,
  matchedPattern,
  confidence,
}) => {
  return (
    <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 space-y-3 shadow-2xs">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-bold tracking-wider uppercase text-slate-500 dark:text-slate-400">
          Match Details
        </span>
        <Tag className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
      </div>

      <div className="space-y-2 text-xs">
        <div className="flex items-center justify-between py-1 border-b border-slate-200/60 dark:border-slate-700/60">
          <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
            <KeyRound className="w-3.5 h-3.5 text-slate-400" /> Match Type
          </span>
          <span className="font-mono text-slate-700 dark:text-slate-300 font-semibold text-[11px]">
            {isIdle ? 'None' : matchType}
          </span>
        </div>

        <div className="flex items-center justify-between py-1 border-b border-slate-200/60 dark:border-slate-700/60">
          <span className="text-slate-500 dark:text-slate-400">Matched Pattern</span>
          <span
            className={`font-mono text-[11px] max-w-[140px] truncate ${
              isIdle
                ? 'text-slate-400'
                : 'text-indigo-600 dark:text-indigo-400 font-medium bg-indigo-50 dark:bg-indigo-950/60 px-1.5 py-0.5 rounded'
            }`}
            title={matchedPattern}
          >
            {isIdle ? '—' : `"${matchedPattern}"`}
          </span>
        </div>

        <div className="flex items-center justify-between py-1">
          <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
            <Gauge className="w-3.5 h-3.5 text-slate-400" /> Confidence
          </span>
          <span className="font-mono font-bold text-slate-800 dark:text-slate-200">
            {isIdle ? '0%' : `${Math.round(confidence * 100)}%`}
          </span>
        </div>
      </div>
    </div>
  );
};
