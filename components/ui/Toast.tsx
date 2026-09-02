'use client';

import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-react';
import type { Toast as ToastType } from '@/hooks/useToast';

interface ToastContainerProps {
  toasts: ToastType[];
  onRemove: (id: string) => void;
}

const iconMap = {
  success: CheckCircle,
  error: XCircle,
  warning: AlertTriangle,
  info: Info,
};

const colorMap = {
  success: 'var(--risk-low)',
  error: 'var(--risk-high)',
  warning: 'var(--risk-review)',
  info: 'var(--status-info)',
};

export default function ToastContainer({ toasts, onRemove }: ToastContainerProps) {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm">
      {toasts.map((toast) => {
        const Icon = iconMap[toast.type];
        const color = colorMap[toast.type];
        return (
          <div
            key={toast.id}
            className="glass-card-static p-4 flex items-start gap-3 fade-in-up"
            style={{ borderLeft: `3px solid ${color}` }}
          >
            <Icon className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color }} />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                {toast.title}
              </p>
              {toast.message && (
                <p className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>
                  {toast.message}
                </p>
              )}
            </div>
            <button onClick={() => onRemove(toast.id)} className="btn-ghost p-0.5 flex-shrink-0">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
