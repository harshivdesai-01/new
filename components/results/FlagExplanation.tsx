'use client';

import { useState } from 'react';
import {
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  ShieldAlert,
  X,
  Sparkles,
  Layers,
} from 'lucide-react';
import type { Flag } from '@/types';

interface FlagExplanationProps {
  flags: Flag[];
}

const severityConfig = {
  critical: {
    color: 'var(--risk-high)',
    bg: 'var(--risk-high-bg)',
    label: 'CRITICAL SEVERITY',
  },
  high: {
    color: '#D96B43',
    bg: 'rgba(217, 107, 67, 0.12)',
    label: 'HIGH SEVERITY',
  },
  medium: {
    color: 'var(--risk-review)',
    bg: 'var(--risk-review-bg)',
    label: 'MEDIUM CONCERN',
  },
  low: {
    color: 'var(--status-info)',
    bg: 'rgba(58, 110, 165, 0.12)',
    label: 'INFORMATIONAL',
  },
};

export default function FlagExplanation({ flags }: FlagExplanationProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(flags[0]?.id || null);

  if (flags.length === 0) return null;

  const criticalCount = flags.filter((f) => f.severity === 'critical' || f.severity === 'high').length;

  return (
    <>
      {/* Evidence Banner with "Why was this flagged?" CTA */}
      <div
        className="p-5 rounded-2xl border shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4"
        style={{
          background: 'var(--surface)',
          borderColor: criticalCount > 0 ? 'rgba(166, 44, 44, 0.3)' : 'rgba(201, 122, 30, 0.3)',
        }}
      >
        <div className="flex items-start gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{
              background: criticalCount > 0 ? 'var(--risk-high-bg)' : 'var(--risk-review-bg)',
              color: criticalCount > 0 ? 'var(--risk-high)' : 'var(--risk-review)',
            }}
          >
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="editorial-label">Anomaly Report</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background: 'var(--risk-high-bg)', color: 'var(--risk-high)' }}>
                {flags.length} Flagged {flags.length === 1 ? 'Item' : 'Items'}
              </span>
            </div>
            <h3 className="text-sm font-bold mt-0.5" style={{ color: 'var(--text-primary)' }}>
              {flags[0]?.title || 'Security Anomaly Detected'}
            </h3>
            <p className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>
              {flags[0]?.description}
            </p>
          </div>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="btn-primary text-xs py-2.5 px-4 font-bold flex-shrink-0 self-start sm:self-center shadow-md"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Why was this flagged?</span>
        </button>
      </div>

      {/* Interactive Modal / Drawer for Detailed Evidence Breakdown */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm fade-in-up">
          <div
            className="w-full max-w-2xl max-h-[85vh] flex flex-col rounded-2xl border shadow-2xl overflow-hidden"
            style={{
              background: 'var(--surface)',
              borderColor: 'var(--border-color)',
            }}
          >
            {/* Modal Header */}
            <div className="p-6 border-b flex items-center justify-between" style={{ borderColor: 'var(--border-subtle)' }}>
              <div className="flex items-center gap-3">
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center"
                  style={{ background: 'var(--accent-light)', color: 'var(--accent)' }}
                >
                  <ShieldAlert className="w-5 h-5" />
                </div>
                <div>
                  <span className="editorial-label">Forensic Evidence</span>
                  <h3 className="text-base font-bold" style={{ color: 'var(--text-primary)' }}>
                    Why was this flagged? ({flags.length} Findings)
                  </h3>
                </div>
              </div>
              <button onClick={() => setModalOpen(false)} className="btn-ghost p-1.5">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body: Evidence Cards */}
            <div className="p-6 overflow-y-auto space-y-3">
              {flags.map((flag) => {
                const severity = severityConfig[flag.severity];
                const isExpanded = expandedId === flag.id;

                return (
                  <div
                    key={flag.id}
                    className="rounded-xl border overflow-hidden transition-all"
                    style={{
                      background: 'var(--surface-warm)',
                      borderColor: isExpanded ? severity.color : 'var(--border-subtle)',
                    }}
                  >
                    <button
                      onClick={() => setExpandedId(isExpanded ? null : flag.id)}
                      className="w-full flex items-start gap-3 p-4 text-left hover:bg-stone-200/30 dark:hover:bg-stone-800/30 transition-colors"
                    >
                      <span
                        className="text-[9px] font-extrabold px-2 py-0.5 rounded uppercase tracking-wider flex-shrink-0 mt-0.5"
                        style={{ background: severity.bg, color: severity.color }}
                      >
                        {severity.label}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold" style={{ color: 'var(--text-primary)' }}>
                          {flag.title}
                        </p>
                        <p className="text-[11px] mt-0.5" style={{ color: 'var(--text-secondary)' }}>
                          {flag.description}
                        </p>
                      </div>
                      <div className="text-right flex-shrink-0 font-mono text-xs font-bold" style={{ color: severity.color }}>
                        {Math.round(flag.confidence * 100)}% conf
                      </div>
                      {isExpanded ? (
                        <ChevronUp className="w-4 h-4 text-stone-400" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-stone-400" />
                      )}
                    </button>

                    {isExpanded && (
                      <div className="px-4 pb-4 pt-1">
                        <div
                          className="p-3.5 rounded-lg text-xs leading-relaxed border-l-3"
                          style={{
                            background: 'var(--surface)',
                            borderLeftColor: severity.color,
                            borderLeftWidth: '3px',
                          }}
                        >
                          <p className="font-bold text-[11px] uppercase tracking-wider mb-1" style={{ color: 'var(--text-muted)' }}>
                            Forensic Evidence & Model Artifacts
                          </p>
                          <p style={{ color: 'var(--text-primary)' }}>{flag.evidence}</p>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t flex justify-end" style={{ borderColor: 'var(--border-subtle)' }}>
              <button onClick={() => setModalOpen(false)} className="btn-secondary text-xs py-2 px-4">
                Close Evidence Modal
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
