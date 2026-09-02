'use client';

import RiskGauge from '@/components/ui/RiskGauge';
import StatusBadge from '@/components/ui/StatusBadge';
import type { RiskLevel } from '@/types';
import { ShieldCheck, AlertTriangle, XOctagon } from 'lucide-react';

interface RiskScoreHeaderProps {
  score: number;
  level: RiskLevel;
  recommendation: string;
}

export default function RiskScoreHeader({ score, level, recommendation }: RiskScoreHeaderProps) {
  const bgGradient = {
    low: 'var(--gradient-risk-low)',
    review: 'var(--gradient-risk-review)',
    high: 'var(--gradient-risk-high)',
  }[level];

  const borderColor = {
    low: 'rgba(45, 122, 77, 0.3)',
    review: 'rgba(201, 122, 30, 0.3)',
    high: 'rgba(166, 44, 44, 0.3)',
  }[level];

  const RecommendationIcon = {
    low: ShieldCheck,
    review: AlertTriangle,
    high: XOctagon,
  }[level];

  return (
    <div
      className="p-6 md:p-8 rounded-2xl border flex flex-col md:flex-row items-center gap-8 shadow-md"
      style={{ background: bgGradient, borderColor }}
    >
      <div className="flex-shrink-0">
        <RiskGauge score={score} level={level} size={150} />
      </div>

      <div className="flex-1 text-center md:text-left space-y-3">
        <div className="flex items-center gap-3 justify-center md:justify-start flex-wrap">
          <span className="editorial-label">Overall Assessment</span>
          <StatusBadge level={level} size="md" />
        </div>

        <h2 className="text-xl md:text-2xl font-extrabold tracking-tight" style={{ color: 'var(--text-primary)' }}>
          {level === 'low'
            ? 'Identity Verified — Safe to Approve'
            : level === 'review'
            ? 'Manual Review Recommended'
            : 'Critical Risk — Potential Fraud Flagged'}
        </h2>

        <div className="p-3.5 rounded-xl border card-warm-subtle flex items-start gap-3">
          <RecommendationIcon
            className="w-4 h-4 flex-shrink-0 mt-0.5"
            style={{
              color:
                level === 'low'
                  ? 'var(--risk-low)'
                  : level === 'review'
                  ? 'var(--risk-review)'
                  : 'var(--risk-high)',
            }}
          />
          <p className="text-xs md:text-sm leading-relaxed" style={{ color: 'var(--text-primary)' }}>
            {recommendation}
          </p>
        </div>
      </div>
    </div>
  );
}
