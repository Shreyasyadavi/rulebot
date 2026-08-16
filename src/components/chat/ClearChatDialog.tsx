import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

interface ClearChatDialogProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ClearChatDialog: React.FC<ClearChatDialogProps> = ({
  isOpen,
  onConfirm,
  onCancel,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/50 backdrop-blur-xs transition-opacity"
        onClick={onCancel}
        aria-hidden="true"
      />

      {/* Modal Card */}
      <div className="relative w-full max-w-sm bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 space-y-4 z-10 animate-fade-in">
        <div className="flex items-center justify-between">
          <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 flex items-center justify-center text-amber-600 dark:text-amber-400">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <button
            onClick={onCancel}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-1.5">
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            Clear this conversation?
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            This will remove all current messages in this active chat session and return to the welcome screen.
          </p>
        </div>

        <div className="flex items-center justify-end gap-2.5 pt-2">
          <button
            id="cancel-clear-btn"
            onClick={onCancel}
            className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            id="confirm-clear-btn"
            onClick={onConfirm}
            className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors cursor-pointer"
          >
            Clear Chat
          </button>
        </div>
      </div>
    </div>
  );
};
