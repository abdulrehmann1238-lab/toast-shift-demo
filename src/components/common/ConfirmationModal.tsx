import React from 'react';
import { AlertCircle, X } from 'lucide-react';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'warning' | 'primary';
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm Action',
  cancelText = 'Cancel',
  variant = 'primary'
}) => {
  if (!isOpen) return null;

  const btnVariants = {
    primary: 'bg-brand-sidebar hover:bg-stone-900 text-white',
    danger: 'bg-brand-terracotta hover:bg-[#A3664F] text-white',
    warning: 'bg-brand-amber hover:bg-[#AF8849] text-white'
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/40 backdrop-blur-[2px] animate-in fade-in duration-150">
      <div className="bg-brand-surface rounded-2xl max-w-md w-full p-6 shadow-modal border border-brand-border animate-in zoom-in-95 duration-150">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
              variant === 'danger' ? 'bg-brand-terracotta-soft text-brand-terracotta' :
              variant === 'warning' ? 'bg-brand-amber-soft text-amber-800' :
              'bg-brand-sage-soft text-brand-sage-dark'
            }`}>
              <AlertCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-heading font-semibold text-brand-text">
                {title}
              </h3>
              <p className="text-xs text-brand-text-secondary">Manager Confirmation Required</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-brand-text-secondary hover:text-brand-text p-1.5 rounded-lg hover:bg-brand-surface-subtle transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="text-sm text-brand-text leading-relaxed mb-6 bg-brand-surface-subtle p-3.5 rounded-xl border border-brand-border">
          {message}
        </p>

        <div className="flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-brand-text-secondary hover:text-brand-text bg-white hover:bg-brand-surface-subtle border border-brand-border rounded-xl transition-colors"
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className={`px-4 py-2 text-sm font-medium rounded-xl transition-all shadow-subtle ${btnVariants[variant]}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

