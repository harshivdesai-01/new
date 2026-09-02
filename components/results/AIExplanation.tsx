'use client';

import { Sparkles, Shield } from 'lucide-react';

interface AIExplanationProps {
  explanation: string;
}

export default function AIExplanation({ explanation }: AIExplanationProps) {
  return (
    <div
      className="p-5 md:p-6 rounded-2xl border shadow-xs"
      style={{
        background: 'var(--surface)',
        borderColor: 'rgba(200, 90, 50, 0.2)',
      }}
    >
      <div className="flex items-center gap-2 mb-3">
        <div
          className="w-7 h-7 rounded-lg flex items-center justify-center"
          style={{ background: 'var(--accent-light)', color: 'var(--accent)' }}
        >
          <Sparkles className="w-3.5 h-3.5" />
        </div>
        <div>
          <span className="editorial-label">Synthesis</span>
          <h3 className="text-xs md:text-sm font-bold" style={{ color: 'var(--text-primary)' }}>
            AI Forensic Summary & Decision Logic
          </h3>
        </div>
      </div>
      <p className="text-xs md:text-sm leading-relaxed pl-9" style={{ color: 'var(--text-secondary)' }}>
        {explanation}
      </p>
    </div>
  );
}
