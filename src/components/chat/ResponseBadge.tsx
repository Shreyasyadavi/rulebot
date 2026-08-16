import React from 'react';
import { CheckCircle2, AlertCircle } from 'lucide-react';
import { ResponseType } from '../../types/chat';

interface ResponseBadgeProps {
  responseType: ResponseType;
  intentName?: string;
  confidence?: number;
}

export const ResponseBadge: React.FC<ResponseBadgeProps> = ({
  responseType,
  intentName,
  confidence,
}) => {
  if (responseType === 'rule') {
    return (
      <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[11px] font-medium bg-emerald-50 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 border border-emerald-200/80 dark:border-emerald-800/80">
        <CheckCircle2 className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
        <span>Rule Match</span>
        {intentName && (
          <span className="font-mono text-[10px] text-emerald-800 dark:text-emerald-200">
            : {intentName}
          </span>
        )}
        {confidence !== undefined && (
          <span className="text-[10px] opacity-75 font-mono">
            ({confidence.toFixed(2)})
          </span>
        )}
      </div>
    );
  }

  return (
    <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[11px] font-medium bg-amber-50 dark:bg-amber-950/70 text-amber-700 dark:text-amber-300 border border-amber-200/80 dark:border-amber-800/80">
      <AlertCircle className="w-3 h-3 text-amber-600 dark:text-amber-400" />
      <span>Fallback</span>
    </div>
  );
};

