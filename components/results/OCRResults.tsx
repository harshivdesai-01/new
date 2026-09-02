'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp, Copy, Check, FileText } from 'lucide-react';
import ProgressBar from '@/components/ui/ProgressBar';
import type { OCRResult } from '@/types';

interface OCRResultsProps {
  ocr: OCRResult;
}

export default function OCRResults({ ocr }: OCRResultsProps) {
  const [expanded, setExpanded] = useState(true);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const handleCopy = (fieldName: string, value: string) => {
    navigator.clipboard.writeText(value);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2000);
  };

  return (
    <div
      className="rounded-2xl border shadow-xs overflow-hidden"
      style={{
        background: 'var(--surface)',
        borderColor: 'var(--border-color)',
      }}
    >
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between p-5 md:p-6 hover:bg-stone-200/20 dark:hover:bg-stone-800/20 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: 'var(--accent-light)', color: 'var(--accent)' }}
          >
            <FileText className="w-4 h-4" />
          </div>
          <div className="text-left">
            <span className="editorial-label">Extraction</span>
            <h3 className="text-sm md:text-base font-bold" style={{ color: 'var(--text-primary)' }}>
              Extracted OCR Attributes
            </h3>
          </div>
          <span
            className="text-[10px] font-bold px-2.5 py-0.5 rounded-full ml-2"
            style={{
              background: 'var(--risk-low-bg)',
              color: 'var(--risk-low)',
            }}
          >
            {Math.round(ocr.overallConfidence * 100)}% Confidence
          </span>
        </div>
        {expanded ? (
          <ChevronUp className="w-4 h-4 text-stone-400" />
        ) : (
          <ChevronDown className="w-4 h-4 text-stone-400" />
        )}
      </button>

      {expanded && (
        <div className="px-5 md:px-6 pb-6 pt-1 border-t" style={{ borderColor: 'var(--border-subtle)' }}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
            {ocr.fields.map((field, i) => (
              <div
                key={i}
                className="p-3.5 rounded-xl border flex items-center justify-between gap-3 card-warm-subtle"
              >
                <div className="flex-1 min-w-0">
                  <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
                    {field.fieldName}
                  </span>
                  <p className="text-xs md:text-sm font-bold truncate mt-0.5" style={{ color: 'var(--text-primary)' }}>
                    {field.value}
                  </p>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  <div className="w-16 text-right">
                    <ProgressBar
                      value={field.confidence * 100}
                      color={
                        field.confidence >= 0.9
                          ? 'var(--risk-low)'
                          : field.confidence >= 0.7
                          ? 'var(--risk-review)'
                          : 'var(--risk-high)'
                      }
                      size="sm"
                    />
                    <span className="text-[10px] font-mono font-bold" style={{ color: 'var(--text-muted)' }}>
                      {Math.round(field.confidence * 100)}%
                    </span>
                  </div>

                  <button
                    onClick={() => handleCopy(field.fieldName, field.value)}
                    className="btn-ghost p-1.5 rounded-lg"
                    title="Copy attribute"
                  >
                    {copiedField === field.fieldName ? (
                      <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between pt-4 mt-2 border-t text-[11px] font-mono" style={{ borderColor: 'var(--border-subtle)', color: 'var(--text-muted)' }}>
            <span>Inference Latency: {ocr.processingTimeMs}ms</span>
            <span>{ocr.fields.length} Fields Parsed</span>
          </div>
        </div>
      )}
    </div>
  );
}
