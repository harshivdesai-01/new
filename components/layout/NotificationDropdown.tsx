'use client';

import Link from 'next/link';
import { Bell, CheckCircle2, AlertTriangle, AlertCircle, Info, X } from 'lucide-react';
import type { Notification } from '@/types';

interface NotificationDropdownProps {
  notifications: Notification[];
  onMarkRead: (id: string) => void;
  onClose: () => void;
}

const iconMap = {
  alert: AlertCircle,
  warning: AlertTriangle,
  success: CheckCircle2,
  info: Info,
};

const colorMap = {
  alert: 'var(--risk-high)',
  warning: 'var(--risk-review)',
  success: 'var(--risk-low)',
  info: 'var(--status-info)',
};

const bgMap = {
  alert: 'var(--risk-high-bg)',
  warning: 'var(--risk-review-bg)',
  success: 'var(--risk-low-bg)',
  info: 'rgba(58, 110, 165, 0.1)',
};

export default function NotificationDropdown({
  notifications,
  onMarkRead,
  onClose,
}: NotificationDropdownProps) {
  const formatTime = (timeStr: string) => {
    const date = new Date(timeStr);
    return date.toLocaleDateString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div
      className="absolute right-0 top-full mt-2 w-80 sm:w-96 glass-card-static p-4 z-50 fade-in-up shadow-xl"
      style={{
        background: 'var(--surface)',
        borderColor: 'var(--border-color)',
      }}
    >
      <div className="flex items-center justify-between pb-3 border-b mb-2" style={{ borderColor: 'var(--border-subtle)' }}>
        <div className="flex items-center gap-2">
          <Bell className="w-4 h-4" style={{ color: 'var(--accent)' }} />
          <h4 className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--text-primary)' }}>
            Notifications
          </h4>
        </div>
        <button onClick={onClose} className="btn-ghost p-1">
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="max-h-80 overflow-y-auto space-y-2">
        {notifications.length === 0 ? (
          <p className="text-xs text-center py-6" style={{ color: 'var(--text-muted)' }}>
            No new notifications
          </p>
        ) : (
          notifications.map((notif) => {
            const Icon = iconMap[notif.type] || Info;
            const color = colorMap[notif.type];
            const bg = bgMap[notif.type];

            return (
              <div
                key={notif.id}
                onClick={() => onMarkRead(notif.id)}
                className={`p-3 rounded-xl transition-all cursor-pointer border ${
                  notif.read ? 'opacity-65' : ''
                }`}
                style={{
                  background: notif.read ? 'transparent' : 'var(--surface-warm)',
                  borderColor: notif.read ? 'var(--border-subtle)' : 'var(--border-color)',
                }}
              >
                <div className="flex items-start gap-3">
                  <div
                    className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
                    style={{ background: bg, color }}
                  >
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>
                      {notif.title}
                    </p>
                    <p className="text-[11px] mt-0.5 leading-snug" style={{ color: 'var(--text-secondary)' }}>
                      {notif.message}
                    </p>
                    <div className="flex items-center justify-between mt-1.5 text-[10px]" style={{ color: 'var(--text-muted)' }}>
                      <span>{formatTime(notif.timestamp)}</span>
                      {notif.verificationId && (
                        <Link
                          href={`/results/${notif.verificationId}`}
                          onClick={onClose}
                          className="font-medium hover:underline"
                          style={{ color: 'var(--accent)' }}
                        >
                          View Result →
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
