import { useState, useEffect, useCallback } from 'react';
import { UserSettings, DEFAULT_USER_SETTINGS } from '../types/settings';
import { getUserSettings, saveUserSettings } from '../services/storage';

export function useSettings() {
  const [settings, setSettings] = useState<UserSettings>(getUserSettings);

  useEffect(() => {
    saveUserSettings(settings);
  }, [settings]);

  const updateSetting = useCallback(<K extends keyof UserSettings>(key: K, value: UserSettings[K]) => {
    setSettings((prev) => ({
      ...prev,
      [key]: value,
    }));
  }, []);

  const resetSettings = useCallback(() => {
    setSettings(DEFAULT_USER_SETTINGS);
  }, []);

  return {
    settings,
    setSettings,
    updateSetting,
    resetSettings,
  };
}
