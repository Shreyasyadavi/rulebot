import React, { useState, useEffect, useRef } from 'react';
import { AppShell } from './components/layout/AppShell';
import { Chat } from './pages/Chat';
import { Intents } from './pages/Intents';
import { Analytics } from './pages/Analytics';
import { History } from './pages/History';
import { Settings } from './pages/Settings';
import { TabType, ThemeMode } from './types';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('chat');
  const [theme, setTheme] = useState<ThemeMode>(() => {
    const saved = localStorage.getItem('rulebot_theme') as ThemeMode;
    return saved || 'light';
  });

  const clearChatHandlerRef = useRef<(() => void) | null>(null);

  // Apply theme class to document
  useEffect(() => {
    const root = document.documentElement;
    localStorage.setItem('rulebot_theme', theme);

    if (theme === 'dark') {
      root.classList.add('dark');
    } else if (theme === 'light') {
      root.classList.remove('dark');
    } else {
      const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (isDark) {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const handleClearChatTrigger = () => {
    if (clearChatHandlerRef.current) {
      clearChatHandlerRef.current();
    }
  };

  const registerClearHandler = (fn: () => void) => {
    clearChatHandlerRef.current = fn;
  };

  const renderActiveView = () => {
    switch (activeTab) {
      case 'chat':
        return <Chat onRegisterClear={registerClearHandler} />;
      case 'intents':
        return <Intents />;
      case 'analytics':
        return <Analytics />;
      case 'history':
        return <History />;
      case 'settings':
        return (
          <Settings
            theme={theme}
            onSetTheme={setTheme}
            onClearActiveChat={handleClearChatTrigger}
          />
        );
      default:
        return <Chat onRegisterClear={registerClearHandler} />;
    }
  };

  return (
    <AppShell
      activeTab={activeTab}
      onTabChange={setActiveTab}
      theme={theme}
      onToggleTheme={toggleTheme}
      onClearChat={activeTab === 'chat' ? handleClearChatTrigger : undefined}
    >
      {renderActiveView()}
    </AppShell>
  );
}
