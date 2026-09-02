'use client';

import ProgressBar from '@/components/ui/ProgressBar';
import type { RiskSignal } from '@/types';
import { Shield, Info } from 'lucide-react';

interface RiskBreakdownProps {
  signals: RiskSignal[];
}

export default function RiskBreakdown({ signals }: RiskBreakdownProps) {
  const signalColor = (status: string) => {
    switch (status) {
      case 'low':
        return 'var(--risk-low)';
      case 'review':
        return 'var(--risk-review)';
      case 'high':
        return 'var(--risk-high)';
      default:
        return 'var(--text-muted)';
    }
  };

  return (
    <div
      className="p-5 md:p-6 rounded-2xl border shadow-xs space-y-4"
      style={{
        background: 'var(--surface)',
        borderColor: 'var(--border-color)',
      }}
    >
      <div>
        <span className="editorial-label">Signal Weights</span>
        <h3 className="text-sm md:text-base font-bold mt-0.5" style={{ color: 'var(--text-primary)' }}>
          Risk Signal Breakdown
        </h3>
      </div>

      <div className="space-y-4">
        {signals.map((signal, index) => {
          const color = signalColor(signal.status);
          return (
            <div key={index} className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ background: color }} />
                  <span className="font-bold" style={{ color: 'var(--text-primary)' }}>
                    {signal.name}
                  </span>
                  <span className="text-[10px] font-mono" style={{ color: 'var(--text-muted)' }}>
                    (Weight: {Math.round(signal.weight * 100)}%)
                  </span>
                </div>
                <span className="font-mono font-bold" style={{ color }}>
                  {signal.score} / 100
                </span>
              </div>

              <ProgressBar
                value={signal.score}
                color={color}
                size="sm"
              />

              <p className="text-[11px] leading-snug" style={{ color: 'var(--text-muted)' }}>
                {signal.explanation}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
