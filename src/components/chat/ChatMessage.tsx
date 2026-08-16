import React from 'react';
import { Bot, User, AlertTriangle, RotateCcw } from 'lucide-react';
import { ChatMessage as ChatMessageType } from '../../types/chat';
import { ResponseBadge } from './ResponseBadge';

interface ChatMessageProps {
  message: ChatMessageType;
  onRetry?: (text: string) => void;
  showSourceBadges?: boolean;
  showTimestamps?: boolean;
  density?: 'comfortable' | 'compact';
}

export const ChatMessage: React.FC<ChatMessageProps> = ({
  message,
  onRetry,
  showSourceBadges = true,
  showTimestamps = true,
  density = 'comfortable',
}) => {
  const isUser = message.role === 'user';
  const isError = message.isError;
  const isCompact = density === 'compact';

  return (
    <div
      className={`flex items-start gap-2.5 sm:gap-3 w-full ${
        isUser ? 'justify-end' : 'justify-start'
      }`}
    >
      {/* Bot Avatar */}
      {!isUser && (
        <div
          className={`rounded-xl flex items-center justify-center shrink-0 mt-0.5 shadow-xs border ${
            isCompact ? 'w-7 h-7' : 'w-8 h-8'
          } ${
            isError
              ? 'bg-rose-50 dark:bg-rose-950/80 border-rose-200 dark:border-rose-800/60 text-rose-600 dark:text-rose-400'
              : 'bg-indigo-100 dark:bg-indigo-950/80 border-indigo-200/50 dark:border-indigo-800/50 text-indigo-600 dark:text-indigo-400'
          }`}
        >
          {isError ? <AlertTriangle className={isCompact ? 'w-3.5 h-3.5' : 'w-4 h-4'} /> : <Bot className={isCompact ? 'w-3.5 h-3.5' : 'w-4 h-4'} />}
        </div>
      )}

      {/* Message Bubble Container */}
      <div
        className={`flex flex-col max-w-[85%] sm:max-w-lg md:max-w-xl ${
          isCompact ? 'space-y-1' : 'space-y-1.5'
        } ${
          isUser ? 'items-end' : 'items-start'
        }`}
      >
        <div
          className={`rounded-2xl text-sm leading-relaxed whitespace-pre-wrap break-words shadow-xs ${
            isCompact ? 'px-3.5 py-2 text-[13px]' : 'px-4 py-3 text-sm'
          } ${
            isUser
              ? 'bg-indigo-600 text-white rounded-tr-xs'
              : isError
              ? 'bg-rose-50 dark:bg-rose-950/50 text-rose-900 dark:text-rose-200 border border-rose-200 dark:border-rose-800/70 rounded-tl-xs'
              : 'bg-slate-100 dark:bg-slate-800/90 text-slate-900 dark:text-slate-100 rounded-tl-xs border border-slate-200/60 dark:border-slate-700/60'
          }`}
        >
          {message.content}

          {/* Retry Button in Error Message */}
          {isError && message.retryPayload && onRetry && (
            <div className="pt-2 mt-2 border-t border-rose-200/60 dark:border-rose-800/60 flex items-center justify-between">
              <span className="text-xs text-rose-600 dark:text-rose-400 font-medium">
                Unable to complete request
              </span>
              <button
                onClick={() => onRetry(message.retryPayload!)}
                className="inline-flex items-center gap-1 px-2.5 py-1 bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Retry</span>
              </button>
            </div>
          )}
        </div>

        {/* Footer Meta & Response Badge */}
        {(showSourceBadges || showTimestamps) && (
          <div
            className={`flex items-center gap-2 px-1 text-[10px] text-slate-400 dark:text-slate-500 font-mono ${
              isUser ? 'justify-end' : 'justify-start'
            }`}
          >
            {!isUser && !isError && showSourceBadges && message.responseType && (
              <ResponseBadge
                responseType={message.responseType}
                intentName={message.intentName}
                confidence={message.confidence}
              />
            )}
            {showTimestamps && <span>{message.timestamp}</span>}
          </div>
        )}
      </div>

      {/* User Avatar */}
      {isUser && (
        <div
          className={`rounded-xl bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 flex items-center justify-center shrink-0 mt-0.5 shadow-xs font-semibold text-xs ${
            isCompact ? 'w-7 h-7' : 'w-8 h-8'
          }`}
        >
          <User className={isCompact ? 'w-3.5 h-3.5' : 'w-4 h-4'} />
        </div>
      )}
    </div>
  );
};
