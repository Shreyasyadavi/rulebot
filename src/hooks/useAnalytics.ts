import { useState, useEffect, useCallback } from 'react';
import { AnalyticsMetrics } from '../types/analytics';
import { calculateAnalyticsMetrics } from '../services/storage';

export function useAnalytics() {
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | 'all'>('7d');
  const [metrics, setMetrics] = useState<AnalyticsMetrics>(() => calculateAnalyticsMetrics('7d'));
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const refreshMetrics = useCallback(() => {
    try {
      setLoading(true);
      setError(null);
      const data = calculateAnalyticsMetrics(timeRange);
      setMetrics(data);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Unable to load analytics right now.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, [timeRange]);

  useEffect(() => {
    refreshMetrics();
  }, [refreshMetrics]);

  return {
    metrics,
    timeRange,
    setTimeRange,
    refreshMetrics,
    loading,
    error,
  };
}

