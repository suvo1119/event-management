'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export default function Toast() {
  const { toasts, removeToast } = useApp();

  if (!toasts || toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2.5 max-w-sm w-[calc(100%-48px)] pointer-events-none">
      {toasts.map((toast) => {
        let borderClass = 'border-slate-200';
        let IconComponent = Info;
        let iconClass = 'text-blue-600';

        if (toast.type === 'success') {
          borderClass = 'border-emerald-300 bg-emerald-50/40';
          IconComponent = CheckCircle2;
          iconClass = 'text-emerald-600';
        } else if (toast.type === 'error') {
          borderClass = 'border-rose-300 bg-rose-50/40';
          IconComponent = AlertCircle;
          iconClass = 'text-rose-600';
        }

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto bg-white border ${borderClass} rounded-lg p-3.5 text-slate-900 flex items-start gap-2.5 text-xs shadow-lg transition-all`}
          >
            <span className={`shrink-0 mt-0.5 ${iconClass}`}>
              <IconComponent size={16} />
            </span>
            <div className="flex-1 leading-relaxed break-words text-slate-800">
              {toast.message}
            </div>
            <button
              type="button"
              onClick={() => removeToast(toast.id)}
              className="text-slate-400 hover:text-slate-600 cursor-pointer p-0.5 transition-colors"
              aria-label="Close notification"
            >
              <X size={14} />
            </button>
          </div>
        );
      })}
    </div>
  );
}
