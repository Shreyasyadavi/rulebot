import React from 'react';
import {
  Search,
  Calendar,
  MessageSquare,
  Trash2,
  CheckCircle2,
  AlertCircle,
  ChevronRight,
  Bot,
} from 'lucide-react';
import { useHistory } from '../../hooks/useHistory';
import { HistoryDetailModal } from './HistoryDetailModal';
import { ClearHistoryDialog } from './ClearHistoryDialog';
import { EmptyHistoryState } from './EmptyHistoryState';
import { HistorySessionRecord } from '../../types/history';

export const HistoryList: React.FC = () => {
  const {
    sessions,
    allSessionsCount,
    loading,
    error,
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    selectedSession,
    setSelectedSession,
    showClearDialog,
    setShowClearDialog,
    clearHistory,
    refreshHistory,
  } = useHistory();

  const getStatusBadge = (status: HistorySessionRecord['status']) => {
    if (status === 'RESOLVED') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200/80 dark:border-emerald-800/80">
          <CheckCircle2 className="w-3 h-3" />
          RESOLVED
        </span>
      );
    }
    if (status === 'FALLBACK') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border border-amber-200/80 dark:border-amber-800/80">
          <AlertCircle className="w-3 h-3" />
          FALLBACK
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
        INCOMPLETE
      </span>
    );
  };

  const getResponseSourceBadge = (session: HistorySessionRecord) => {
    const hasRule = session.responseSources.includes('rule');
    if (hasRule) {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-mono font-semibold bg-indigo-50 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 border border-indigo-200/60 dark:border-indigo-800/60">
          <Bot className="w-2.5 h-2.5" />
          Rule Match
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-mono font-semibold bg-amber-50 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300 border border-amber-200/60 dark:border-amber-800/60">
        <AlertCircle className="w-2.5 h-2.5" />
        Fallback
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2.5">
            <span>Conversation History</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full font-mono font-bold bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
              {allSessionsCount} {allSessionsCount === 1 ? 'Session' : 'Sessions'}
            </span>
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Browse and inspect previous test sessions, intents triggered, and full conversational transcripts.
          </p>
        </div>

        {allSessionsCount > 0 && (
          <button
            onClick={() => setShowClearDialog(true)}
            aria-label="Clear conversation history"
            className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-rose-50 dark:bg-rose-950/60 hover:bg-rose-100 dark:hover:bg-rose-900/60 text-rose-700 dark:text-rose-300 border border-rose-200/80 dark:border-rose-800/80 rounded-xl text-xs font-semibold shadow-2xs transition-colors self-start sm:self-auto focus:outline-none focus:ring-2 focus:ring-rose-500"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear History</span>
          </button>
        )}
      </div>

      {error && (
        <div className="p-4 bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800/80 rounded-xl flex items-center justify-between gap-3 text-xs text-amber-800 dark:text-amber-300">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
          <button
            onClick={refreshHistory}
            className="px-2.5 py-1 bg-amber-100 dark:bg-amber-900/80 hover:bg-amber-200 dark:hover:bg-amber-800 text-amber-900 dark:text-amber-200 rounded-lg font-semibold transition-colors"
          >
            Retry
          </button>
        </div>
      )}

      {/* Filter & Search Bar */}
      {allSessionsCount > 0 && (
        <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search conversations, sessions, intents, or text..."
              aria-label="Search conversation history"
              className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="flex items-center gap-2">
            {['ALL', 'RESOLVED', 'FALLBACK'].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                  statusFilter === status
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Session Cards List */}
      {sessions.length > 0 ? (
        <div className="space-y-3.5" role="feed" aria-label="Conversation sessions list">
          {sessions.map((session) => (
            <div
              key={session.sessionId}
              role="button"
              tabIndex={0}
              aria-label={`View conversation transcript for Session ${session.sessionId}`}
              onClick={() => setSelectedSession(session)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  setSelectedSession(session);
                }
              }}
              className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs hover:border-indigo-300 dark:hover:border-indigo-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 transition-all cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4 group"
            >
              <div className="space-y-2 flex-1">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <span className="font-mono font-bold text-slate-900 dark:text-white text-sm group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    Session {session.sessionId}
                  </span>
                  {getStatusBadge(session.status)}
                  {getResponseSourceBadge(session)}
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-1 italic">
                  "{session.snippet}"
                </p>

                <div className="flex items-center gap-4 text-[11px] text-slate-400 dark:text-slate-500 font-mono">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {new Date(session.startedAt).toLocaleString([], {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <MessageSquare className="w-3 h-3" />
                    {session.messageCount} {session.messageCount === 1 ? 'Message' : 'Messages'}
                  </span>
                </div>
              </div>

              {/* Matched Intents Tags */}
              <div className="md:border-l md:border-slate-100 dark:md:border-slate-800 md:pl-6 space-y-1.5 md:text-right shrink-0">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 block">
                  Matched Intent
                </span>
                <div className="flex items-center gap-1.5 flex-wrap md:justify-end">
                  {session.matchedIntents.length > 0 ? (
                    session.matchedIntents.map((intent) => (
                      <span
                        key={intent}
                        className="px-2.5 py-0.5 rounded-md text-[11px] font-mono font-medium bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-200/50 dark:border-indigo-800/50"
                      >
                        @{intent}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-slate-400 font-mono">No predefined intent</span>
                  )}
                  <div className="p-1 rounded-md text-slate-400 group-hover:text-indigo-600 transition-colors hidden md:block">
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : allSessionsCount > 0 ? (
        <div className="p-10 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
          <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
            No conversation records matched your search.
          </p>
          <p className="text-xs text-slate-400">
            Try adjusting your search query or status filter.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setStatusFilter('ALL');
            }}
            className="px-3.5 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 rounded-xl transition-colors"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <EmptyHistoryState />
      )}

      {/* Detail Modal */}
      <HistoryDetailModal
        session={selectedSession}
        onClose={() => setSelectedSession(null)}
      />

      {/* Clear Confirmation Dialog */}
      <ClearHistoryDialog
        isOpen={showClearDialog}
        onClose={() => setShowClearDialog(false)}
        onConfirm={clearHistory}
      />
    </div>
  );
};
