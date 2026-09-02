'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Search, Filter, ExternalLink, ChevronRight, Shield, Calendar, ArrowUpRight } from 'lucide-react';
import TopNav from '@/components/layout/TopNav';
import StatusBadge from '@/components/ui/StatusBadge';
import { api } from '@/services/api';
import type { VerificationHistoryItem, RiskLevel } from '@/types';
import { useLanguage } from '@/context/LanguageContext';

export default function HistoryPage() {
  const { t } = useLanguage();
  const [items, setItems] = useState<VerificationHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [riskFilter, setRiskFilter] = useState<string>('all');

  useEffect(() => {
    api
      .getHistory({ riskLevel: riskFilter, search })
      .then(setItems)
      .finally(() => setLoading(false));
  }, [riskFilter, search]);

  const handleSearch = (value: string) => {
    setSearch(value);
    setLoading(true);
  };

  const handleFilter = (level: string) => {
    setRiskFilter(level);
    setLoading(true);
  };

  const formatDocType = (type: string) =>
    type.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

  const filters: { label: string; value: string }[] = [
    { label: 'All Records', value: 'all' },
    { label: 'Low Risk', value: 'low' },
    { label: 'Review Required', value: 'review' },
    { label: 'High Risk', value: 'high' },
  ];

  return (
    <>
      <TopNav
        title={t('nav.history', 'Verification History')}
        breadcrumbs={[{ label: 'Dashboard', href: '/' }, { label: 'Audit History' }]}
      />

      <div className="flex-1 p-6 md:p-8 max-w-6xl mx-auto w-full space-y-6">
        {/* Search & Filter Bar */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md w-full">
            <Search
              className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4"
              style={{ color: 'var(--text-muted)' }}
            />
            <input
              type="text"
              placeholder="Search by holder name, document type, or audit ID..."
              className="input pl-10 text-xs"
              value={search}
              onChange={(e) => handleSearch(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-1.5 flex-wrap p-1 rounded-xl card-warm-subtle">
            {filters.map((f) => (
              <button
                key={f.value}
                onClick={() => handleFilter(f.value)}
                className="px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all"
                style={{
                  background: riskFilter === f.value ? 'var(--surface)' : 'transparent',
                  color: riskFilter === f.value ? 'var(--accent)' : 'var(--text-muted)',
                  boxShadow: riskFilter === f.value ? 'var(--shadow-warm-sm)' : 'none',
                }}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Audit Log Table Container */}
        <div
          className="rounded-2xl border shadow-xs overflow-hidden"
          style={{
            background: 'var(--surface)',
            borderColor: 'var(--border-color)',
          }}
        >
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b" style={{ borderColor: 'var(--border-subtle)' }}>
                  {['Audit ID', 'Holder / Subject', 'Document Format', 'Submission Date', 'Risk Score', 'Security Classification', 'Action'].map(
                    (header, i) => (
                      <th
                        key={i}
                        className="px-6 py-4 text-[10px] font-extrabold uppercase tracking-widest"
                        style={{ color: 'var(--text-muted)' }}
                      >
                        {header}
                      </th>
                    )
                  )}
                </tr>
              </thead>
              <tbody className="divide-y" style={{ borderColor: 'var(--border-subtle)' }}>
                {loading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i}>
                      {Array.from({ length: 7 }).map((_, j) => (
                        <td key={j} className="px-6 py-4">
                          <div className="shimmer h-4 rounded w-24" />
                        </td>
                      ))}
                    </tr>
                  ))
                ) : items.length === 0 ? (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-6 py-16 text-center text-xs"
                      style={{ color: 'var(--text-muted)' }}
                    >
                      No verification records found matching your filter criteria.
                    </td>
                  </tr>
                ) : (
                  items.map((item) => (
                    <tr
                      key={item.id}
                      className="transition-colors hover:bg-stone-100/40 dark:hover:bg-stone-800/30 group"
                    >
                      <td className="px-6 py-4 font-mono text-xs font-bold" style={{ color: 'var(--accent)' }}>
                        {item.id}
                      </td>

                      <td className="px-6 py-4">
                        <span className="text-sm font-bold group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors" style={{ color: 'var(--text-primary)' }}>
                          {item.holderName || '—'}
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        <span className="text-xs font-semibold" style={{ color: 'var(--text-secondary)' }}>
                          {formatDocType(item.documentType)}
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
                          {formatDate(item.submittedAt)}
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        <span
                          className="text-sm font-extrabold font-mono"
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
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        <StatusBadge level={item.riskLevel as RiskLevel} size="sm" />
                      </td>

                      <td className="px-6 py-4">
                        <Link
                          href={`/results/${item.id}`}
                          className="btn-ghost text-xs py-1.5 px-3 rounded-lg font-bold flex items-center gap-1 hover:text-emerald-700 dark:hover:text-emerald-400"
                        >
                          <span>Review</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <p className="text-[11px] text-center font-mono" style={{ color: 'var(--text-muted)' }}>
          Displaying {items.length} verification audits • Local simulated database
        </p>
      </div>
    </>
  );
}
