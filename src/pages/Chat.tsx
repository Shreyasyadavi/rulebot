import React, { useRef, useEffect, useCallback } from 'react';
import {
  Bot,
  Plus,
  RotateCcw,
} from 'lucide-react';
import { useChat } from '../hooks/useChat';
import { useSettings } from '../hooks/useSettings';
import { ChatEmptyState } from '../components/chat/ChatEmptyState';
import { ChatMessage } from '../components/chat/ChatMessage';
import { ChatInput } from '../components/chat/ChatInput';
import { ThinkingIndicator } from '../components/chat/ThinkingIndicator';
import { ClearChatDialog } from '../components/chat/ClearChatDialog';
import { LogicInspector } from '../components/inspector/LogicInspector';

interface ChatProps {
  onRegisterClear?: (fn: () => void) => void;
}

export const Chat: React.FC<ChatProps> = ({ onRegisterClear }) => {
  const { settings } = useSettings();
  const {
    messages,
    inputText,
    setInputText,
    isThinking,
    showClearDialog,
    setShowClearDialog,
    inspector,
    sendMessage,
    retryMessage,
    clearChat,
  } = useChat();

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const isAutoScrollEnabled = useRef(true);

  // Handle user scroll detection: don't force auto-scroll if user scrolled up
  const handleScroll = useCallback(() => {
    if (!scrollContainerRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = scrollContainerRef.current;
    const atBottom = scrollHeight - scrollTop - clientHeight < 100;
    isAutoScrollEnabled.current = atBottom;
  }, []);

  // Smooth scroll to bottom
  const scrollToBottom = useCallback((force = false) => {
    if (scrollContainerRef.current && (isAutoScrollEnabled.current || force)) {
      scrollContainerRef.current.scrollTo({
        top: scrollContainerRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isThinking, scrollToBottom]);

  // Register header clear action trigger
  useEffect(() => {
    if (onRegisterClear) {
      onRegisterClear(() => setShowClearDialog(true));
    }
  }, [onRegisterClear, setShowClearDialog]);

  return (
    <div className="h-[calc(100vh-7.5rem)] flex flex-col lg:flex-row gap-6">
      {/* Main Chat Canvas Area */}
      <div className="flex-1 flex flex-col bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
        {/* Chat Canvas Sub-Header */}
        <div className="p-4 px-5 sm:px-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/50">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-9 h-9 rounded-xl bg-indigo-100 dark:bg-indigo-950 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                <Bot className="w-5 h-5" />
              </div>
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-slate-900" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-semibold text-slate-900 dark:text-white">
                  {settings.botName || 'RuleBot'}
                </h2>
                <span className="text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
                  Online
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate max-w-[200px] sm:max-w-xs">
                {settings.botPersona || 'Deterministic Rule Engine Active'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {messages.length > 0 && (
              <button
                id="canvas-clear-chat-btn"
                onClick={() => setShowClearDialog(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 dark:text-slate-300 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
                title="Clear current conversation"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Clear Chat</span>
              </button>
            )}

            <button
              id="new-chat-btn"
              onClick={() => {
                if (messages.length > 0) {
                  setShowClearDialog(true);
                }
              }}
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>New Chat</span>
            </button>
          </div>
        </div>

        {/* Dynamic Canvas: Empty State vs Message Thread */}
        {messages.length === 0 ? (
          <ChatEmptyState onSelectPrompt={(p) => sendMessage(p)} />
        ) : (
          <div
            ref={scrollContainerRef}
            onScroll={handleScroll}
            className={`flex-1 overflow-y-auto ${
              settings.chatDensity === 'compact' ? 'p-3 sm:p-4 space-y-3' : 'p-4 sm:p-6 space-y-5'
            }`}
          >
            <div className="flex justify-center">
              <span className="px-3 py-1 text-[11px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 rounded-full">
                Active Conversation
              </span>
            </div>

            {messages.map((msg) => (
              <ChatMessage
                key={msg.id}
                message={msg}
                onRetry={retryMessage}
                showSourceBadges={settings.showSourceBadges !== false}
                showTimestamps={settings.showTimestamps !== false}
                density={settings.chatDensity || 'comfortable'}
              />
            ))}

            {isThinking && <ThinkingIndicator />}
          </div>
        )}

        {/* Bottom Interactive Multiline Input */}
        <ChatInput
          value={inputText}
          onChange={setInputText}
          onSend={() => {
            isAutoScrollEnabled.current = true;
            sendMessage();
          }}
          disabled={isThinking}
          maxLength={2000}
          enterToSend={settings.enterToSend !== false}
        />
      </div>

      {/* RuleBot Logic Panel (Right Pane - Modular Logic Inspector) */}
      {settings.showInspector !== false && <LogicInspector data={inspector} />}

      {/* Clear Confirmation Modal */}
      <ClearChatDialog
        isOpen={showClearDialog}
        onConfirm={clearChat}
        onCancel={() => setShowClearDialog(false)}
      />
    </div>
  );
};
