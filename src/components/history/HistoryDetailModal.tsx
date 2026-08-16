import React, { useEffect } from 'react';
import { X, Calendar, MessageSquare, CheckCircle2, AlertCircle, Bot, User } from 'lucide-react';
import { HistorySessionRecord } from '../../types/history';

interface HistoryDetailModalProps {
  session: HistorySessionRecord | null;
  onClose: () => void;
}

export const HistoryDetailModal: React.FC<HistoryDetailModalProps> = ({ session, onClose }) => {
  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!session) return null;

  const getStatusBadge = () => {
    if (session.status === 'RESOLVED') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200/80 dark:border-emerald-800/80">
          <CheckCircle2 className="w-3 h-3" />
          RESOLVED
        </span>
      );
    }
    if (session.status === 'FALLBACK') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border border-amber-200/80 dark:border-amber-800/80">
          <AlertCircle className="w-3 h-3" />
          FALLBACK
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
        INCOMPLETE
      </span>
    );
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-150"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden flex flex-col max-h-[90vh]"
        role="dialog"
        aria-modal="true"
        aria-labelledby="session-details-title"
      >
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2.5">
              <h3 id="session-details-title" className="font-bold text-base text-slate-900 dark:text-white font-mono">
                Session {session.sessionId}
              </h3>
              {getStatusBadge()}
            </div>
            <div className="flex items-center gap-3 text-xs text-slate-400 font-mono">
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

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500"
            aria-label="Close session transcript"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Matched Intents Banner */}
        <div className="px-6 py-2.5 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800 flex items-center gap-2 overflow-x-auto text-xs">
          <span className="text-[10px] uppercase font-bold text-slate-400 font-mono tracking-wider">
            Matched Intent:
          </span>
          {session.matchedIntents.length > 0 ? (
            session.matchedIntents.map((intent) => (
              <span
                key={intent}
                className="px-2 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-mono text-[11px] font-medium border border-indigo-200/50 dark:border-indigo-800/50"
              >
                @{intent}
              </span>
            ))
          ) : (
            <span className="text-xs text-slate-400 font-mono">No predefined intent</span>
          )}
        </div>

        {/* Message Transcript */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1">
          {session.messages.map((msg, index) => {
            const isUser = msg.role === 'user';
            const isRule = msg.responseType === 'rule';

            return (
              <div
                key={msg.id || index}
                className={`flex gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
              >
                <div
                  className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 text-xs font-bold ${
                    isUser
                      ? 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200'
                      : 'bg-indigo-600 text-white'
                  }`}
                >
                  {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>

                <div
                  className={`max-w-[80%] rounded-2xl p-3.5 space-y-1 text-xs leading-relaxed ${
                    isUser
                      ? 'bg-indigo-600 text-white rounded-tr-xs'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-tl-xs'
                  }`}
                >
                  <div>{msg.content}</div>

                  <div
                    className={`flex items-center gap-2 pt-1 text-[10px] font-mono ${
                      isUser ? 'text-indigo-200 justify-end' : 'text-slate-400 justify-between'
                    }`}
                  >
                    {!isUser && (
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className={`font-semibold uppercase tracking-wider ${isRule ? 'text-indigo-600 dark:text-indigo-400' : 'text-amber-600 dark:text-amber-400'}`}>
                          {isRule ? 'Rule Match' : 'Fallback'}
                        </span>
                        {msg.intent && (
                          <span className="text-slate-500 dark:text-slate-400">
                            • @{msg.intent}
                          </span>
                        )}
                        {typeof msg.confidence === 'number' && msg.confidence > 0 && (
                          <span className="text-emerald-600 dark:text-emerald-400">
                            • {Math.round(msg.confidence * 100)}% conf
                          </span>
                        )}
                      </div>
                    )}
                    <span>{msg.timestamp}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 bg-slate-50 dark:bg-slate-800/40 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
          <span className="text-slate-500 font-mono">Session ID: {session.sessionId}</span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200 rounded-xl font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
