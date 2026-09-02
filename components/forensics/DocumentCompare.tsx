'use client';

import { useState } from 'react';
import {
  Columns,
  ZoomIn,
  ZoomOut,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Sliders,
  Sparkles,
} from 'lucide-react';
import type { DocumentComparisonPair } from '@/types';

interface DocumentCompareProps {
  pair: DocumentComparisonPair;
}

export default function DocumentCompare({ pair }: DocumentCompareProps) {
  const [zoom, setZoom] = useState(100);
  const [activeHighlight, setActiveHighlight] = useState<string | null>(null);

  return (
    <div
      className="p-6 md:p-8 rounded-3xl border shadow-lg space-y-6"
      style={{
        background: 'var(--surface)',
        borderColor: 'var(--border-color)',
      }}
    >
      {/* Comparison Command Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4" style={{ borderColor: 'var(--border-subtle)' }}>
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center shadow-xs"
            style={{ background: 'var(--accent-light)', color: 'var(--accent)' }}
          >
            <Columns className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="editorial-label">Dual-Document Cross-Comparison</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 font-bold">
                SYNCHRONIZED LENS
              </span>
            </div>
            <h3 className="text-base font-bold mt-0.5" style={{ color: 'var(--text-primary)' }}>
              {pair.titleA} <span className="text-stone-400">vs</span> {pair.titleB}
            </h3>
          </div>
        </div>

        {/* Zoom Controls */}
        <div className="flex items-center gap-2">
          <div className="flex items-center rounded-xl border p-1 bg-white dark:bg-[#101E17]" style={{ borderColor: 'var(--border-subtle)' }}>
            <button
              onClick={() => setZoom((z) => Math.max(50, z - 25))}
              className="p-1.5 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-lg"
              title="Zoom Out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="text-[11px] font-mono font-bold px-2 text-stone-700 dark:text-stone-300">
              {zoom}%
            </span>
            <button
              onClick={() => setZoom((z) => Math.min(200, z + 25))}
              className="p-1.5 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-lg"
              title="Zoom In"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
          </div>

          <button
            onClick={() => setZoom(100)}
            className="btn-ghost text-xs py-1.5 px-2.5"
            title="Reset Zoom"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Side-by-Side Synchronized Canvases */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Document A */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-bold" style={{ color: 'var(--text-primary)' }}>
            <span>PRIMARY: {pair.titleA}</span>
            <span className="font-mono text-emerald-600 dark:text-emerald-400">AUTHENTIC</span>
          </div>

          <div className="relative aspect-[16/10] w-full rounded-2xl border bg-slate-950 p-4 flex items-center justify-center overflow-hidden shadow-md">
            <div
              className="relative w-[90%] h-[90%] rounded-xl border border-emerald-500/30 bg-slate-900 p-4 transition-transform duration-300 overflow-hidden font-mono"
              style={{ transform: `scale(${zoom / 100})` }}
            >
              <div className="border-b border-emerald-500/20 pb-1 text-[9px] text-emerald-400 font-bold uppercase">
                {pair.docTypeA} • REGISTRY VALIDATED
              </div>
              <div className="mt-3 space-y-2 text-[11px]">
                <div
                  className={`p-1 rounded transition-all ${
                    activeHighlight === 'Full Name' ? 'bg-emerald-500/30 ring-1 ring-emerald-400' : ''
                  }`}
                >
                  <p className="text-[8px] text-emerald-500/70 uppercase">Full Name</p>
                  <p className="text-emerald-100 font-bold">{pair.matches.find((m) => m.field === 'Full Name')?.valA || 'HARSHIV DESAI'}</p>
                </div>
                <div
                  className={`p-1 rounded transition-all ${
                    activeHighlight === 'Date of Birth' ? 'bg-emerald-500/30 ring-1 ring-emerald-400' : ''
                  }`}
                >
                  <p className="text-[8px] text-emerald-500/70 uppercase">Date of Birth</p>
                  <p className="text-emerald-200 font-bold">{pair.matches.find((m) => m.field === 'Date of Birth')?.valA || '1992-06-18'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Document B */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-bold" style={{ color: 'var(--text-primary)' }}>
            <span>SECONDARY: {pair.titleB}</span>
            <span className="font-mono text-emerald-600 dark:text-emerald-400">CORRELATED</span>
          </div>

          <div className="relative aspect-[16/10] w-full rounded-2xl border bg-slate-950 p-4 flex items-center justify-center overflow-hidden shadow-md">
            <div
              className="relative w-[90%] h-[90%] rounded-xl border border-emerald-500/30 bg-slate-900 p-4 transition-transform duration-300 overflow-hidden font-mono"
              style={{ transform: `scale(${zoom / 100})` }}
            >
              <div className="border-b border-emerald-500/20 pb-1 text-[9px] text-emerald-400 font-bold uppercase">
                {pair.docTypeB} • EMBASSY ISSUED
              </div>
              <div className="mt-3 space-y-2 text-[11px]">
                <div
                  className={`p-1 rounded transition-all ${
                    activeHighlight === 'Full Name' ? 'bg-emerald-500/30 ring-1 ring-emerald-400' : ''
                  }`}
                >
                  <p className="text-[8px] text-emerald-500/70 uppercase">Full Name</p>
                  <p className="text-emerald-100 font-bold">{pair.matches.find((m) => m.field === 'Full Name')?.valB || 'HARSHIV DESAI'}</p>
                </div>
                <div
                  className={`p-1 rounded transition-all ${
                    activeHighlight === 'Date of Birth' ? 'bg-emerald-500/30 ring-1 ring-emerald-400' : ''
                  }`}
                >
                  <p className="text-[8px] text-emerald-500/70 uppercase">Date of Birth</p>
                  <p className="text-emerald-200 font-bold">{pair.matches.find((m) => m.field === 'Date of Birth')?.valB || '1992-06-18'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Field-by-Field Comparison Table */}
      <div className="space-y-3">
        <span className="editorial-label">Field-by-Field Comparison Matrix</span>
        <div className="divide-y rounded-2xl border overflow-hidden" style={{ borderColor: 'var(--border-subtle)', background: 'var(--surface-warm)' }}>
          {pair.matches.map((item, idx) => {
            const isMatch = item.status === 'match';
            return (
              <div
                key={idx}
                onMouseEnter={() => setActiveHighlight(item.field)}
                onMouseLeave={() => setActiveHighlight(null)}
                className="p-3.5 flex items-center justify-between gap-4 transition-colors hover:bg-white/60 dark:hover:bg-[#101E17]/60 cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  {isMatch ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                  ) : (
                    <AlertTriangle className="w-4 h-4 text-red-600 dark:text-red-400 flex-shrink-0" />
                  )}
                  <span className="text-xs font-bold" style={{ color: 'var(--text-primary)' }}>
                    {item.field}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 text-xs font-mono">
                  <span className="text-right font-semibold" style={{ color: 'var(--text-secondary)' }}>
                    {item.valA}
                  </span>
                  <span
                    className="text-left font-bold"
                    style={{
                      color: isMatch ? 'var(--risk-low)' : 'var(--risk-high)',
                    }}
                  >
                    {item.valB}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
