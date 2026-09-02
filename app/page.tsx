'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  AlertTriangle,
  CheckCircle,
  Eye,
  ArrowRight,
  Shield,
  FileCheck2,
  Scan,
  UserCheck,
  Sparkles,
  ArrowUpRight,
  Activity,
  Layers,
  Lock,
  ChevronRight,
  Zap,
  Users,
  FileText,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import TopNav from '@/components/layout/TopNav';
import StatCard from '@/components/ui/StatCard';
import StatusBadge from '@/components/ui/StatusBadge';
import { api } from '@/services/api';
import type { DashboardStats } from '@/types';
import { useLanguage } from '@/context/LanguageContext';

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [timeFilter, setTimeFilter] = useState<'7d' | '30d'>('7d');
  const { t } = useLanguage();

  useEffect(() => {
    api.getDashboardStats().then(setStats);
  }, []);

  if (!stats) {
    return (
      <>
        <TopNav title={t('nav.dashboard', 'Dashboard')} />
        <div className="flex-1 flex items-center justify-center min-h-[60vh]">
          <div
            className="w-10 h-10 rounded-full border-3 border-t-transparent animate-spin"
            style={{ borderColor: 'var(--accent)', borderTopColor: 'transparent' }}
          />
        </div>
      </>
    );
  }

  const formatDocType = (type: string) => {
    return type.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Warm security theme chart colors
  const greenPieColors = ['#477A52', '#C58A3A', '#A94B45'];

  return (
    <>
      <TopNav title={t('nav.dashboard', 'Dashboard')} />

      <div className="flex-1 p-6 md:p-8 space-y-8 max-w-7xl mx-auto w-full">
        {/* ─── Hero Verification Center (The Visual Focal Point) ─── */}
        <section
          className="relative overflow-hidden rounded-3xl border p-6 md:p-8 transition-all shadow-md"
          style={{
            background: 'var(--gradient-warm-hero)',
            borderColor: 'var(--border-color)',
          }}
        >
          {/* Subtle green decorative background elements */}
          <div
            className="absolute -top-24 -right-24 w-80 h-80 rounded-full blur-3xl opacity-20 pointer-events-none"
            style={{ background: 'var(--accent)' }}
          />
          <div
            className="absolute -bottom-24 -left-24 w-80 h-80 rounded-full blur-3xl opacity-15 pointer-events-none"
            style={{ background: 'var(--secondary-accent)' }}
          />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left 7 cols: Editorial Headline & CTA */}
            <div className="lg:col-span-7 space-y-4">
              <div
                className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold"
                style={{ background: 'var(--accent-light)', color: 'var(--accent)' }}
              >
                <Shield className="w-3.5 h-3.5" />
                <span>{t('hero.tagline', 'BORDER SECURITY & IDENTITY INTELLIGENCE')}</span>
              </div>

              <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight" style={{ color: 'var(--text-primary)' }}>
                {t('hero.headline', 'Know before you approve.')}
              </h2>

              <p className="text-sm md:text-base leading-relaxed max-w-xl" style={{ color: 'var(--text-secondary)' }}>
                {t('hero.subtitle', 'Verify identity documents, detect tampering, and cross-reference records with multi-modal AI models in seconds.')}
              </p>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-wrap items-center gap-3">
                <Link
                  href="/verify"
                  className="btn-primary py-3 px-5 text-xs sm:text-sm font-bold shadow-md hover:scale-[1.02] transition-transform"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>{t('hero.startVerification', 'Start Verification')}</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Link>

                <Link
                  href="/desk"
                  className="btn-secondary py-3 px-4 text-xs sm:text-sm font-bold"
                >
                  <Layers className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span>Review Desk</span>
                </Link>

                <Link
                  href="/traveler-profile"
                  className="btn-secondary py-3 px-4 text-xs sm:text-sm font-bold"
                >
                  <Users className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span>Traveler Profile</span>
                </Link>
              </div>

              {/* Security trust badges */}
              <div className="pt-3 flex flex-wrap items-center gap-4 text-xs" style={{ color: 'var(--text-muted)' }}>
                <span className="flex items-center gap-1.5">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  Multi-modal OCR & MRZ
                </span>
                <span>•</span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  ELA Tamper Localization
                </span>
                <span>•</span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  1:1 Biometric Face Match
                </span>
              </div>
            </div>

            {/* Right 5 cols: Interactive Verification Visual Diagram */}
            <div className="lg:col-span-5 flex justify-center">
              <div
                className="w-full max-w-sm p-5 rounded-2xl border shadow-lg relative overflow-hidden"
                style={{
                  background: 'var(--surface)',
                  borderColor: 'var(--border-color)',
                }}
              >
                {/* Floating scan effect bar */}
                <div
                  className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-emerald-500/60 to-transparent scan-line-subtle pointer-events-none"
                />

                <div className="flex items-center justify-between mb-4 pb-3 border-b" style={{ borderColor: 'var(--border-subtle)' }}>
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ background: 'var(--risk-low)' }} />
                    <span className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--text-primary)' }}>
                      Multi-Stage Pipeline
                    </span>
                  </div>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded" style={{ background: 'var(--accent-light)', color: 'var(--accent)' }}>
                    8 STAGES
                  </span>
                </div>

                {/* Pipeline Flow Illustration */}
                <div className="space-y-3">
                  {/* Step 1: Doc */}
                  <div className="flex items-center justify-between p-2.5 rounded-xl" style={{ background: 'var(--surface-warm)' }}>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'rgba(15, 91, 64, 0.15)', color: 'var(--accent)' }}>
                        <FileCheck2 className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-xs font-bold" style={{ color: 'var(--text-primary)' }}>Document Inspection</p>
                        <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>Passport • ID • License • Visa</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-semibold text-emerald-700 dark:text-emerald-400">READY</span>
                  </div>

                  {/* Flow Connector Arrow */}
                  <div className="flex justify-center -my-1">
                    <div className="w-0.5 h-3 bg-emerald-500/40" />
                  </div>

                  {/* Step 2: Biometric */}
                  <div className="flex items-center justify-between p-2.5 rounded-xl" style={{ background: 'var(--surface-warm)' }}>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'rgba(5, 150, 105, 0.15)', color: 'var(--emerald-accent)' }}>
                        <UserCheck className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-xs font-bold" style={{ color: 'var(--text-primary)' }}>Face Match & Liveness</p>
                        <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>1:1 Biometric Alignment</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-semibold text-emerald-700 dark:text-emerald-400">ACTIVE</span>
                  </div>

                  {/* Flow Connector Arrow */}
                  <div className="flex justify-center -my-1">
                    <div className="w-0.5 h-3 bg-emerald-500/40" />
                  </div>

                  {/* Step 3: Risk Assessment */}
                  <div className="flex items-center justify-between p-2.5 rounded-xl border" style={{ background: 'var(--accent-light)', borderColor: 'rgba(15, 91, 64, 0.3)' }}>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-white" style={{ background: 'var(--accent)' }}>
                        <Sparkles className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-xs font-bold" style={{ color: 'var(--text-primary)' }}>Risk Fusion Score</p>
                        <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>Bayesian Multi-Signal Index</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold" style={{ color: 'var(--accent)' }}>AUTOMATED</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ─── Floating Editorial Insights Bar ─── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl border flex items-center gap-3 card-warm-subtle">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'var(--risk-low-bg)', color: 'var(--risk-low)' }}>
              <Activity className="w-4.5 h-4.5" />
            </div>
            <div>
              <p className="text-xs font-bold" style={{ color: 'var(--text-primary)' }}>95.8% Authenticity Rate</p>
              <p className="text-[11px]" style={{ color: 'var(--text-muted)' }}>Automated approvals with high confidence</p>
            </div>
          </div>

          <div className="p-4 rounded-2xl border flex items-center gap-3 card-warm-subtle">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'var(--risk-review-bg)', color: 'var(--risk-review)' }}>
              <Eye className="w-4.5 h-4.5" />
            </div>
            <div>
              <p className="text-xs font-bold" style={{ color: 'var(--text-primary)' }}>3 Documents in Officer Review</p>
              <p className="text-[11px]" style={{ color: 'var(--text-muted)' }}>Awaiting secondary duty inspector triage</p>
            </div>
          </div>

          <div className="p-4 rounded-2xl border flex items-center gap-3 card-warm-subtle">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'var(--accent-light)', color: 'var(--accent)' }}>
              <Zap className="w-4.5 h-4.5" />
            </div>
            <div>
              <p className="text-xs font-bold" style={{ color: 'var(--text-primary)' }}>1.4s Average Latency</p>
              <p className="text-[11px]" style={{ color: 'var(--text-muted)' }}>High-speed 8-stage neural pipeline</p>
            </div>
          </div>
        </div>

        {/* ─── Key Metrics Stat Cards ─── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title={t('stat.totalVerifications', 'Documents Audited')}
            value={stats.totalVerifications}
            icon={ShieldCheck}
            variant="default"
            trend={{ value: 14, label: t('stat.vsLastWeek', 'vs. previous cycle') }}
          />
          <StatCard
            title={t('stat.authentic', 'Confirmed Authentic')}
            value={stats.authenticCount}
            icon={CheckCircle}
            variant="low"
            trend={{ value: 9, label: t('stat.vsLastWeek', 'vs. previous cycle') }}
          />
          <StatCard
            title={t('stat.review', 'Officer Review Required')}
            value={stats.reviewCount}
            icon={Eye}
            variant="review"
            trend={{ value: 2, label: t('stat.vsLastWeek', 'vs. previous cycle') }}
          />
          <StatCard
            title={t('stat.highRisk', 'High Risk / Fraud Detected')}
            value={stats.highRiskCount}
            icon={AlertTriangle}
            variant="high"
            trend={{ value: -4, label: t('stat.vsLastWeek', 'vs. previous cycle') }}
          />
        </div>

        {/* ─── Charts Row ─── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Verification Activity (8 cols) */}
          <div className="lg:col-span-8 glass-card-static p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="editorial-label">Analytics</span>
                <h3 className="text-base font-bold" style={{ color: 'var(--text-primary)' }}>
                  Verification Activity & Risk Volume
                </h3>
              </div>
              <div className="flex gap-1 bg-stone-200/50 dark:bg-stone-800/50 p-1 rounded-lg">
                {(['7d', '30d'] as const).map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setTimeFilter(filter)}
                    className="px-3 py-1 rounded-md text-xs font-bold transition-colors cursor-pointer"
                    style={{
                      background: timeFilter === filter ? 'var(--surface)' : 'transparent',
                      color: timeFilter === filter ? 'var(--accent)' : 'var(--text-muted)',
                      boxShadow: timeFilter === filter ? 'var(--shadow-warm-sm)' : 'none',
                    }}
                  >
                    {filter.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            <div className="h-[240px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={stats.activityData}>
                  <defs>
                    <linearGradient id="gradientTotal" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#315C45" stopOpacity={0.35} />
                      <stop offset="100%" stopColor="#315C45" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="gradientHighRisk" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#A94B45" stopOpacity={0.35} />
                      <stop offset="100%" stopColor="#A94B45" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis
                    dataKey="date"
                    tickFormatter={(val) =>
                      new Date(val).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                    }
                    tick={{ fill: 'var(--text-muted)', fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fill: 'var(--text-muted)', fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip
                    contentStyle={{
                      background: 'var(--surface)',
                      borderColor: 'var(--border-color)',
                      borderRadius: '10px',
                      color: 'var(--text-primary)',
                      fontSize: '12px',
                      boxShadow: 'var(--shadow-warm-md)',
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="count"
                    stroke="#315C45"
                    strokeWidth={2.5}
                    fill="url(#gradientTotal)"
                    name="Total Audited"
                  />
                  <Area
                    type="monotone"
                    dataKey="highRisk"
                    stroke="#A94B45"
                    strokeWidth={2}
                    fill="url(#gradientHighRisk)"
                    name="High Risk Flagged"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Risk Distribution (4 cols) */}
          <div className="lg:col-span-4 glass-card-static p-6 space-y-4 flex flex-col justify-between">
            <div>
              <span className="editorial-label">Classification</span>
              <h3 className="text-base font-bold" style={{ color: 'var(--text-primary)' }}>
                Risk Distribution
              </h3>
            </div>

            <div className="h-[180px] w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={stats.riskDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={52}
                    outerRadius={76}
                    paddingAngle={4}
                    dataKey="value"
                    strokeWidth={0}
                  >
                    {stats.riskDistribution.map((entry, index) => (
                      <Cell key={index} fill={greenPieColors[index % greenPieColors.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      background: 'var(--surface)',
                      borderColor: 'var(--border-color)',
                      borderRadius: '10px',
                      color: 'var(--text-primary)',
                      fontSize: '12px',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="space-y-2 pt-2 border-t" style={{ borderColor: 'var(--border-subtle)' }}>
              {stats.riskDistribution.map((item, i) => (
                <div key={i} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ background: greenPieColors[i % greenPieColors.length] }}
                    />
                    <span style={{ color: 'var(--text-secondary)' }}>{item.name}</span>
                  </div>
                  <span className="font-bold" style={{ color: 'var(--text-primary)' }}>
                    {item.value.toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ─── Recent Verifications & Quick Security Alerts ─── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Recent Verifications (8 cols) */}
          <div className="lg:col-span-8 glass-card-static overflow-hidden">
            <div
              className="flex items-center justify-between px-6 py-4 border-b"
              style={{ borderColor: 'var(--border-color)' }}
            >
              <div>
                <span className="editorial-label">Stream</span>
                <h3 className="text-base font-bold" style={{ color: 'var(--text-primary)' }}>
                  Recent Verification Audits
                </h3>
              </div>
              <Link
                href="/history"
                className="text-xs font-bold flex items-center gap-1 hover:underline"
                style={{ color: 'var(--accent)' }}
              >
                <span>View Complete Log</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="divide-y" style={{ borderColor: 'var(--border-subtle)' }}>
              {stats.recentVerifications.map((item) => (
                <Link
                  key={item.id}
                  href={`/results/${item.id}`}
                  className="flex items-center gap-4 px-6 py-3.5 transition-colors hover:bg-stone-100/50 dark:hover:bg-stone-800/30 group"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2.5">
                      <p className="text-sm font-bold truncate group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors" style={{ color: 'var(--text-primary)' }}>
                        {item.holderName || item.documentName}
                      </p>
                      <StatusBadge level={item.riskLevel} size="sm" />
                    </div>
                    <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
                      {formatDocType(item.documentType)} • {formatDate(item.submittedAt)}
                    </p>
                  </div>

                  <div className="text-right flex-shrink-0">
                    <p
                      className="text-sm font-extrabold"
                      style={{
                        color:
                          item.riskScore <= 30
                            ? 'var(--risk-low)'
                            : item.riskScore <= 60
                            ? 'var(--risk-review)'
                            : 'var(--risk-high)',
                      }}
                    >
                      {item.riskScore}
                    </p>
                    <p className="text-[10px] uppercase font-semibold" style={{ color: 'var(--text-muted)' }}>
                      score
                    </p>
                  </div>

                  <ChevronRight className="w-4 h-4 flex-shrink-0 text-stone-400 group-hover:translate-x-0.5 transition-transform" />
                </Link>
              ))}
            </div>
          </div>

          {/* Quick Security Actions & Alerts (4 cols) */}
          <div className="lg:col-span-4 glass-card-static p-6 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div>
                <span className="editorial-label">Shortcuts</span>
                <h3 className="text-base font-bold" style={{ color: 'var(--text-primary)' }}>
                  Quick Operations
                </h3>
              </div>

              <div className="space-y-2">
                <Link
                  href="/verify"
                  className="btn-primary w-full justify-center py-3 text-xs font-bold"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Verify New Document</span>
                </Link>
                <Link
                  href="/desk"
                  className="btn-secondary w-full justify-center py-2.5 text-xs font-semibold"
                >
                  <Layers className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span>Open Review Desk</span>
                </Link>
                <Link
                  href="/traveler-profile"
                  className="btn-secondary w-full justify-center py-2.5 text-xs font-semibold"
                >
                  <Users className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span>Traveler Profiles</span>
                </Link>
                <Link
                  href="/reports"
                  className="btn-secondary w-full justify-center py-2.5 text-xs font-semibold"
                >
                  <FileText className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span>Dossier Generator</span>
                </Link>
              </div>
            </div>

            {/* Recent Alerts Feed */}
            <div className="pt-4 border-t space-y-2.5" style={{ borderColor: 'var(--border-subtle)' }}>
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                <h4 className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>
                  Active Security Flags
                </h4>
              </div>

              <div className="space-y-2">
                <div className="p-2.5 rounded-xl flex items-start gap-2.5 text-xs card-warm-subtle">
                  <div className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0 bg-red-600" />
                  <div>
                    <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>
                      High risk tampering detected
                    </span>
                    <p className="text-[11px]" style={{ color: 'var(--text-muted)' }}>Record ID: vrf-002 (Score: 89)</p>
                  </div>
                </div>

                <div className="p-2.5 rounded-xl flex items-start gap-2.5 text-xs card-warm-subtle">
                  <div className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0 bg-amber-500" />
                  <div>
                    <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>
                      Face mismatch review required
                    </span>
                    <p className="text-[11px]" style={{ color: 'var(--text-muted)' }}>Record ID: vrf-003 (Score: 62)</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
