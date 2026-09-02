'use client';

import { CheckCircle2, AlertTriangle, XCircle, ShieldCheck } from 'lucide-react';
import type { ValidationResult, CheckStatus } from '@/types';

interface ValidationChecksProps {
  validation: ValidationResult;
}

const statusConfig: Record<CheckStatus, { icon: React.ElementType; color: string; bg: string; label: string }> = {
  pass: { icon: CheckCircle2, color: 'var(--risk-low)', bg: 'var(--risk-low-bg)', label: 'PASS' },
  warning: { icon: AlertTriangle, color: 'var(--risk-review)', bg: 'var(--risk-review-bg)', label: 'REVIEW' },
  fail: { icon: XCircle, color: 'var(--risk-high)', bg: 'var(--risk-high-bg)', label: 'FAIL' },
  skipped: { icon: CheckCircle2, color: 'var(--text-muted)', bg: 'var(--surface-warm)', label: 'SKIPPED' },
};

export default function ValidationChecks({ validation }: ValidationChecksProps) {
  const passedCount = validation.checks.filter((c) => c.status === 'pass').length;

  return (
    <div
      className="p-5 md:p-6 rounded-2xl border shadow-xs space-y-4"
      style={{
        background: 'var(--surface)',
        borderColor: 'var(--border-color)',
      }}
    >
      <div className="flex items-center justify-between">
        <div>
          <span className="editorial-label">Consistency</span>
          <h3 className="text-sm md:text-base font-bold mt-0.5" style={{ color: 'var(--text-primary)' }}>
            Document Structural & Format Validation
          </h3>
        </div>
        <span className="text-xs font-mono font-bold" style={{ color: 'var(--text-muted)' }}>
          {passedCount} / {validation.checks.length} checks passed
        </span>
      </div>

      <div className="space-y-2">
        {validation.checks.map((check) => {
          const config = statusConfig[check.status] || statusConfig.pass;
          const Icon = config.icon;

          return (
            <div
              key={check.id}
              className="p-3.5 rounded-xl border flex items-start gap-3 transition-colors"
              style={{
                background: 'var(--surface-warm)',
                borderColor: 'var(--border-subtle)',
              }}
            >
              <div
                className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
                style={{ background: config.bg, color: config.color }}
              >
                <Icon className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-xs font-bold" style={{ color: 'var(--text-primary)' }}>
                    {check.name}
                  </p>
                  <span
                    className="text-[9px] font-extrabold px-2 py-0.5 rounded uppercase tracking-wider"
                    style={{ background: config.bg, color: config.color }}
                  >
                    {config.label}
                  </span>
                </div>
                <p className="text-[11px] mt-0.5" style={{ color: 'var(--text-secondary)' }}>
                  {check.description}
                </p>
                {check.details && (
                  <p className="text-[10px] mt-1 font-mono" style={{ color: 'var(--text-muted)' }}>
                    {check.details}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
