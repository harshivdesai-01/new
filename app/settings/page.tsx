'use client';

import { useEffect, useState } from 'react';
import {
  Save,
  RotateCcw,
  Shield,
  Eye,
  Database,
  Lock,
  Sun,
  Moon,
  Globe,
  Clock,
  KeyRound,
  CheckCircle2,
} from 'lucide-react';
import TopNav from '@/components/layout/TopNav';
import { api } from '@/services/api';
import type { VerificationSettings } from '@/types';
import { defaultSettings } from '@/services/mock-data';
import { useTheme } from '@/context/ThemeContext';
import { useLanguage, type Language } from '@/context/LanguageContext';
import { useSecurity } from '@/context/SecurityContext';

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const { language, setLanguage, t } = useLanguage();
  const {
    autoLockEnabled,
    setAutoLockEnabled,
    lockDurationMinutes,
    setLockDurationMinutes,
    lockNow,
  } = useSecurity();

  const [settings, setSettings] = useState<VerificationSettings>(defaultSettings);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    api
      .getSettings()
      .then(setSettings)
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    await api.updateSettings(settings);
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleReset = () => {
    setSettings(defaultSettings);
    setAutoLockEnabled(true);
    setLockDurationMinutes(5);
  };

  const Toggle = ({ active, onToggle }: { active: boolean; onToggle: () => void }) => (
    <button
      type="button"
      onClick={onToggle}
      className={`toggle ${active ? 'active' : ''}`}
      role="switch"
      aria-checked={active}
    />
  );

  if (loading) {
    return (
      <>
        <TopNav title={t('nav.settings', 'Settings')} />
        <div className="flex-1 flex items-center justify-center min-h-[60vh]">
          <div
            className="w-10 h-10 rounded-full border-3 border-t-transparent animate-spin"
            style={{ borderColor: 'var(--accent)', borderTopColor: 'transparent' }}
          />
        </div>
      </>
    );
  }

  return (
    <>
      <TopNav
        title={t('nav.settings', 'Settings')}
        breadcrumbs={[{ label: 'Dashboard', href: '/' }, { label: 'Settings' }]}
      />

      <div className="flex-1 p-6 md:p-8 max-w-4xl mx-auto w-full space-y-6">
        {/* ─── 1. Appearance & Localization ─── */}
        <div
          className="p-6 md:p-8 rounded-3xl border shadow-xs space-y-5"
          style={{
            background: 'var(--surface)',
            borderColor: 'var(--border-color)',
          }}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{ background: 'var(--accent-light)', color: 'var(--accent)' }}
            >
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <span className="editorial-label">Interface</span>
              <h3 className="text-base font-bold mt-0.5" style={{ color: 'var(--text-primary)' }}>
                {t('settings.appearance', 'Appearance & Localization')}
              </h3>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
            {/* Theme Mode */}
            <div className="p-4 rounded-2xl border card-warm-subtle space-y-2">
              <span className="text-xs font-bold" style={{ color: 'var(--text-primary)' }}>
                {t('settings.theme', 'Theme Mode')}
              </span>
              <div className="grid grid-cols-2 gap-1.5 p-1 rounded-xl bg-stone-200/50 dark:bg-stone-800/50">
                <button
                  type="button"
                  onClick={() => setTheme('light')}
                  className={`flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold transition-all ${
                    theme === 'light'
                      ? 'bg-white text-[#C85A32] shadow-sm'
                      : 'text-stone-500 hover:text-stone-800'
                  }`}
                >
                  <Sun className="w-3.5 h-3.5" />
                  <span>Warm Light</span>
                </button>
                <button
                  type="button"
                  onClick={() => setTheme('dark')}
                  className={`flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold transition-all ${
                    theme === 'dark'
                      ? 'bg-[#1C1714] text-[#D96B43] shadow-sm'
                      : 'text-stone-400 hover:text-stone-200'
                  }`}
                >
                  <Moon className="w-3.5 h-3.5" />
                  <span>Espresso Dark</span>
                </button>
              </div>
            </div>

            {/* System Language */}
            <div className="p-4 rounded-2xl border card-warm-subtle space-y-2">
              <span className="text-xs font-bold" style={{ color: 'var(--text-primary)' }}>
                {t('settings.language', 'System Language')}
              </span>
              <div className="grid grid-cols-2 gap-1.5 p-1 rounded-xl bg-stone-200/50 dark:bg-stone-800/50">
                <button
                  type="button"
                  onClick={() => setLanguage('en')}
                  className={`py-2 rounded-lg text-xs font-bold transition-all ${
                    language === 'en'
                      ? 'bg-white dark:bg-[#1C1714] text-[#C85A32] shadow-sm'
                      : 'text-stone-500 hover:text-stone-800 dark:hover:text-stone-200'
                  }`}
                >
                  English (US)
                </button>
                <button
                  type="button"
                  onClick={() => setLanguage('hi')}
                  className={`py-2 rounded-lg text-xs font-bold transition-all ${
                    language === 'hi'
                      ? 'bg-white dark:bg-[#1C1714] text-[#C85A32] shadow-sm'
                      : 'text-stone-500 hover:text-stone-800 dark:hover:text-stone-200'
                  }`}
                >
                  हिन्दी (Hindi)
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ─── 2. Security & Auto-Lock (Hero Security Setting) ─── */}
        <div
          className="p-6 md:p-8 rounded-3xl border shadow-xs space-y-5"
          style={{
            background: 'var(--surface)',
            borderColor: 'rgba(200, 90, 50, 0.3)',
          }}
        >
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-3">
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center"
                style={{ background: 'var(--accent-light)', color: 'var(--accent)' }}
              >
                <Lock className="w-5 h-5" />
              </div>
              <div>
                <span className="editorial-label">Credential Protection</span>
                <h3 className="text-base font-bold mt-0.5" style={{ color: 'var(--text-primary)' }}>
                  {t('settings.security', 'Security & Auto-Lock')}
                </h3>
              </div>
            </div>
            <button
              type="button"
              onClick={lockNow}
              className="btn-secondary text-xs py-1.5 px-3"
            >
              <KeyRound className="w-3.5 h-3.5" />
              <span>Test Lock Now</span>
            </button>
          </div>

          <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            Automatically hides sensitive documents, OCR transcripts, and biometric facial matches after a period of user inactivity.
          </p>

          <div className="space-y-4 pt-1">
            {/* Auto Lock Toggle */}
            <div className="p-4 rounded-2xl border card-warm-subtle flex items-center justify-between">
              <div>
                <p className="text-xs font-bold" style={{ color: 'var(--text-primary)' }}>
                  {t('settings.autoLock', 'Auto-Lock Sensitive Documents')}
                </p>
                <p className="text-[11px]" style={{ color: 'var(--text-muted)' }}>
                  {autoLockEnabled ? 'Active — Inactivity timer monitoring keyboard, mouse, and touch events.' : 'Disabled — Sensitive views remain unlocked.'}
                </p>
              </div>
              <Toggle
                active={autoLockEnabled}
                onToggle={() => setAutoLockEnabled(!autoLockEnabled)}
              />
            </div>

            {/* Inactivity Duration Dropdown */}
            {autoLockEnabled && (
              <div className="p-4 rounded-2xl border card-warm-subtle flex flex-col sm:flex-row sm:items-center justify-between gap-3 fade-in-up">
                <div className="flex items-center gap-2.5">
                  <Clock className="w-4 h-4 text-amber-600" />
                  <div>
                    <p className="text-xs font-bold" style={{ color: 'var(--text-primary)' }}>
                      Inactivity Lock Duration
                    </p>
                    <p className="text-[11px]" style={{ color: 'var(--text-muted)' }}>
                      A 30-second warning countdown will display before session protection activates.
                    </p>
                  </div>
                </div>

                <select
                  value={lockDurationMinutes}
                  onChange={(e) => setLockDurationMinutes(parseInt(e.target.value, 10))}
                  className="input w-auto text-xs font-bold"
                >
                  <option value={1}>1 Minute (Strict Audit)</option>
                  <option value={5}>5 Minutes (Default)</option>
                  <option value={10}>10 Minutes</option>
                  <option value={15}>15 Minutes</option>
                  <option value={30}>30 Minutes</option>
                </select>
              </div>
            )}
          </div>
        </div>

        {/* ─── 3. Verification Thresholds & Biometrics ─── */}
        <div
          className="p-6 md:p-8 rounded-3xl border shadow-xs space-y-5"
          style={{
            background: 'var(--surface)',
            borderColor: 'var(--border-color)',
          }}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{ background: 'var(--accent-light)', color: 'var(--accent)' }}
            >
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <span className="editorial-label">ML Fusion</span>
              <h3 className="text-base font-bold mt-0.5" style={{ color: 'var(--text-primary)' }}>
                Verification & Risk Thresholds
              </h3>
            </div>
          </div>

          <div className="space-y-4 pt-1">
            {[
              {
                label: 'Low Risk Threshold (Safe Zone)',
                desc: 'Audits scoring below this value are classified as Low Risk',
                key: 'low' as const,
                color: 'var(--risk-low)',
              },
              {
                label: 'Review Threshold (Manual Triage)',
                desc: 'Audits scoring between low and this value trigger analyst review',
                key: 'review' as const,
                color: 'var(--risk-review)',
              },
              {
                label: 'High Risk Threshold (Fraud Alarm)',
                desc: 'Audits scoring above this value are flagged as high risk',
                key: 'high' as const,
                color: 'var(--risk-high)',
              },
            ].map((threshold) => (
              <div key={threshold.key} className="p-4 rounded-2xl border card-warm-subtle space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-xs font-bold" style={{ color: 'var(--text-primary)' }}>
                      {threshold.label}
                    </label>
                    <p className="text-[11px]" style={{ color: 'var(--text-muted)' }}>
                      {threshold.desc}
                    </p>
                  </div>
                  <span className="text-sm font-mono font-extrabold" style={{ color: threshold.color }}>
                    {settings.riskThresholds[threshold.key]} / 100
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={settings.riskThresholds[threshold.key]}
                  onChange={(e) =>
                    setSettings((prev) => ({
                      ...prev,
                      riskThresholds: {
                        ...prev.riskThresholds,
                        [threshold.key]: parseInt(e.target.value),
                      },
                    }))
                  }
                  className="w-full h-2 rounded-full appearance-none cursor-pointer"
                  style={{
                    background: `linear-gradient(to right, ${threshold.color} ${settings.riskThresholds[threshold.key]}%, var(--border-subtle) ${settings.riskThresholds[threshold.key]}%)`,
                  }}
                />
              </div>
            ))}

            {/* Face Match Threshold */}
            <div className="p-4 rounded-2xl border card-warm-subtle space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-xs font-bold" style={{ color: 'var(--text-primary)' }}>
                    Face Match Similarity Threshold
                  </label>
                  <p className="text-[11px]" style={{ color: 'var(--text-muted)' }}>
                    Minimum embedding cosine similarity required to confirm applicant identity
                  </p>
                </div>
                <span className="text-sm font-mono font-extrabold text-[#C85A32]">
                  {(settings.faceMatchThreshold * 100).toFixed(0)}%
                </span>
              </div>
              <input
                type="range"
                min="50"
                max="99"
                value={settings.faceMatchThreshold * 100}
                onChange={(e) =>
                  setSettings((prev) => ({
                    ...prev,
                    faceMatchThreshold: parseInt(e.target.value) / 100,
                  }))
                }
                className="w-full h-2 rounded-full appearance-none cursor-pointer"
                style={{
                  background: `linear-gradient(to right, #C85A32 ${settings.faceMatchThreshold * 100}%, var(--border-subtle) ${settings.faceMatchThreshold * 100}%)`,
                }}
              />
            </div>
          </div>
        </div>

        {/* ─── 4. Privacy Mode & Data Retention ─── */}
        <div
          className="p-6 md:p-8 rounded-3xl border shadow-xs space-y-5"
          style={{
            background: 'var(--surface)',
            borderColor: 'var(--border-color)',
          }}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{ background: 'var(--accent-light)', color: 'var(--accent)' }}
            >
              <Database className="w-5 h-5" />
            </div>
            <div>
              <span className="editorial-label">Compliance</span>
              <h3 className="text-base font-bold mt-0.5" style={{ color: 'var(--text-primary)' }}>
                Privacy Mode & Data Retention
              </h3>
            </div>
          </div>

          <div className="space-y-4 pt-1">
            <div className="p-4 rounded-2xl border card-warm-subtle flex items-center justify-between">
              <div>
                <p className="text-xs font-bold" style={{ color: 'var(--text-primary)' }}>
                  PII Privacy Mode
                </p>
                <p className="text-[11px]" style={{ color: 'var(--text-muted)' }}>
                  Mask sensitive document numbers and names in general logs and analytical aggregates.
                </p>
              </div>
              <Toggle
                active={settings.privacyMode}
                onToggle={() =>
                  setSettings((prev) => ({ ...prev, privacyMode: !prev.privacyMode }))
                }
              />
            </div>

            <div className="p-4 rounded-2xl border card-warm-subtle flex items-center justify-between">
              <div>
                <p className="text-xs font-bold" style={{ color: 'var(--text-primary)' }}>
                  Audit Data Retention Period
                </p>
                <p className="text-[11px]" style={{ color: 'var(--text-muted)' }}>
                  Automatic purge schedule for processed image scans and face vectors
                </p>
              </div>
              <select
                value={settings.retentionDays}
                onChange={(e) =>
                  setSettings((prev) => ({
                    ...prev,
                    retentionDays: parseInt(e.target.value),
                  }))
                }
                className="input w-auto text-xs font-bold"
              >
                <option value={30}>30 Days</option>
                <option value={60}>60 Days</option>
                <option value={90}>90 Days</option>
                <option value={180}>180 Days</option>
                <option value={365}>1 Year</option>
              </select>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-2">
          <button onClick={handleReset} className="btn-ghost text-xs py-2 px-3.5">
            <RotateCcw className="w-4 h-4" />
            <span>Reset to Defaults</span>
          </button>

          <button
            onClick={handleSave}
            disabled={saving}
            className="btn-primary text-xs py-3 px-6 font-bold shadow-lg"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Saving Preferences...' : saved ? '✓ Saved Successfully!' : t('btn.save', 'Save Settings')}</span>
          </button>
        </div>
      </div>
    </>
  );
}
