import React, { useState } from 'react';
import { Code2, ChevronDown, ChevronUp, Cpu } from 'lucide-react';
import { InspectorData } from '../../types/inspector';
import { Pipeline } from './Pipeline';
import { AnalysisDetails } from './AnalysisDetails';
import { MatchDetails } from './MatchDetails';

interface LogicInspectorProps {
  data: InspectorData;
}

export const LogicInspector: React.FC<LogicInspectorProps> = ({ data }) => {
  const [isMobileExpanded, setIsMobileExpanded] = useState(false);

  return (
    <div className="w-full lg:w-80 xl:w-96 flex flex-col bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs shrink-0 overflow-hidden">
      {/* Inspector Header (Collapsible toggle on mobile) */}
      <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/40 dark:bg-slate-900/40">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-indigo-50 dark:bg-indigo-950 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
            <Code2 className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white tracking-tight">
                RuleBot Logic
              </h3>
              {data.isIdle && (
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 font-mono">
                  Idle
                </span>
              )}
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Real-time pipeline & telemetry
            </p>
          </div>
        </div>

        {/* Mobile Collapse Toggle Button */}
        <button
          id="toggle-inspector-mobile-btn"
          onClick={() => setIsMobileExpanded(!isMobileExpanded)}
          className="lg:hidden p-1.5 rounded-lg text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          aria-label={isMobileExpanded ? 'Collapse inspector' : 'Expand inspector'}
        >
          {isMobileExpanded ? (
            <ChevronUp className="w-4 h-4" />
          ) : (
            <ChevronDown className="w-4 h-4" />
          )}
        </button>
      </div>

      {/* Main Content Area: Visible by default on lg+, expandable on mobile */}
      <div
        className={`p-4 sm:p-5 space-y-5 overflow-y-auto flex-1 ${
          isMobileExpanded ? 'block' : 'hidden lg:block'
        }`}
      >
        {/* Idle Notice Banner */}
        {data.isIdle && (
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-dashed border-slate-200 dark:border-slate-700 text-center space-y-1">
            <Cpu className="w-4 h-4 text-slate-400 mx-auto" />
            <p className="text-xs font-medium text-slate-600 dark:text-slate-300">
              Waiting for a message...
            </p>
            <p className="text-[10px] text-slate-400 dark:text-slate-500 leading-tight">
              Send a query or click a suggested prompt to inspect execution stages.
            </p>
          </div>
        )}

        {/* 4-Stage Execution Pipeline */}
        <Pipeline currentStage={data.currentStage} isIdle={data.isIdle} />

        {/* Current Analysis */}
        <AnalysisDetails
          isIdle={data.isIdle}
          currentIntent={data.currentIntent}
          matchStatus={data.matchStatus}
          confidence={data.confidence}
          sessionId={data.sessionId}
          responseSource={data.responseSource}
        />

        {/* Match Details */}
        <MatchDetails
          isIdle={data.isIdle}
          matchType={data.matchType}
          matchedPattern={data.matchedPattern}
          confidence={data.confidence}
        />
      </div>
    </div>
  );
};
