import React from 'react';
import {
  MessageSquare,
  MessagesSquare,
  CheckCircle,
  AlertTriangle,
  Calendar,
  Layers,
  RefreshCw,
  BarChart2,
} from 'lucide-react';
import { useAnalytics } from '../hooks/useAnalytics';
import { MetricCard } from '../components/analytics/MetricCard';
import { ActivityChart } from '../components/analytics/ActivityChart';
import { ResponseDistributionChart } from '../components/analytics/ResponseDistributionChart';
import { TopIntentsList } from '../components/analytics/TopIntentsList';

export const Analytics: React.FC = () => {
  const { metrics, timeRange, setTimeRange, loading, error, refreshMetrics } = useAnalytics();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
            Analytics Overview
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Monitor deterministic rule performance, match rates, and active intent triggers.
          </p>
        </div>

        <div className="flex items-center gap-1 bg-white dark:bg-slate-900 p-1 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs self-start sm:self-auto">
          {(['7d', '30d', 'all'] as const).map((r) => (
            <button
              key={r}
              onClick={() => setTimeRange(r)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                timeRange === r
                  ? 'bg-indigo-600 text-white shadow-2xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {r === '7d' ? 'Last 7 Days' : r === '30d' ? 'Last 30 Days' : 'All Time'}
            </button>
          ))}
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-8 space-y-4">
          <div className="flex items-center justify-center gap-2 text-sm text-slate-500 dark:text-slate-400">
            <RefreshCw className="w-4 h-4 animate-spin text-indigo-500" />
            <span>Loading analytics metrics...</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-24 bg-slate-100 dark:bg-slate-800/60 rounded-xl animate-pulse" />
            ))}
          </div>
        </div>
      )}

      {/* Error State */}
      {!loading && error && (
        <div className="p-8 text-center bg-white dark:bg-slate-900 rounded-2xl border border-amber-200 dark:border-amber-900/50 space-y-4">
          <div className="w-12 h-12 rounded-full bg-amber-50 dark:bg-amber-950 flex items-center justify-center mx-auto text-amber-600 dark:text-amber-400">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-slate-900 dark:text-white text-base">
            Unable to load analytics right now.
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
            Please check the data source and try again.
          </p>
          <button
            onClick={refreshMetrics}
            className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Retry Loading</span>
          </button>
        </div>
      )}

      {/* KPI Cards Grid */}
      {!loading && !error && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            title="Total Conversations"
            value={metrics.totalConversations}
            icon={MessageSquare}
            subtext={metrics.totalConversations === 1 ? '1 active session' : `${metrics.totalConversations} active sessions`}
          />

          <MetricCard
            title="Total Messages"
            value={metrics.totalMessages}
            icon={MessagesSquare}
            subtext={metrics.totalMessages === 1 ? '1 processed turn' : `${metrics.totalMessages} processed turns`}
          />

          <MetricCard
            title="Rule Match Rate"
            value={`${metrics.ruleMatchRate}%`}
            icon={CheckCircle}
            subtext={`${metrics.ruleMatches} of ${metrics.totalResponses} responses`}
          />

          <MetricCard
            title="Fallback Rate"
            value={`${metrics.fallbackRate}%`}
            icon={AlertTriangle}
            subtext={`${metrics.fallbackResponses} of ${metrics.totalResponses} responses`}
          />
        </div>
      )}

      {/* Empty State when no conversation data exists */}
      {!loading && !error && metrics.totalConversations === 0 && (
        <div className="p-10 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
          <BarChart2 className="w-10 h-10 text-slate-400 mx-auto" />
          <h3 className="font-bold text-slate-900 dark:text-white text-base">No conversation data yet.</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
            Analytics will appear after RuleBot conversations are processed. Start a conversation in the Chat workspace to generate performance metrics.
          </p>
        </div>
      )}

      {/* Functional Charts Section */}
      {!loading && !error && metrics.totalConversations > 0 && (
        <>
          {/* 2-Column Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left: Conversation Activity Chart */}
            <div className="lg:col-span-2 p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white">
                    Conversation Activity
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Message volume and daily user interactions
                  </p>
                </div>
                <span className="flex items-center gap-1 text-xs text-indigo-600 dark:text-indigo-400 font-mono font-medium">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{timeRange === '30d' ? '30-Day Activity' : timeRange === 'all' ? 'All Time Activity' : '7-Day Activity'}</span>
                </span>
              </div>

              <ActivityChart data={metrics.activityByDay} />
            </div>

            {/* Right: Response Distribution Chart */}
            <div className="p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4 flex flex-col justify-between">
              <div className="space-y-1">
                <h3 className="font-bold text-slate-900 dark:text-white">
                  Response Routing
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Deterministic Rule Engine vs. Local Fallback
                </p>
              </div>

              <ResponseDistributionChart data={metrics.responseDistribution} />
            </div>
          </div>

          {/* Bottom Section: Top Intents */}
          <div className="p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white">
                  Most Triggered Intent Rules
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Frequently matched user query classifications
                </p>
              </div>
              <span className="text-xs font-mono font-semibold text-slate-400">
                Top {metrics.topIntents.length} {metrics.topIntents.length === 1 ? 'Intent' : 'Intents'}
              </span>
            </div>

            <TopIntentsList intents={metrics.topIntents} />
          </div>
        </>
      )}
    </div>
  );
};


