import React, { useEffect } from 'react';
import { RotateCcw, AlertTriangle } from 'lucide-react';

interface ResetSettingsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const ResetSettingsDialog: React.FC<ResetSettingsDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
}) => {
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-150"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden p-6 space-y-5"
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="reset-settings-title"
        aria-describedby="reset-settings-desc"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/80 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <h3 id="reset-settings-title" className="text-base font-bold text-slate-900 dark:text-white">
              Reset settings to default?
            </h3>
            <p id="reset-settings-desc" className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              This will restore all workspace preferences and display options to their default values. Your conversation history and backend rules will not be affected.
            </p>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2.5 pt-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-colors shadow-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Settings</span>
          </button>
        </div>
      </div>
    </div>
  );
};
