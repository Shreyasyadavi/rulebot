import { useState, useEffect, useCallback } from 'react';
import { HistorySessionRecord } from '../types/history';
import { getHistorySessions, clearHistorySessions as clearStorageHistory } from '../services/storage';

export function useHistory() {
  const [sessions, setSessions] = useState<HistorySessionRecord[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [selectedSession, setSelectedSession] = useState<HistorySessionRecord | null>(null);
  const [showClearDialog, setShowClearDialog] = useState(false);

  const refreshHistory = useCallback(() => {
    try {
      setLoading(true);
      setError(null);
      const data = getHistorySessions();
      setSessions(data);
    } catch (err: unknown) {
      console.error('Error loading history:', err);
      setError('Unable to load conversation history right now.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshHistory();
  }, [refreshHistory]);

  const handleClearHistory = useCallback(() => {
    try {
      clearStorageHistory();
      setSessions([]);
      setSelectedSession(null);
      setShowClearDialog(false);
    } catch (err) {
      console.error('Error clearing history:', err);
    }
  }, []);

  const filteredSessions = sessions.filter((s) => {
    // Status filter
    if (statusFilter !== 'ALL' && s.status !== statusFilter) {
      return false;
    }

    // Search query filter
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      s.sessionId.toLowerCase().includes(q) ||
      s.snippet.toLowerCase().includes(q) ||
      s.matchedIntents.some((intent) => intent.toLowerCase().includes(q)) ||
      s.messages.some((m) => m.content.toLowerCase().includes(q)) ||
      (s.responseSources && s.responseSources.some((source) => source.toLowerCase().includes(q)))
    );
  });

  return {
    sessions: filteredSessions,
    allSessionsCount: sessions.length,
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
    refreshHistory,
    clearHistory: handleClearHistory,
  };
}
