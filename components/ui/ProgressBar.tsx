'use client';

interface ProgressBarProps {
  value: number;
  max?: number;
  color?: string;
  showValue?: boolean;
  size?: 'sm' | 'md';
  label?: string;
}

export default function ProgressBar({
  value,
  max = 100,
  color,
  showValue = false,
  size = 'md',
  label,
}: ProgressBarProps) {
  const percentage = Math.min((value / max) * 100, 100);

  const barColor = color || (
    percentage >= 80 ? 'var(--risk-low)' :
    percentage >= 50 ? 'var(--risk-review)' :
    'var(--risk-high)'
  );

  const height = size === 'sm' ? 'h-1.5' : 'h-2.5';

  return (
    <div className="w-full">
      {(label || showValue) && (
        <div className="flex items-center justify-between mb-1.5">
          {label && (
            <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>
              {label}
            </span>
          )}
          {showValue && (
            <span className="text-xs font-medium" style={{ color: barColor }}>
              {Math.round(percentage)}%
            </span>
          )}
        </div>
      )}
      <div
        className={`w-full ${height} rounded-full overflow-hidden`}
        style={{ background: 'rgba(255,255,255,0.06)' }}
      >
        <div
          className={`${height} rounded-full transition-all duration-700 ease-out`}
          style={{
            width: `${percentage}%`,
            background: barColor,
            boxShadow: `0 0 8px ${barColor}40`,
          }}
        />
      </div>
    </div>
  );
}
