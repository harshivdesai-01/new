'use client';

import { Sparkles, AlertTriangle, ShieldCheck, Info } from 'lucide-react';
import type { RiskAssessment } from '@/types';
import ProgressBar from '@/components/ui/ProgressBar';

interface RiskContributorBarsProps {
  risk: RiskAssessment;
}

export default function RiskContributorBars({ risk }: RiskContributorBarsProps) {
  return (
    <div
      className="p-6 md:p-8 rounded-3xl border shadow-xs space-y-6"
      style={{
        background: 'var(--surface)',
        borderColor: 'var(--border-color)',
      }}
    >
      <div className="flex items-center justify-between border-b pb-4" style={{ borderColor: 'var(--border-subtle)' }}>
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ background: 'var(--accent-light)', color: 'var(--accent)' }}
          >
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <span className="editorial-label">Inference Decomposition</span>
            <h3 className="text-base font-bold mt-0.5" style={{ color: 'var(--text-primary)' }}>
              AI Risk Contributor Breakdown & Rationale
            </h3>
          </div>
        </div>

        <div className="text-right">
          <span className="text-[10px] font-bold uppercase tracking-wider block" style={{ color: 'var(--text-muted)' }}>
            Overall Risk Index
          </span>
          <span
            className="text-2xl font-extrabold font-mono"
            style={{
              color:
                risk.overallScore <= 30
                  ? 'var(--risk-low)'
                  : risk.overallScore <= 60
                  ? 'var(--risk-review)'
                  : 'var(--risk-high)',
            }}
          >
            {risk.overallScore} <span className="text-xs text-stone-400">/ 100</span>
          </span>
        </div>
      </div>

      {/* Primary Risk Explanation Box */}
      <div
        className="p-5 rounded-2xl border space-y-2 card-warm-subtle"
        style={{
          borderColor:
            risk.overallScore > 60
              ? 'rgba(220, 38, 38, 0.3)'
              : risk.overallScore > 30
              ? 'rgba(217, 119, 6, 0.3)'
              : 'rgba(5, 150, 105, 0.3)',
        }}
      >
        <div className="flex items-center gap-2">
          {risk.overallScore > 60 ? (
            <AlertTriangle className="w-4 h-4 text-red-600 dark:text-red-400 flex-shrink-0" />
          ) : (
            <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
          )}
          <h4 className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--text-primary)' }}>
            Why is this document assessed as {risk.riskLevel.toUpperCase()}?
          </h4>
        </div>
        <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
          {risk.aiExplanation}
        </p>
      </div>

      {/* Contributor Signal Bars */}
      <div className="space-y-4">
        <span className="editorial-label">Risk Weight Contributors</span>
        <div className="space-y-3">
          {risk.signals.map((signal, idx) => {
            const score = signal.contributorPercent !== undefined ? signal.contributorPercent : (100 - signal.score);
            return (
              <div key={idx} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>
                    {signal.name}
                  </span>
                  <div className="flex items-center gap-2 font-mono">
                    <span className="text-[11px] text-stone-400">Weight: {(signal.weight * 100).toFixed(0)}%</span>
                    <span
                      className="font-bold text-xs"
                      style={{
                        color:
                          score > 60
                            ? 'var(--risk-high)'
                            : score > 25
                            ? 'var(--risk-review)'
                            : 'var(--risk-low)',
                      }}
                    >
                      {score}% Anomaly
                    </span>
                  </div>
                </div>

                {/* Bar */}
                <div className="w-full h-2 rounded-full overflow-hidden" style={{ background: 'var(--border-subtle)' }}>
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${Math.max(4, score)}%`,
                      background:
                        score > 60
                          ? 'var(--risk-high)'
                          : score > 25
                          ? 'var(--risk-review)'
                          : 'var(--risk-low)',
                    }}
                  />
                </div>
                <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>
                  {signal.explanation}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
