import React from 'react';
import { Check, Loader2, Circle, LucideIcon } from 'lucide-react';
import { StepStatus } from '../../types/inspector';

interface PipelineStepProps {
  stepNumber: number;
  name: string;
  description: string;
  status: StepStatus;
  icon: LucideIcon;
  isLast?: boolean;
}

export const PipelineStep: React.FC<PipelineStepProps> = ({
  stepNumber,
  name,
  description,
  status,
  icon: Icon,
  isLast = false,
}) => {
  const getBadgeStyle = () => {
    switch (status) {
      case 'completed':
        return 'bg-emerald-600 text-white shadow-xs';
      case 'active':
        return 'bg-indigo-600 text-white shadow-xs ring-4 ring-indigo-100 dark:ring-indigo-950/70 animate-pulse';
      case 'failed':
        return 'bg-rose-600 text-white shadow-xs';
      case 'idle':
      default:
        return 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 border border-slate-200 dark:border-slate-700';
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'completed':
        return <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">Completed</span>;
      case 'active':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-indigo-600 dark:text-indigo-400">
            <Loader2 className="w-2.5 h-2.5 animate-spin" /> Processing
          </span>
        );
      case 'failed':
        return <span className="text-[10px] font-semibold text-rose-600 dark:text-rose-400">Failed</span>;
      case 'idle':
      default:
        return <span className="text-[10px] text-slate-400 dark:text-slate-500">Waiting</span>;
    }
  };

  return (
    <div className="relative flex items-start gap-3.5 group">
      {/* Line connecting to next step */}
      {!isLast && (
        <div
          className={`absolute left-4.5 top-9 bottom-0 w-0.5 -ml-px transition-colors duration-300 ${
            status === 'completed'
              ? 'bg-emerald-500/80 dark:bg-emerald-500/60'
              : status === 'active'
              ? 'bg-indigo-300 dark:bg-indigo-700'
              : 'bg-slate-200 dark:bg-slate-800'
          }`}
          style={{ height: 'calc(100% - 10px)' }}
        />
      )}

      {/* Stage Number / Status Icon */}
      <div
        className={`w-9 h-9 rounded-xl flex items-center justify-center text-xs font-bold shrink-0 transition-all duration-300 z-10 ${getBadgeStyle()}`}
      >
        {status === 'completed' ? (
          <Check className="w-4 h-4 stroke-[2.5]" />
        ) : status === 'active' ? (
          <Icon className="w-4 h-4 animate-bounce" />
        ) : (
          <span className="font-mono text-xs">{stepNumber}</span>
        )}
      </div>

      {/* Step Info */}
      <div className="flex-1 min-w-0 pb-5">
        <div className="flex items-center justify-between gap-2">
          <h5
            className={`text-xs font-semibold tracking-tight transition-colors ${
              status === 'active'
                ? 'text-indigo-600 dark:text-indigo-400'
                : status === 'completed'
                ? 'text-slate-900 dark:text-white'
                : 'text-slate-500 dark:text-slate-400'
            }`}
          >
            {name}
          </h5>
          {getStatusText()}
        </div>
        <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug mt-0.5">
          {description}
        </p>
      </div>
    </div>
  );
};
