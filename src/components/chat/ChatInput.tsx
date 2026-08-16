import React, { useRef, useEffect } from 'react';
import { Send } from 'lucide-react';

interface ChatInputProps {
  value: string;
  onChange: (val: string) => void;
  onSend: () => void;
  disabled?: boolean;
  maxLength?: number;
  enterToSend?: boolean;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  value,
  onChange,
  onSend,
  disabled = false,
  maxLength = 2000,
  enterToSend = true,
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-grow textarea height up to 140px
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      const scrollHeight = textareaRef.current.scrollHeight;
      textareaRef.current.style.height = `${Math.min(scrollHeight, 140)}px`;
    }
  }, [value]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (enterToSend) {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        if (value.trim() && !disabled) {
          onSend();
        }
      }
    } else {
      if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        if (value.trim() && !disabled) {
          onSend();
        }
      }
    }
  };

  const isSendDisabled = !value.trim() || disabled;

  return (
    <div className="p-3 sm:p-4 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-2">
      <div className="relative flex items-end bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700/80 rounded-2xl focus-within:ring-2 focus-within:ring-indigo-500 focus-within:border-indigo-500 transition-all p-1.5 shadow-2xs">
        <textarea
          ref={textareaRef}
          id="chat-textarea"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          maxLength={maxLength}
          placeholder="Ask RuleBot a question..."
          rows={1}
          disabled={disabled}
          className="w-full resize-none bg-transparent px-3 py-2 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none max-h-36 overflow-y-auto leading-relaxed disabled:opacity-60"
        />

        <div className="flex items-center gap-2 pb-1 pr-1 shrink-0">
          <button
            id="chat-send-btn"
            onClick={onSend}
            disabled={isSendDisabled}
            className={`p-2 rounded-xl transition-all ${
              isSendDisabled
                ? 'bg-slate-200 dark:bg-slate-700 text-slate-400 dark:text-slate-500 cursor-not-allowed'
                : 'bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white shadow-xs cursor-pointer'
            }`}
            aria-label="Send message"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Footer Meta: Enter helper & Character Counter */}
      <div className="flex items-center justify-between px-1 text-[11px] text-slate-400 dark:text-slate-500">
        <span className="hidden sm:inline">
          Press <kbd className="px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded text-[10px] font-mono">Enter</kbd> to send, <kbd className="px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded text-[10px] font-mono">Shift+Enter</kbd> for new line
        </span>
        <span className="sm:hidden text-[10px]">
          RuleBot deterministic assistant
        </span>

        <span className={`font-mono text-[10px] ${value.length >= maxLength ? 'text-amber-600 font-bold' : ''}`}>
          {value.length}/{maxLength}
        </span>
      </div>
    </div>
  );
};
