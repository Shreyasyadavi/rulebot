import React, { useState, useMemo, useEffect, useCallback } from 'react';
import {
  Search,
  Filter,
  Eye,
  BookOpen,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  X,
  Layers,
  Code2,
  Tag,
} from 'lucide-react';
import { Intent } from '../../types/intents';
import { fetchIntentsCatalog } from '../../services/intents';
import { IntentDetailModal } from './IntentDetailModal';

export const IntentList: React.FC = () => {
  const [intents, setIntents] = useState<Intent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All Categories');
  const [selectedIntent, setSelectedIntent] = useState<Intent | null>(null);

  const loadIntents = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchIntentsCatalog();
      setIntents(data);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Unable to load intents right now.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadIntents();
  }, [loadIntents]);

  // Extract unique categories dynamically from actual data
  const availableCategories = useMemo(() => {
    const cats = new Set<string>();
    intents.forEach((item) => {
      if (item.category) cats.add(item.category);
    });
    return ['All Categories', ...Array.from(cats).sort()];
  }, [intents]);

  const filteredIntents = useMemo(() => {
    return intents.filter((item) => {
      // Category filter
      if (selectedCategory !== 'All Categories') {
        if (item.category !== selectedCategory) {
          return false;
        }
      }

      // Search filter
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase().trim();
      const name = (item.name || item.intent || '').toLowerCase();
      const cat = (item.category || '').toLowerCase();
      const keywords = item.keywords || [];
      const matchKw = keywords.some((k) => k.toLowerCase().includes(q));
      const exactPhrases = item.exact_phrases || [];
      const matchExact = exactPhrases.some((p) => p.toLowerCase().includes(q));
      const patterns = item.patterns || [];
      const matchPatterns = patterns.some((p) => p.toLowerCase().includes(q));
      const responseText = item.response || (item.responses ? item.responses.join(' ') : '');
      const matchResponse = responseText.toLowerCase().includes(q);

      return name.includes(q) || cat.includes(q) || matchKw || matchExact || matchPatterns || matchResponse;
    });
  }, [intents, selectedCategory, searchQuery]);

  return (
    <div className="space-y-6">
      {/* Header & Intent Count */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
            <span>Intent Rule Catalog</span>
            {!loading && !error && (
              <span className="text-xs px-2.5 py-0.5 rounded-full font-mono font-bold bg-indigo-50 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                {intents.length} Predefined Intents
              </span>
            )}
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Deterministic rule-based matching patterns, keywords, and verified educational responses.
          </p>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by intent, category, keywords, or patterns..."
              aria-label="Search predefined intents"
              className="w-full pl-10 pr-9 py-2 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-2.5 p-0.5 rounded text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                aria-label="Clear search query"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
            <Filter className="w-3.5 h-3.5" />
            <span className="font-semibold">
              {loading ? 'Loading...' : `${filteredIntents.length} Matching Intents`}
            </span>
          </div>
        </div>

        {/* Category Pills */}
        <div
          className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-1 scrollbar-thin"
          role="tablist"
          aria-label="Filter intents by category"
        >
          {availableCategories.map((cat) => {
            const isActive = selectedCategory === cat;
            return (
              <button
                key={cat}
                role="tab"
                aria-selected={isActive}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-8 space-y-4">
          <div className="flex items-center justify-center gap-2 text-sm text-slate-500 dark:text-slate-400">
            <RefreshCw className="w-4 h-4 animate-spin text-indigo-500" />
            <span>Loading intent catalog...</span>
          </div>
          <div className="space-y-3 pt-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="h-12 bg-slate-100 dark:bg-slate-800/60 rounded-xl animate-pulse"
              />
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
            Unable to load intents right now.
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
            Please check the backend connection and try again.
          </p>
          <button
            onClick={loadIntents}
            className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors focus-visible:ring-2 focus-visible:ring-indigo-500"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Retry Loading Intents</span>
          </button>
        </div>
      )}

      {/* Intents Table (Desktop & Tablet) */}
      {!loading && !error && (
        <div className="hidden md:block bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600 dark:text-slate-300">
              <thead className="text-[11px] uppercase tracking-wider text-slate-400 dark:text-slate-500 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 font-bold">
                <tr>
                  <th className="px-6 py-3.5">Intent Name</th>
                  <th className="px-6 py-3.5">Category</th>
                  <th className="px-6 py-3.5">Keywords &amp; Patterns</th>
                  <th className="px-6 py-3.5">Response Preview</th>
                  <th className="px-6 py-3.5">Status</th>
                  <th className="px-6 py-3.5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredIntents.map((item) => {
                  const displayName = item.name || item.intent;
                  const responsePreview = item.response || (item.responses?.[0] || '');
                  return (
                    <tr
                      key={displayName}
                      tabIndex={0}
                      role="button"
                      aria-label={`View details for intent ${displayName}`}
                      onClick={() => setSelectedIntent(item)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          setSelectedIntent(item);
                        }
                      }}
                      className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors cursor-pointer focus-visible:outline-none focus-visible:bg-slate-50/80 dark:focus-visible:bg-slate-800/60"
                    >
                      <td className="px-6 py-4 font-mono font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                        <span className="w-1.5 h-4 bg-indigo-600 rounded-full" />
                        @{displayName}
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-2.5 py-1 rounded-md text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                          {item.category}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1.5 flex-wrap max-w-xs">
                          {item.keywords?.slice(0, 3).map((kw, i) => (
                            <span
                              key={i}
                              className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 rounded text-[11px] font-mono text-slate-600 dark:text-slate-400"
                            >
                              {kw}
                            </span>
                          ))}
                          {item.patterns && item.patterns.length > 0 && (
                            <span className="px-2 py-0.5 bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border border-purple-200/50 dark:border-purple-800/50 rounded text-[10px] font-mono">
                              Regex
                            </span>
                          )}
                          {item.keywords && item.keywords.length > 3 && (
                            <span className="text-[11px] text-slate-400">
                              +{item.keywords.length - 3}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 max-w-xs">
                        <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1 italic">
                          "{responsePreview}"
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200/80 dark:border-emerald-800/80">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                          {item.status || 'Active'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedIntent(item);
                          }}
                          className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-lg transition-colors focus-visible:ring-2 focus-visible:ring-indigo-500"
                          aria-label={`Inspect intent ${displayName}`}
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Mobile Card List */}
      {!loading && !error && (
        <div className="md:hidden space-y-3">
          {filteredIntents.map((item) => {
            const displayName = item.name || item.intent;
            const responsePreview = item.response || (item.responses?.[0] || '');
            return (
              <div
                key={displayName}
                tabIndex={0}
                role="button"
                aria-label={`View details for intent ${displayName}`}
                onClick={() => setSelectedIntent(item)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setSelectedIntent(item);
                  }
                }}
                className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-3 cursor-pointer hover:border-indigo-300 dark:hover:border-indigo-800 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-indigo-600" />
                    <h4 className="font-mono font-bold text-sm text-slate-900 dark:text-white">
                      @{displayName}
                    </h4>
                  </div>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                    <CheckCircle2 className="w-2.5 h-2.5 text-emerald-600 dark:text-emerald-400" />
                    {item.status || 'Active'}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-xs flex-wrap">
                  <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                    {item.category}
                  </span>
                  {item.keywords && item.keywords.length > 0 && (
                    <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
                      {item.keywords.slice(0, 2).join(', ')}
                    </span>
                  )}
                </div>

                <div className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 italic">
                  "{responsePreview}"
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && filteredIntents.length === 0 && (
        <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
          <BookOpen className="w-8 h-8 text-slate-400 mx-auto" />
          <h3 className="font-bold text-slate-900 dark:text-white">No Matching Intents</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            No predefined rule matching "{searchQuery}" in category "{selectedCategory}". Try clearing the search query or selecting a different category.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('All Categories');
            }}
            className="px-3.5 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold rounded-xl transition-colors"
          >
            Clear Filters
          </button>
        </div>
      )}

      {/* Detail Modal */}
      <IntentDetailModal
        intent={selectedIntent}
        onClose={() => setSelectedIntent(null)}
      />
    </div>
  );
};

