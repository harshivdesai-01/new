'use client';

import { type LucideIcon } from 'lucide-react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: { value: number; label: string };
  variant?: 'default' | 'low' | 'review' | 'high';
}

export default function StatCard({ title, value, icon: Icon, trend, variant = 'default' }: StatCardProps) {
  const variantClass = {
    default: 'stat-card-accent',
    low: 'stat-card-low',
    review: 'stat-card-review',
    high: 'stat-card-high',
  }[variant];

  const iconColor = {
    default: 'var(--accent)',
    low: 'var(--risk-low)',
    review: 'var(--risk-review)',
    high: 'var(--risk-high)',
  }[variant];

  const TrendIcon = trend ? (trend.value > 0 ? TrendingUp : trend.value < 0 ? TrendingDown : Minus) : null;
  const trendColor = trend ? (trend.value > 0 ? 'var(--risk-low)' : trend.value < 0 ? 'var(--risk-high)' : 'var(--text-muted)') : '';

  return (
    <div className={`glass-card-static p-5 ${variantClass}`}>
      <div className="flex items-start justify-between mb-3">
        <div
          className="w-10 h-10 rounded-lg flex items-center justify-center"
          style={{ background: `${iconColor}15`, color: iconColor }}
        >
          <Icon className="w-5 h-5" />
        </div>
        {trend && TrendIcon && (
          <div className="flex items-center gap-1 text-xs font-medium" style={{ color: trendColor }}>
            <TrendIcon className="w-3.5 h-3.5" />
            <span>{Math.abs(trend.value)}%</span>
          </div>
        )}
      </div>
      <p className="text-2xl font-bold mb-1" style={{ color: 'var(--text-primary)' }}>
        {typeof value === 'number' ? value.toLocaleString() : value}
      </p>
      <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
        {title}
      </p>
      {trend && (
        <p className="text-[10px] mt-1" style={{ color: 'var(--text-muted)' }}>
          {trend.label}
        </p>
      )}
    </div>
  );
}
