'use client';

import type { PipelineStepStatus } from '@/types';
import {
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Loader2,
  Clock,
} from 'lucide-react';

interface PipelineStepProps {
  name: string;
  description: string;
  status: PipelineStepStatus;
  progress: number;
  duration?: number;
  index: number;
  isLast: boolean;
}

const statusConfig = {
  waiting: { icon: Clock, color: 'var(--text-muted)', bg: 'var(--surface-warm)', label: 'WAITING' },
  processing: { icon: Loader2, color: 'var(--accent)', bg: 'var(--accent-light)', label: 'PROCESSING' },
  completed: { icon: CheckCircle2, color: 'var(--risk-low)', bg: 'var(--risk-low-bg)', label: 'COMPLETED' },
  warning: { icon: AlertTriangle, color: 'var(--risk-review)', bg: 'var(--risk-review-bg)', label: 'REVIEW FLAGGED' },
  failed: { icon: XCircle, color: 'var(--risk-high)', bg: 'var(--risk-high-bg)', label: 'FAILED' },
};

export default function PipelineStepComponent({
  name,
  description,
  status,
  progress,
  duration,
  index,
  isLast,
}: PipelineStepProps) {
  const config = statusConfig[status];
  const Icon = config.icon;
  const isProcessing = status === 'processing';

  return (
    <div className="flex gap-4">
      {/* Timeline Column */}
      <div className="flex flex-col items-center">
        <div
          className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-300 ${
            isProcessing ? 'scale-105' : ''
          }`}
          style={{
            background: config.bg,
            color: config.color,
            border: `1.5px solid ${config.color}`,
            boxShadow: status !== 'waiting' ? `0 0 12px ${config.color}25` : 'none',
          }}
        >
          <Icon className={`w-4 h-4 ${isProcessing ? 'animate-spin' : ''}`} />
        </div>
        {!isLast && (
          <div
            className="w-[2px] flex-1 my-1.5 rounded-full transition-all duration-500"
            style={{
              background:
                status === 'completed' || status === 'warning'
                  ? 'var(--risk-low)'
                  : 'var(--border-subtle)',
            }}
          />
        )}
      </div>

      {/* Content Column */}
      <div className={`flex-1 pb-5 ${isLast ? '' : ''}`}>
        <div className="flex items-start justify-between gap-2">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-bold" style={{ color: 'var(--text-muted)' }}>
                0{index + 1}
              </span>
              <h4 className="text-xs font-bold" style={{ color: 'var(--text-primary)' }}>
                {name}
              </h4>
            </div>
            <p className="text-[11px] mt-0.5" style={{ color: 'var(--text-secondary)' }}>
              {description}
            </p>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            {duration && (
              <span className="text-[10px] font-mono" style={{ color: 'var(--text-muted)' }}>
                {(duration / 1000).toFixed(1)}s
              </span>
            )}
            <span
              className="text-[9px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider"
              style={{
                background: config.bg,
                color: config.color,
                border: `1px solid ${config.color}30`,
              }}
            >
              {config.label}
            </span>
          </div>
        </div>

        {/* Progress bar when processing */}
        {isProcessing && (
          <div className="mt-2.5">
            <div
              className="w-full h-1.5 rounded-full overflow-hidden"
              style={{ background: 'var(--border-subtle)' }}
            >
              <div
                className="h-full rounded-full transition-all duration-200"
                style={{
                  width: `${progress}%`,
                  background: 'var(--accent)',
                }}
              />
            </div>
            <p className="text-[10px] mt-1 font-mono" style={{ color: 'var(--accent)' }}>
              {Math.round(progress)}% analyzing features...
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
