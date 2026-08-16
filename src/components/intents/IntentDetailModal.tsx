import React, { useEffect } from 'react';
import { X, Sparkles, Code2, Tag, Layers, CheckCircle2, Shield } from 'lucide-react';
import { Intent } from '../../types/intents';

interface IntentDetailModalProps {
  intent: Intent | null;
  onClose: () => void;
}

export const IntentDetailModal: React.FC<IntentDetailModalProps> = ({ intent, onClose }) => {
  // Handle ESC key press for accessibility
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    if (intent) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [intent, onClose]);

  if (!intent) return null;

  const displayName = intent.name || intent.intent || 'Unnamed Intent';
  const responsesList = intent.responses && intent.responses.length > 0
    ? intent.responses
    : intent.response
    ? [intent.response]
    : [];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-150"
      onClick={onClose}
      role="presentation"
    >
      <div
        className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        role="dialog"
        aria-modal="true"
        aria-labelledby="intent-details-title"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/30">
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-600 dark:bg-indigo-500" />
            <h3 id="intent-details-title" className="font-bold text-lg text-slate-900 dark:text-white font-mono">
              @{displayName}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors focus-visible:ring-2 focus-visible:ring-indigo-500"
            aria-label="Close intent details"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-5 text-sm text-slate-700 dark:text-slate-300">
          {/* Metadata Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200/70 dark:border-slate-700/70">
              <span className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500 tracking-wider block mb-1">
                Category
              </span>
              <span className="font-semibold text-slate-900 dark:text-slate-100 text-xs">
                {intent.category}
              </span>
            </div>

            <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200/70 dark:border-slate-700/70">
              <span className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500 tracking-wider block mb-1">
                Status
              </span>
              <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 className="w-3.5 h-3.5" />
                {intent.status || 'Active'}
              </span>
            </div>

            <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200/70 dark:border-slate-700/70">
              <span className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500 tracking-wider block mb-1">
                Match Strategy
              </span>
              <span className="font-mono text-xs font-medium text-indigo-600 dark:text-indigo-400">
                {intent.matchType || 'Deterministic'}
              </span>
            </div>

            <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200/70 dark:border-slate-700/70">
              <span className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500 tracking-wider block mb-1">
                Priority Weight
              </span>
              <span className="font-mono text-xs font-bold text-slate-900 dark:text-slate-100">
                {intent.priority ?? 50} / 100
              </span>
            </div>
          </div>

          {/* Exact Phrases */}
          {intent.exact_phrases && intent.exact_phrases.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                <Tag className="w-3.5 h-3.5 text-indigo-500" />
                <span>Exact Match Phrases (Tier 1 • Conf: 0.99)</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {intent.exact_phrases.map((phrase, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 bg-indigo-50 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-300 rounded-lg text-xs font-mono border border-indigo-200/60 dark:border-indigo-800/60"
                  >
                    "{phrase}"
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Keywords */}
          {intent.keywords && intent.keywords.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                <Layers className="w-3.5 h-3.5 text-slate-400" />
                <span>Trigger Keywords (Tier 3 • Conf: 0.75 - 0.85)</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {intent.keywords.map((kw, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg text-xs font-mono border border-slate-200/50 dark:border-slate-700/50"
                  >
                    {kw}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Regex Patterns */}
          {intent.patterns && intent.patterns.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                <Code2 className="w-3.5 h-3.5 text-purple-500" />
                <span>Regex Patterns (Tier 2 • Conf: 0.90)</span>
              </div>
              <div className="space-y-1.5">
                {intent.patterns.map((pattern, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 bg-slate-900 text-purple-300 font-mono text-xs rounded-xl overflow-x-auto border border-slate-800"
                  >
                    <code>{pattern}</code>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Example Responses */}
          <div className="space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
              <span>Predefined Deterministic Responses ({responsesList.length})</span>
            </div>
            <div className="space-y-2">
              {responsesList.map((resp, idx) => (
                <div
                  key={idx}
                  className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200/80 dark:border-slate-700/80 text-xs leading-relaxed text-slate-800 dark:text-slate-200"
                >
                  {resp}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 bg-slate-50 dark:bg-slate-800/40 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          <span className="flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5 text-indigo-500" />
            Deterministic Python Rule Library
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200 rounded-xl font-semibold transition-colors focus-visible:ring-2 focus-visible:ring-indigo-500"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

