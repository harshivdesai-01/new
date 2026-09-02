'use client';

import { useEffect, useState } from 'react';
import type { RiskLevel } from '@/types';

interface RiskGaugeProps {
  score: number;
  level: RiskLevel;
  size?: number;
  showLabel?: boolean;
}

const levelConfig = {
  low: { color: 'var(--risk-low)', label: 'LOW RISK', glow: 'rgba(45, 122, 77, 0.25)' },
  review: { color: 'var(--risk-review)', label: 'NEEDS REVIEW', glow: 'rgba(201, 122, 30, 0.25)' },
  high: { color: 'var(--risk-high)', label: 'HIGH RISK', glow: 'rgba(166, 44, 44, 0.25)' },
};

export default function RiskGauge({ score, level, size = 160, showLabel = true }: RiskGaugeProps) {
  const [animatedScore, setAnimatedScore] = useState(0);
  const { color, label, glow } = levelConfig[level];

  const strokeWidth = 9;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = (animatedScore / 100) * circumference;

  useEffect(() => {
    let start = 0;
    const duration = 1000;
    const startTime = performance.now();

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progressRatio = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progressRatio, 3);
      setAnimatedScore(Math.round(eased * score));

      if (progressRatio < 1) {
        requestAnimationFrame(animate);
      }
    };

    const animFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animFrame);
  }, [score]);

  return (
    <div className="flex flex-col items-center">
      <div className="relative" style={{ width: size, height: size }}>
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          className="transform -rotate-90"
        >
          {/* Background ring */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="var(--border-subtle)"
            strokeWidth={strokeWidth}
          />
          {/* Progress ring */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={circumference - progress}
            strokeLinecap="round"
            style={{
              transition: 'stroke-dashoffset 0.1s linear',
              filter: `drop-shadow(0 0 6px ${glow})`,
            }}
          />
        </svg>
        {/* Center text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span
            className="font-extrabold tracking-tight"
            style={{ color, fontSize: size * 0.24 }}
          >
            {animatedScore}
          </span>
          <span
            className="text-[10px] font-bold uppercase tracking-widest"
            style={{ color: 'var(--text-muted)' }}
          >
            Risk Score
          </span>
        </div>
      </div>
      {showLabel && (
        <span
          className="mt-2 text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full"
          style={{
            color,
            background: `${color}15`,
            border: `1px solid ${color}30`,
          }}
        >
          {label}
        </span>
      )}
    </div>
  );
}
