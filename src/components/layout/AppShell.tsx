import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { TabType, ThemeMode } from '../../types';
import { X } from 'lucide-react';

interface AppShellProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  theme: ThemeMode;
  onToggleTheme: () => void;
  onClearChat?: () => void;
  children: React.ReactNode;
}

export const AppShell: React.FC<AppShellProps> = ({
  activeTab,
  onTabChange,
  theme,
  onToggleTheme,
  onClearChat,
  children,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="flex h-screen w-full bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 overflow-hidden font-sans transition-colors duration-200">
      {/* Desktop Persistent Sidebar */}
      <div className="hidden lg:block h-full shrink-0">
        <Sidebar activeTab={activeTab} onTabChange={onTabChange} />
      </div>

      {/* Mobile Drawer Backdrop & Sidebar */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
            aria-hidden="true"
          />
          <div className="relative flex flex-col w-72 max-w-xs h-full bg-white dark:bg-slate-900 z-10 shadow-2xl">
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 focus:outline-none"
              aria-label="Close menu"
            >
              <X className="w-5 h-5" />
            </button>
            <Sidebar
              activeTab={activeTab}
              onTabChange={onTabChange}
              onCloseMobile={() => setMobileMenuOpen(false)}
            />
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex flex-col flex-1 min-w-0 h-full overflow-hidden">
        <Header
          activeTab={activeTab}
          theme={theme}
          onToggleTheme={onToggleTheme}
          onOpenMobileMenu={() => setMobileMenuOpen(true)}
          onClearChat={onClearChat}
        />
        <main className="flex-1 overflow-y-auto overflow-x-hidden p-4 sm:p-6 lg:p-8 bg-slate-50 dark:bg-slate-950">
          <div className="max-w-7xl mx-auto h-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};
