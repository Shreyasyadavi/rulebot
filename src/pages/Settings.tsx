import React from 'react';
import { SettingsForm } from '../components/settings/SettingsForm';
import { ThemeMode } from '../types';

interface SettingsProps {
  theme: ThemeMode;
  onSetTheme: (theme: ThemeMode) => void;
  onClearActiveChat?: () => void;
}

export const Settings: React.FC<SettingsProps> = ({
  theme,
  onSetTheme,
  onClearActiveChat,
}) => {
  return (
    <SettingsForm
      currentTheme={theme}
      onSetTheme={onSetTheme}
      onClearActiveChat={onClearActiveChat}
    />
  );
};

