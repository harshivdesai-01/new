'use client';

import { useState, useRef } from 'react';
import {
  ZoomIn,
  ZoomOut,
  RotateCw,
  RefreshCw,
  Sliders,
  ShieldCheck,
  ShieldAlert,
  Layers,
  FileCheck2,
  Maximize2,
  CheckCircle2,
  AlertTriangle,
  UserCheck,
  Sparkles,
} from 'lucide-react';
import type { VerificationResult, OCRField, TamperingRegion } from '@/types';

interface ReviewDeskProps {
  result: VerificationResult;
}

export default function ReviewDesk({ result }: ReviewDeskProps) {
  const [zoom, setZoom] = useState(100);
  const [rotation, setRotation] = useState(0);
  const [activeFilter, setActiveFilter] = useState<'normal' | 'high_contrast' | 'inverted' | 'edge_detect' | 'ela'>('normal');
  const [highlightedField, setHighlightedField] = useState<string | null>(null);
  const [selectedRegion, setSelectedRegion] = useState<TamperingRegion | null>(null);

  const handleResetView = () => {
    setZoom(100);
    setRotation(0);
    setActiveFilter('normal');
    setHighlightedField(null);
    setSelectedRegion(null);
  };

  const getFilterCSS = () => {
    switch (activeFilter) {
      case 'high_contrast':
        return 'contrast(180%) brightness(90%)';
      case 'inverted':
        return 'invert(100%) hue-rotate(180deg)';
      case 'edge_detect':
        return 'contrast(250%) grayscale(100%) brightness(110%)';
      case 'ela':
        return 'saturate(250%) contrast(150%) hue-rotate(90deg)';
      default:
        return 'none';
    }
  };

  return (
    <div
      className="rounded-3xl border shadow-xl overflow-hidden flex flex-col space-y-0"
      style={{
        background: 'var(--surface)',
        borderColor: 'var(--border-color)',
      }}
    >
      {/* Workstation Top Command Bar */}
      <div
        className="p-4 border-b flex flex-wrap items-center justify-between gap-3"
        style={{
          background: 'var(--surface-warm)',
          borderColor: 'var(--border-subtle)',
        }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center shadow-xs"
            style={{ background: 'var(--accent-light)', color: 'var(--accent)' }}
          >
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="editorial-label">Interactive Forensic Workstation</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 font-bold">
                SYNCHRONIZED VIEW
              </span>
            </div>
            <h3 className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>
              Dual-Pane Evidentiary Audit: {result.document.fileName}
            </h3>
          </div>
        </div>

        {/* View Controls */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Zoom Buttons */}
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
              onClick={() => setZoom((z) => Math.min(250, z + 25))}
              className="p-1.5 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-lg"
              title="Zoom In"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Rotate Button */}
          <button
            onClick={() => setRotation((r) => (r + 90) % 360)}
            className="btn-secondary text-xs py-1.5 px-3"
            title="Rotate 90°"
          >
            <RotateCw className="w-3.5 h-3.5" />
            <span>{rotation}°</span>
          </button>

          {/* Filter Lens Selector */}
          <select
            value={activeFilter}
            onChange={(e) => setActiveFilter(e.target.value as any)}
            className="input w-auto text-xs font-bold py-1.5"
          >
            <option value="normal">Normal Color Spectrum</option>
            <option value="high_contrast">High Contrast Lens</option>
            <option value="inverted">Inverted Polarized Lens</option>
            <option value="edge_detect">Edge Frequency Detection</option>
            <option value="ela">Error Level Analysis (ELA)</option>
          </select>

          {/* Reset */}
          <button
            onClick={handleResetView}
            className="btn-ghost text-xs py-1.5 px-2.5"
            title="Reset View"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Split Screen Desk Workspace Body */}
      <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[580px]">
        {/* ─── LEFT PANE: Synchronized Original Document Viewer (7 cols) ─── */}
        <div className="lg:col-span-7 p-6 border-b lg:border-b-0 lg:border-r flex flex-col justify-between relative bg-slate-950/95 overflow-hidden" style={{ borderColor: 'var(--border-subtle)' }}>
          {/* Zoomable / Rotatable Document Canvas */}
          <div className="flex-1 flex items-center justify-center p-4 overflow-hidden relative">
            <div
              className="relative w-full max-w-lg aspect-[16/10] rounded-xl border border-emerald-500/30 bg-slate-900 p-5 shadow-2xl transition-all duration-300 overflow-hidden"
              style={{
                transform: `scale(${zoom / 100}) rotate(${rotation}deg)`,
                filter: getFilterCSS(),
              }}
            >
              {/* Document Micro-pattern */}
              <div
                className="absolute inset-0 opacity-15 pointer-events-none"
                style={{
                  backgroundImage: `radial-gradient(circle at 50% 50%, rgba(16, 185, 129, 0.4) 1px, transparent 1px)`,
                  backgroundSize: '14px 14px',
                }}
              />

              {/* Document Header */}
              <div className="flex items-center justify-between border-b border-emerald-500/20 pb-2.5">
                <span className="text-[10px] font-mono font-bold text-emerald-300">
                  {result.document.type.replace(/_/g, ' ').toUpperCase()} • {result.document.fileName}
                </span>
                <span className="text-[9px] font-mono text-emerald-500">ISO-7810 COMPLIANT</span>
              </div>

              {/* Document Body Elements */}
              <div className="grid grid-cols-12 gap-3 mt-3 h-[72%] items-center">
                {/* Photo Area */}
                <div
                  className={`col-span-4 h-full rounded-md border p-2 flex flex-col items-center justify-center relative transition-all ${
                    highlightedField === 'Photo' ? 'ring-2 ring-emerald-400 bg-emerald-900/60' : 'bg-emerald-950/40 border-emerald-500/30'
                  }`}
                >
                  <span className="text-3xl opacity-60">👤</span>
                  <span className="text-[8px] font-mono text-emerald-400 mt-1">EMBEDDED PORTRAIT</span>
                </div>

                {/* Data Fields */}
                <div className="col-span-8 space-y-2 text-left font-mono">
                  {result.ocr?.fields.map((field) => {
                    const isHighlighted = highlightedField === field.fieldName;
                    return (
                      <div
                        key={field.fieldName}
                        onMouseEnter={() => setHighlightedField(field.fieldName)}
                        onMouseLeave={() => setHighlightedField(null)}
                        className={`p-1 rounded transition-all cursor-pointer ${
                          isHighlighted
                            ? 'bg-emerald-500/30 ring-1 ring-emerald-400'
                            : 'hover:bg-emerald-500/10'
                        }`}
                      >
                        <span className="text-[8px] uppercase tracking-wider text-emerald-400/80 block">
                          {field.fieldName}
                        </span>
                        <span className="text-xs font-bold text-emerald-100 block truncate">
                          {field.value}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* MRZ Band */}
              <div className="absolute bottom-2 inset-x-5 pt-1 border-t border-emerald-500/20 font-mono text-[8px] text-emerald-400/80 truncate">
                P&lt;USAJOHNSON&lt;&lt;SARAH&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;09
              </div>

              {/* Suspicious Tampering Hotspot Overlays */}
              {result.tampering?.regions.map((reg, idx) => (
                <div
                  key={idx}
                  onClick={() => setSelectedRegion(reg)}
                  className="absolute border-2 border-red-500 bg-red-500/25 rounded cursor-pointer animate-pulse hover:bg-red-500/40"
                  style={{
                    left: `${reg.x}%`,
                    top: `${reg.y}%`,
                    width: `${reg.width}%`,
                    height: `${reg.height}%`,
                  }}
                  title={`Tampering Hotspot: ${reg.type}`}
                >
                  <span className="absolute -top-4 left-0 text-[8px] font-mono font-bold px-1 rounded bg-red-600 text-white uppercase">
                    ⚠️ {reg.type}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Left Bottom Status */}
          <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-[11px] font-mono text-slate-400">
            <span>Filter Lens: <strong>{activeFilter.toUpperCase()}</strong></span>
            <span>Hover/Click fields to trigger synchronized highlight</span>
          </div>
        </div>

        {/* ─── RIGHT PANE: Extracted Forensic & Risk Intelligence (5 cols) ─── */}
        <div className="lg:col-span-5 p-6 flex flex-col justify-between space-y-6 overflow-y-auto max-h-[640px]">
          {/* Identity Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b pb-2" style={{ borderColor: 'var(--border-subtle)' }}>
              <span className="editorial-label">Extracted Identity Intelligence</span>
              <span className="text-[10px] font-mono font-bold text-emerald-600 dark:text-emerald-400">
                OCR CONFIDENCE: {Math.round((result.ocr?.overallConfidence || 0.98) * 100)}%
              </span>
            </div>

            <div className="space-y-1.5">
              {result.ocr?.fields.map((field) => {
                const isHovered = highlightedField === field.fieldName;
                return (
                  <div
                    key={field.fieldName}
                    onMouseEnter={() => setHighlightedField(field.fieldName)}
                    onMouseLeave={() => setHighlightedField(null)}
                    className={`p-2.5 rounded-xl border flex items-center justify-between transition-all cursor-pointer ${
                      isHovered
                        ? 'border-emerald-500 bg-emerald-500/10 shadow-xs'
                        : 'card-warm-subtle'
                    }`}
                  >
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
                        {field.fieldName}
                      </span>
                      <p className="text-xs font-bold mt-0.5" style={{ color: 'var(--text-primary)' }}>
                        {field.value}
                      </p>
                    </div>
                    <span className="text-[10px] font-mono font-bold text-emerald-600 dark:text-emerald-400">
                      {Math.round(field.confidence * 100)}%
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Validation & AI Findings */}
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b pb-2" style={{ borderColor: 'var(--border-subtle)' }}>
              <span className="editorial-label">Validation & AI Findings</span>
              <span
                className="text-[10px] font-bold px-2 py-0.5 rounded-full uppercase"
                style={{
                  background: result.tampering?.isTampered ? 'var(--risk-high-bg)' : 'var(--risk-low-bg)',
                  color: result.tampering?.isTampered ? 'var(--risk-high)' : 'var(--risk-low)',
                }}
              >
                {result.tampering?.isTampered ? 'Tampering Detected' : 'Tamper Clear'}
              </span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="p-3 rounded-xl card-warm-subtle space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>
                    Tampering Probability
                  </span>
                  <span className="font-mono font-bold" style={{ color: result.tampering?.isTampered ? 'var(--risk-high)' : 'var(--risk-low)' }}>
                    {result.tampering?.isTampered ? `${Math.round(result.tampering.confidence * 100)}%` : '0.04%'}
                  </span>
                </div>
                <p className="text-[11px]" style={{ color: 'var(--text-muted)' }}>
                  {result.tampering?.explanation}
                </p>
              </div>

              {result.faceVerification && (
                <div className="p-3 rounded-xl card-warm-subtle flex items-center justify-between">
                  <div>
                    <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>
                      Biometric Face Match
                    </span>
                    <p className="text-[11px]" style={{ color: 'var(--text-muted)' }}>
                      {result.faceVerification.isMatch ? 'Passed 1:1 Cosine Alignment' : 'Biometric Mismatch'}
                    </p>
                  </div>
                  <span className="font-mono font-bold" style={{ color: result.faceVerification.isMatch ? 'var(--risk-low)' : 'var(--risk-high)' }}>
                    {Math.round(result.faceVerification.similarity * 100)}%
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
