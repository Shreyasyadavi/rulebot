import React from 'react';
import { Sparkles, CheckCircle2, AlertCircle } from 'lucide-react';
import { MatchStatus, InspectorResponseType } from '../../types/inspector';

interface AnalysisDetailsProps {
  isIdle: boolean;
  currentIntent: string;
  matchStatus: MatchStatus;
  confidence: number;
  sessionId: string;
  responseSource: InspectorResponseType;
}

export const AnalysisDetails: React.FC<AnalysisDetailsProps> = ({
  isIdle,
  currentIntent,
  matchStatus,
  confidence,
  sessionId,
  responseSource,
}) => {
  const getStatusBadge = () => {
    if (isIdle) {
      return (
        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[11px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400">
          <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
          Standby
        </span>
      );
    }

    if (matchStatus === 'Matched') {
      return (
        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[11px] font-semibold bg-emerald-50 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 border border-emerald-200/80 dark:border-emerald-800/80">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          Matched
        </span>
      );
    }

    if (matchStatus === 'Evaluating') {
      return (
        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[11px] font-semibold bg-indigo-50 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-300 border border-indigo-200/80 dark:border-indigo-800/80">
          <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-ping" />
          Evaluating
        </span>
      );
    }

    if (matchStatus === 'No Rule Match') {
      return (
        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[11px] font-semibold bg-amber-50 dark:bg-amber-950/70 text-amber-700 dark:text-amber-300 border border-amber-200/80 dark:border-amber-800/80">
          <AlertCircle className="w-3 h-3 text-amber-600 dark:text-amber-400" />
          No Rule Match
        </span>
      );
    }


    if (matchStatus === 'Gemini Fallback') {
      return (
        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[11px] font-semibold bg-purple-50 dark:bg-purple-950/70 text-purple-700 dark:text-purple-300 border border-purple-200/80 dark:border-purple-800/80">
          <Sparkles className="w-3 h-3 text-purple-600 dark:text-purple-400" />
          Gemini Fallback
        </span>
      );
    }

    if (matchStatus === 'Fallback Error') {
      return (
        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[11px] font-semibold bg-rose-50 dark:bg-rose-950/70 text-rose-700 dark:text-rose-300 border border-rose-200/80 dark:border-rose-800/80">
          <AlertCircle className="w-3 h-3 text-rose-600 dark:text-rose-400" />
          Fallback Error
        </span>
      );
    }

    return (
      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[11px] font-semibold bg-amber-50 dark:bg-amber-950/70 text-amber-700 dark:text-amber-300 border border-amber-200/80 dark:border-amber-800/80">
        <AlertCircle className="w-3 h-3 text-amber-600 dark:text-amber-400" />
        Fallback
      </span>
    );
  };

  const getSourceBadge = () => {
    if (isIdle || responseSource === 'none') {
      return <span className="text-slate-400 dark:text-slate-500 text-[11px]">—</span>;
    }

    if (responseSource === 'rule') {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium bg-emerald-50 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 border border-emerald-200/70 dark:border-emerald-800/70">
          <CheckCircle2 className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
          Rule Match
        </span>
      );
    }

    if (responseSource === 'gemini') {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium bg-purple-50 dark:bg-purple-950/70 text-purple-700 dark:text-purple-300 border border-purple-200/70 dark:border-purple-800/70">
          <Sparkles className="w-3 h-3 text-purple-600 dark:text-purple-400" />
          Gemini Fallback
        </span>
      );
    }

    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium bg-amber-50 dark:bg-amber-950/70 text-amber-700 dark:text-amber-300 border border-amber-200/70 dark:border-amber-800/70">
        <AlertCircle className="w-3 h-3 text-amber-600 dark:text-amber-400" />
        Fallback
      </span>
    );
  };

  return (
    <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 space-y-3 shadow-2xs">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-bold tracking-wider uppercase text-slate-500 dark:text-slate-400">
          Current Analysis
        </span>
        <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
      </div>

      <div className="space-y-2 text-xs">
        <div className="flex items-center justify-between py-1 border-b border-slate-200/60 dark:border-slate-700/60">
          <span className="text-slate-500 dark:text-slate-400">Current Intent</span>
          <span
            className={`px-2 py-0.5 rounded-md font-mono text-[11px] font-semibold ${
              isIdle
                ? 'bg-slate-200/60 dark:bg-slate-700 text-slate-500 dark:text-slate-400'
                : 'bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300'
            }`}
          >
            {isIdle ? 'idle' : currentIntent}
          </span>
        </div>

        <div className="flex items-center justify-between py-1 border-b border-slate-200/60 dark:border-slate-700/60">
          <span className="text-slate-500 dark:text-slate-400">Match Status</span>
          {getStatusBadge()}
        </div>

        <div className="flex items-center justify-between py-1 border-b border-slate-200/60 dark:border-slate-700/60">
          <span className="text-slate-500 dark:text-slate-400">Response Source</span>
          {getSourceBadge()}
        </div>

        <div className="flex items-center justify-between py-1 border-b border-slate-200/60 dark:border-slate-700/60">
          <span className="text-slate-500 dark:text-slate-400">Confidence</span>
          <span className="font-mono font-bold text-slate-800 dark:text-slate-200">
            {isIdle ? '0%' : `${Math.round(confidence * 100)}%`}
          </span>
        </div>

        <div className="flex items-center justify-between py-1">
          <span className="text-slate-500 dark:text-slate-400">Session ID</span>
          <span className="font-mono text-slate-600 dark:text-slate-300 text-[11px]">
            {sessionId}
          </span>
        </div>
      </div>
    </div>
  );
};
