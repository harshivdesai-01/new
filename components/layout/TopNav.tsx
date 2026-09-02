'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Bell, Search, ShieldCheck, Sun, Moon, Globe, User } from 'lucide-react';
import NotificationDropdown from './NotificationDropdown';
import { api } from '@/services/api';
import type { Notification } from '@/types';
import { useTheme } from '@/context/ThemeContext';
import { useLanguage } from '@/context/LanguageContext';

interface TopNavProps {
  title: string;
  breadcrumbs?: { label: string; href?: string }[];
}

export default function TopNav({ title, breadcrumbs }: TopNavProps) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const { theme, toggleTheme } = useTheme();
  const { language, setLanguage } = useLanguage();

  const unreadCount = notifications.filter(n => !n.read).length;

  useEffect(() => {
    api.getNotifications().then(setNotifications);
  }, []);

  const handleMarkRead = async (id: string) => {
    await api.markNotificationRead(id);
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  return (
    <header
      className="h-18 flex items-center justify-between px-6 flex-shrink-0 sticky top-0 z-30 transition-colors"
      style={{
        background: 'var(--surface)',
        borderBottom: '1px solid var(--border-color)',
        boxShadow: 'var(--shadow-warm-sm)',
      }}
    >
      {/* Left: Title & Breadcrumbs */}
      <div className="flex flex-col pl-8 md:pl-0">
        {breadcrumbs && breadcrumbs.length > 0 && (
          <div className="flex items-center gap-1.5 text-xs mb-0.5" style={{ color: 'var(--text-muted)' }}>
            {breadcrumbs.map((crumb, i) => (
              <span key={i} className="flex items-center gap-1.5">
                {i > 0 && <span>/</span>}
                {crumb.href ? (
                  <Link href={crumb.href} className="hover:underline transition-colors" style={{ color: 'var(--text-secondary)' }}>
                    {crumb.label}
                  </Link>
                ) : (
                  <span className="font-medium" style={{ color: 'var(--text-primary)' }}>{crumb.label}</span>
                )}
              </span>
            ))}
          </div>
        )}
        <h1 className="text-lg font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>
          {title}
        </h1>
      </div>

      {/* Right: Search, Security Pill, Language, Theme & Notifications */}
      <div className="flex items-center gap-3">
        {/* Search */}
        <div className="relative hidden lg:block">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4"
            style={{ color: 'var(--text-muted)' }}
          />
          <input
            type="text"
            placeholder="Search identity records..."
            className="input pl-9 w-[220px] text-xs"
          />
        </div>

        {/* Security Pill */}
        <div
          className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold"
          style={{
            background: 'var(--risk-low-bg)',
            color: 'var(--risk-low)',
            border: '1px solid rgba(45, 122, 77, 0.2)',
          }}
        >
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>System Protected</span>
        </div>

        {/* Language Quick Toggle */}
        <button
          onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')}
          className="btn-ghost text-xs px-2.5 py-1.5 hidden sm:inline-flex items-center gap-1.5"
          title="Switch language"
        >
          <Globe className="w-3.5 h-3.5 text-stone-500" />
          <span className="font-semibold">{language === 'en' ? 'EN' : 'हिन्दी'}</span>
        </button>

        {/* Theme Quick Toggle */}
        <button
          onClick={toggleTheme}
          className="btn-ghost p-2 rounded-lg"
          title="Toggle color theme"
          aria-label="Toggle theme"
        >
          {theme === 'light' ? (
            <Moon className="w-4 h-4 text-stone-600" />
          ) : (
            <Sun className="w-4 h-4 text-amber-400" />
          )}
        </button>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="btn-ghost relative p-2"
            aria-label="Notifications"
          >
            <Bell className="w-4.5 h-4.5" />
            {unreadCount > 0 && (
              <span
                className="absolute -top-0.5 -right-0.5 w-4.5 h-4.5 rounded-full text-[10px] font-bold flex items-center justify-center text-white shadow-xs"
                style={{ background: 'var(--risk-high)', minWidth: '18px', height: '18px' }}
              >
                {unreadCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <NotificationDropdown
              notifications={notifications}
              onMarkRead={handleMarkRead}
              onClose={() => setShowNotifications(false)}
            />
          )}
        </div>

        {/* User Account Avatar */}
        <Link
          href="/login"
          className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-transform hover:scale-105 shadow-xs"
          style={{
            background: 'var(--gradient-accent)',
            color: '#FFFFFF',
          }}
          title="User Account"
        >
          VD
        </Link>
      </div>
    </header>
  );
}
