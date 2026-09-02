'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  ShieldCheck,
  History,
  FileText,
  Brain,
  Settings,
  ChevronLeft,
  ChevronRight,
  Shield,
  Sun,
  Moon,
  Globe,
  Sparkles,
  UserCheck,
  LogIn,
  Menu,
  X,
  Layers,
  Users,
  Zap,
} from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { useLanguage } from '@/context/LanguageContext';
import LanguageModal from './LanguageModal';

export default function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showLangModal, setShowLangModal] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const { language, currentLanguageInfo, t } = useLanguage();

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  const navSections = [
    {
      title: 'PRIMARY OPERATIONS',
      items: [
        {
          href: '/verify',
          label: t('nav.verify', 'Verify Document'),
          icon: ShieldCheck,
          isHero: true,
          badge: 'PRIMARY',
        },
        {
          href: '/',
          label: t('nav.dashboard', 'Dashboard'),
          icon: LayoutDashboard,
        },
        {
          href: '/desk',
          label: t('nav.reviewDesk', 'Review Desk'),
          icon: Layers,
          badge: 'NEW',
        },
        {
          href: '/traveler-profile',
          label: t('nav.travelerProfile', 'Traveler Profile'),
          icon: Users,
        },
        {
          href: '/history',
          label: t('nav.history', 'Audit History'),
          icon: History,
        },
        {
          href: '/reports',
          label: t('nav.reports', 'Forensic Reports'),
          icon: FileText,
        },
      ],
    },
    {
      title: 'INTELLIGENCE',
      items: [
        {
          href: '/model-insights',
          label: t('nav.modelInsights', 'Model Insights'),
          icon: Brain,
        },
        {
          href: '/coverage',
          label: 'Live Coverage Map',
          icon: Globe,
        },
      ],
    },
    {
      title: 'SYSTEM',
      items: [
        {
          href: '/settings',
          label: t('nav.settings', 'Settings'),
          icon: Settings,
        },
        {
          href: '/login',
          label: t('nav.login', 'Sign In'),
          icon: LogIn,
        },
      ],
    },
  ];

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="md:hidden fixed top-3.5 left-4 z-50 p-2 rounded-xl border bg-white/90 dark:bg-[#101E17]/90 backdrop-blur-md shadow-md"
        style={{ borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
        aria-label="Toggle navigation"
      >
        {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="md:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-xs transition-opacity"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed left-0 top-0 bottom-0 z-40 flex flex-col transition-all duration-300 ease-in-out ${
          collapsed ? 'w-[76px]' : 'w-[268px]'
        } ${
          mobileOpen ? 'translate-x-0 !w-[280px]' : '-translate-x-full md:translate-x-0'
        }`}
        style={{
          background: 'var(--sidebar-bg)',
          borderRight: '1px solid var(--border-color)',
        }}
      >
        {/* Brand Header */}
        <div className="flex items-center justify-between px-5 h-20 flex-shrink-0 border-b" style={{ borderColor: 'var(--border-subtle)' }}>
          <Link
            href="/"
            onClick={() => setMobileOpen(false)}
            className="flex items-center gap-3 group text-left overflow-hidden"
          >
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform duration-300 group-hover:scale-105 shadow-md"
              style={{
                background: 'var(--gradient-accent)',
                color: '#FFFFFF',
              }}
            >
              <Shield className="w-5 h-5" />
            </div>
            {(!collapsed || mobileOpen) && (
              <div className="flex flex-col">
                <span className="text-sm font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>
                  VERIDOC <span style={{ color: 'var(--accent)' }}>AI</span>
                </span>
                <span className="text-[10px] font-semibold tracking-wider uppercase" style={{ color: 'var(--text-muted)' }}>
                  Border Intelligence
                </span>
              </div>
            )}
          </Link>
        </div>

        {/* Navigation Sections */}
        <div className="flex-1 px-3 py-4 space-y-6 overflow-y-auto">
          {navSections.map((section, idx) => (
            <div key={idx} className="space-y-1">
              {(!collapsed || mobileOpen) && (
                <p className="px-3 text-[10px] font-bold tracking-widest uppercase mb-1.5" style={{ color: 'var(--text-muted)' }}>
                  {section.title}
                </p>
              )}
              {section.items.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className={`nav-link group relative ${active ? 'active' : ''} ${
                      item.isHero && !active ? 'border' : ''
                    }`}
                    style={{
                      borderColor: item.isHero && !active ? 'rgba(49, 92, 69, 0.25)' : undefined,
                      background: item.isHero && !active ? 'var(--accent-light)' : undefined,
                    }}
                    title={collapsed && !mobileOpen ? item.label : undefined}
                  >
                    {/* Active Accent Bar */}
                    {active && (
                      <div
                        className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-6 rounded-r-full"
                        style={{ background: 'var(--accent)' }}
                      />
                    )}

                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors ${
                        active
                          ? 'text-white'
                          : item.isHero
                          ? 'text-[var(--accent)]'
                          : 'text-stone-600 dark:text-stone-400 group-hover:text-stone-900 dark:group-hover:text-white'
                      }`}
                      style={{
                        background: active
                          ? 'var(--accent)'
                          : item.isHero
                          ? 'rgba(49, 92, 69, 0.15)'
                          : 'rgba(49, 92, 69, 0.05)',
                      }}
                    >
                      <Icon className="w-4 h-4" />
                    </div>

                    {(!collapsed || mobileOpen) && (
                      <div className="flex items-center justify-between flex-1 min-w-0">
                        <span className={`text-xs truncate ${item.isHero ? 'font-semibold' : ''}`}>
                          {item.label}
                        </span>
                        {item.badge && (
                          <span
                            className="text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider ml-1"
                            style={{
                              background: 'var(--accent)',
                              color: '#FFFFFF',
                            }}
                          >
                            {item.badge}
                          </span>
                        )}
                      </div>
                    )}
                  </Link>
                );
              })}
            </div>
          ))}
        </div>

        {/* Bottom Utility Controls */}
        <div className="p-3 space-y-2 border-t flex-shrink-0" style={{ borderColor: 'var(--border-subtle)' }}>
          {/* Language & Theme Controls */}
          {!collapsed || mobileOpen ? (
            <div className="grid grid-cols-2 gap-1.5 p-1.5 rounded-xl card-warm-subtle">
              {/* Language Switch */}
              <button
                onClick={() => setShowLangModal(true)}
                className="flex items-center justify-center gap-1.5 py-1 px-2 rounded-lg text-xs font-semibold hover:bg-white/60 dark:hover:bg-white/10 transition-colors cursor-pointer"
                style={{ color: 'var(--text-secondary)' }}
                title="Switch Language (17 available)"
              >
                <Globe className="w-3.5 h-3.5" style={{ color: 'var(--accent)' }} />
                <span className="font-bold">{currentLanguageInfo.code.toUpperCase()}</span>
              </button>

              {/* Theme Switch */}
              <button
                onClick={toggleTheme}
                className="flex items-center justify-center gap-1.5 py-1 px-2 rounded-lg text-xs font-semibold hover:bg-white/60 dark:hover:bg-white/10 transition-colors cursor-pointer"
                style={{ color: 'var(--text-secondary)' }}
                title="Toggle Theme"
              >
                {theme === 'light' ? (
                  <>
                    <Moon className="w-3.5 h-3.5" style={{ color: 'var(--accent)' }} />
                    <span>Dark</span>
                  </>
                ) : (
                  <>
                    <Sun className="w-3.5 h-3.5" style={{ color: 'var(--accent)' }} />
                    <span>Light</span>
                  </>
                )}
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <button
                onClick={() => setShowLangModal(true)}
                className="p-2 rounded-lg hover:bg-white/50 dark:hover:bg-white/10 transition-colors"
                style={{ color: 'var(--text-secondary)' }}
                title="Switch Language"
              >
                <Globe className="w-4 h-4" style={{ color: 'var(--accent)' }} />
              </button>
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg hover:bg-white/50 dark:hover:bg-white/10 transition-colors"
                style={{ color: 'var(--text-secondary)' }}
                title="Toggle Theme"
              >
                {theme === 'light' ? <Moon className="w-4 h-4" style={{ color: 'var(--accent)' }} /> : <Sun className="w-4 h-4" style={{ color: 'var(--accent)' }} />}
              </button>
            </div>
          )}

          {/* System Status Indicator */}
          {(!collapsed || mobileOpen) && (
            <div className="px-2 py-1.5 rounded-lg flex items-center gap-2 text-[11px]" style={{ color: 'var(--text-muted)' }}>
              <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: 'var(--risk-low)' }} />
              <span className="font-medium truncate">{t('nav.systemOnline', 'Forensic Engine Online')}</span>
            </div>
          )}
        </div>

        {/* Desktop Collapse Toggle Button */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="hidden md:flex absolute -right-3 top-24 w-6 h-6 rounded-full items-center justify-center z-50 shadow-md transition-transform hover:scale-110 cursor-pointer"
          style={{
            background: 'var(--surface)',
            border: '1px solid var(--border-color)',
            color: 'var(--text-secondary)',
          }}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? (
            <ChevronRight className="w-3 h-3" />
          ) : (
            <ChevronLeft className="w-3 h-3" />
          )}
        </button>
      </aside>

      {/* Spacer to push desktop content */}
      <div
        className={`hidden md:block flex-shrink-0 transition-all duration-300 ${
          collapsed ? 'w-[76px]' : 'w-[268px]'
        }`}
      />

      {/* Language Modal */}
      <LanguageModal isOpen={showLangModal} onClose={() => setShowLangModal(false)} />
    </>
  );
}
