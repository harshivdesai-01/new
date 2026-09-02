'use client';

import { UserCheck, UserX, ArrowLeftRight, CheckCircle2, ScanFace } from 'lucide-react';
import ProgressBar from '@/components/ui/ProgressBar';
import type { FaceVerificationResult } from '@/types';

interface FaceVerificationProps {
  data: FaceVerificationResult;
}

export default function FaceVerification({ data }: FaceVerificationProps) {
  const color = data.isMatch ? 'var(--risk-low)' : 'var(--risk-high)';
  const bg = data.isMatch ? 'var(--risk-low-bg)' : 'var(--risk-high-bg)';
  const Icon = data.isMatch ? UserCheck : UserX;

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
          <span className="editorial-label">Biometrics</span>
          <h3 className="text-sm md:text-base font-bold mt-0.5" style={{ color: 'var(--text-primary)' }}>
            1:1 Face Verification
          </h3>
        </div>
        <span
          className="text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider"
          style={{ background: bg, color }}
        >
          {data.isMatch ? 'Biometric Match' : 'Mismatch Detected'}
        </span>
      </div>

      {/* Visual Comparison Frame */}
      <div
        className="p-4 rounded-xl border flex items-center justify-center gap-4 sm:gap-8"
        style={{
          background: 'var(--surface-warm)',
          borderColor: 'var(--border-subtle)',
        }}
      >
        {/* Document Portrait Box */}
        <div className="flex flex-col items-center">
          <div
            className="w-18 h-18 sm:w-20 sm:h-20 rounded-2xl flex items-center justify-center border shadow-xs text-3xl"
            style={{
              background: 'var(--surface)',
              borderColor: 'var(--border-color)',
            }}
          >
            📄
          </div>
          <span className="text-[11px] font-bold mt-1.5" style={{ color: 'var(--text-secondary)' }}>
            Document Crop
          </span>
        </div>

        {/* Center Similarity Metric */}
        <div className="flex flex-col items-center gap-1">
          <ArrowLeftRight className="w-4 h-4 text-stone-400" />
          <span className="text-xl font-extrabold font-mono" style={{ color }}>
            {Math.round(data.similarity * 100)}%
          </span>
          <span className="text-[10px] font-semibold uppercase tracking-wider text-stone-400">
            Similarity
          </span>
        </div>

        {/* Selfie Portrait Box */}
        <div className="flex flex-col items-center">
          <div
            className="w-18 h-18 sm:w-20 sm:h-20 rounded-2xl flex items-center justify-center border shadow-xs text-3xl"
            style={{
              background: 'var(--surface)',
              borderColor: 'var(--border-color)',
            }}
          >
            🤳
          </div>
          <span className="text-[11px] font-bold mt-1.5" style={{ color: 'var(--text-secondary)' }}>
            Live Selfie
          </span>
        </div>
      </div>

      {/* Result Callout */}
      <div className="p-3.5 rounded-xl border flex items-center gap-3" style={{ background: bg, borderColor: `${color}30` }}>
        <Icon className="w-5 h-5 flex-shrink-0" style={{ color }} />
        <div className="flex-1 min-w-0">
          <p className="text-xs font-bold" style={{ color }}>
            {data.isMatch ? 'Face Match Confirmed (High Confidence)' : 'Face Discrepancy Detected'}
          </p>
          <p className="text-[11px] mt-0.5" style={{ color: 'var(--text-secondary)' }}>
            Calculated: {Math.round(data.similarity * 100)}% • Rejection threshold: {Math.round(data.threshold * 100)}%
          </p>
        </div>
      </div>

      {/* Similarity Progress Bar */}
      <div className="space-y-1">
        <ProgressBar
          value={data.similarity * 100}
          color={color}
          label="Facial Embedding Similarity"
          showValue
        />
      </div>

      <p className="text-[11px] leading-relaxed" style={{ color: 'var(--text-muted)' }}>
        {data.explanation}
      </p>
    </div>
  );
}
