'use client';

import type { RiskLevel } from '@/types';
import { Shield, AlertTriangle, XOctagon } from 'lucide-react';

interface StatusBadgeProps {
  level: RiskLevel;
  size?: 'sm' | 'md';
}

const config = {
  low: { label: 'LOW RISK', color: 'var(--risk-low)', bg: 'var(--risk-low-bg)', icon: Shield },
  review: { label: 'REVIEW', color: 'var(--risk-review)', bg: 'var(--risk-review-bg)', icon: AlertTriangle },
  high: { label: 'HIGH RISK', color: 'var(--risk-high)', bg: 'var(--risk-high-bg)', icon: XOctagon },
};

export default function StatusBadge({ level, size = 'md' }: StatusBadgeProps) {
  const { label, color, bg, icon: Icon } = config[level];
  const sizeClasses = size === 'sm'
    ? 'px-2 py-0.5 text-[10px] gap-1'
    : 'px-3 py-1 text-xs gap-1.5';
  const iconSize = size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5';

  return (
    <span
      className={`inline-flex items-center rounded-full font-semibold ${sizeClasses}`}
      style={{ background: bg, color, border: `1px solid ${color}25` }}
    >
      <Icon className={iconSize} />
      {label}
    </span>
  );
}
