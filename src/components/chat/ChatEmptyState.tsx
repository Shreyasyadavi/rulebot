import React from 'react';
import { Bot, ArrowRight, Sparkles } from 'lucide-react';

interface ChatEmptyStateProps {
  onSelectPrompt: (prompt: string) => void;
}

export const ChatEmptyState: React.FC<ChatEmptyStateProps> = ({ onSelectPrompt }) => {
  const suggestedQuestions = [
    'Hello',
    'What can you do?',
    'What is Python?',
    'What is AI?',
    'What is Machine Learning?',
  ];

  return (
    <div className="flex-1 overflow-y-auto p-6 flex flex-col items-center justify-center text-center max-w-lg mx-auto space-y-6">
      {/* Bot Icon */}
      <div className="relative">
        <div className="w-16 h-16 rounded-2xl bg-indigo-50 dark:bg-indigo-950/80 border border-indigo-200/60 dark:border-indigo-800/60 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shadow-sm">
          <Bot className="w-8 h-8" />
        </div>
        <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-white dark:bg-slate-900 flex items-center justify-center shadow-xs">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
        </div>
      </div>

      {/* Main Greeting */}
      <div className="space-y-2">
        <h3 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
          Hi, I'm RuleBot 👋
        </h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed max-w-md">
          Ask me a question and I'll try to help.
        </p>
      </div>

      {/* Suggested Questions Grid */}
      <div className="w-full space-y-2.5 pt-2">
        <span className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">
          Suggested Questions
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {suggestedQuestions.map((question) => (
            <button
              key={question}
              id={`suggested-prompt-${question.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
              onClick={() => onSelectPrompt(question)}
              className="p-3 bg-white dark:bg-slate-800/80 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 border border-slate-200 dark:border-slate-700/80 hover:border-indigo-200 dark:hover:border-indigo-800 rounded-xl text-xs text-slate-700 dark:text-slate-200 hover:text-indigo-600 dark:hover:text-indigo-400 font-medium text-left flex items-center justify-between transition-all cursor-pointer group shadow-2xs"
            >
              <span>{question}</span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-500 group-hover:translate-x-0.5 transition-all" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
