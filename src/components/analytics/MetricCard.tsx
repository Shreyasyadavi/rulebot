import React from 'react';
import { LucideIcon, TrendingUp } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string | number;
  subtext?: string;
  icon: LucideIcon;
  trend?: string;
  accentColor?: string;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  subtext,
  icon: Icon,
  trend,
}) => {
  return (
    <div className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-mono font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
          {title}
        </span>
        <Icon className="w-4 h-4 text-indigo-500 dark:text-indigo-400" />
      </div>

      <div className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white font-mono">
        {value}
      </div>

      {trend && (
        <div className="flex items-center gap-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
          <TrendingUp className="w-3.5 h-3.5" />
          <span>{trend}</span>
        </div>
      )}

      {subtext && !trend && (
        <div className="text-xs text-slate-500 dark:text-slate-400">
          {subtext}
        </div>
      )}
    </div>
  );
};
