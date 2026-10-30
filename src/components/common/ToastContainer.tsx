import React from 'react';
import { useApp } from '../../context/AppContext';
import { CheckCircle2, AlertTriangle, Info, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toast, clearToast } = useApp();

  if (!toast) return null;

  const iconMap = {
    success: <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />,
    warning: <AlertTriangle className="w-5 h-5 text-brand-terracotta flex-shrink-0" />,
    info: <Info className="w-5 h-5 text-brand-amber flex-shrink-0" />
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-sm w-full animate-in fade-in slide-in-from-bottom-3 duration-200">
      <div className="bg-brand-surface rounded-xl p-4 shadow-modal border border-brand-border flex items-start gap-3">
        {iconMap[toast.type]}
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-semibold text-brand-text">{toast.title}</h4>
          <p className="text-xs text-brand-text-secondary mt-0.5 leading-relaxed">{toast.message}</p>
        </div>
        <button
          onClick={clearToast}
          className="text-brand-text-secondary hover:text-brand-text p-1 rounded-md transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

