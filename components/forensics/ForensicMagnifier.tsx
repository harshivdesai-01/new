'use client';

import { useState, useRef, useCallback } from 'react';
import { ZoomIn, Eye, ShieldAlert, Sparkles } from 'lucide-react';
import type { TamperingRegion } from '@/types';

interface ForensicMagnifierProps {
  documentTitle: string;
  regions?: TamperingRegion[];
  activeFilter?: string;
}

export default function ForensicMagnifier({
  documentTitle,
  regions = [],
  activeFilter = 'normal',
}: ForensicMagnifierProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [cursorPos, setCursorPos] = useState({ x: 50, y: 50 });
  const [activeRegion, setActiveRegion] = useState<TamperingRegion | null>(null);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setCursorPos({ x: Math.max(0, Math.min(100, x)), y: Math.max(0, Math.min(100, y)) });

    // Check if cursor intersects any suspicious tampering region
    const hit = regions.find(
      (r) => x >= r.x && x <= r.x + r.width && y >= r.y && y <= r.y + r.height
    );
    setActiveRegion(hit || null);
  }, [regions]);

  const getFilterStyle = () => {
    switch (activeFilter) {
      case 'high_contrast':
        return 'contrast(200%) brightness(95%)';
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
    <div className="relative w-full select-none rounded-xl overflow-hidden border card-warm-subtle">
      {/* Interactive Inspection Canvas */}
      <div
        ref={containerRef}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => {
          setIsHovered(false);
          setActiveRegion(null);
        }}
        onMouseMove={handleMouseMove}
        className="relative aspect-[16/10] w-full cursor-crosshair overflow-hidden bg-slate-950 flex items-center justify-center"
      >
        {/* Synthetic Document Simulation Canvas */}
        <div
          className="w-[92%] h-[90%] rounded-lg border border-emerald-900/40 bg-gradient-to-br from-slate-900 via-emerald-950/30 to-slate-900 p-6 relative overflow-hidden shadow-2xl transition-all"
          style={{ filter: getFilterStyle() }}
        >
          {/* Subtle Guilloche / Security Pattern */}
          <div
            className="absolute inset-0 opacity-15 pointer-events-none"
            style={{
              backgroundImage: `radial-gradient(circle at 50% 50%, rgba(16, 185, 129, 0.4) 1px, transparent 1px)`,
              backgroundSize: '16px 16px',
            }}
          />

          {/* Document Header */}
          <div className="flex items-center justify-between border-b border-emerald-500/20 pb-3">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-full border border-emerald-500/40 flex items-center justify-center text-[10px] text-emerald-400 font-bold">
                ★
              </div>
              <span className="text-[11px] font-mono uppercase tracking-widest text-emerald-300 font-bold">
                {documentTitle}
              </span>
            </div>
            <span className="text-[9px] font-mono text-emerald-500/80">ICAO-9303 SECURE</span>
          </div>

          {/* Document Body */}
          <div className="grid grid-cols-12 gap-4 mt-4 h-[75%] items-center">
            {/* Photo Box */}
            <div className="col-span-4 h-full rounded-md border border-emerald-500/30 bg-emerald-950/40 p-2 flex flex-col items-center justify-center relative overflow-hidden">
              <div className="w-16 h-20 rounded bg-emerald-900/40 border border-emerald-500/30 flex items-center justify-center">
                <span className="text-2xl opacity-60">👤</span>
              </div>
              <span className="text-[8px] font-mono text-emerald-400/70 mt-1 uppercase">FACIAL EMBED</span>
              {/* Hologram Overlay Simulation */}
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-emerald-400/10 to-transparent opacity-60 pointer-events-none" />
            </div>

            {/* Extracted Printed Fields Simulation */}
            <div className="col-span-8 space-y-2 text-left font-mono">
              <div>
                <p className="text-[8px] uppercase tracking-wider text-emerald-500/70">Full Name</p>
                <p className="text-xs font-bold text-emerald-100 tracking-wide">
                  {regions.length > 0 ? 'JOHN SMITH' : 'SARAH JOHNSON'}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <p className="text-[8px] uppercase tracking-wider text-emerald-500/70">Date of Birth</p>
                  <p className="text-[11px] font-bold text-emerald-200">
                    {regions.length > 0 ? '1985-11-22' : '1990-05-14'}
                  </p>
                </div>
                <div>
                  <p className="text-[8px] uppercase tracking-wider text-emerald-500/70">Nationality</p>
                  <p className="text-[11px] font-bold text-emerald-200">
                    {regions.length > 0 ? 'UNITED KINGDOM' : 'UNITED STATES'}
                  </p>
                </div>
              </div>
              <div>
                <p className="text-[8px] uppercase tracking-wider text-emerald-500/70">Doc Number</p>
                <p className="text-[11px] font-bold text-emerald-300">
                  {regions.length > 0 ? 'ID-7891011' : 'P12345678'}
                </p>
              </div>
            </div>
          </div>

          {/* MRZ Zone Barcode */}
          <div className="absolute bottom-2 inset-x-6 pt-1 border-t border-emerald-500/20 font-mono text-[8px] tracking-widest text-emerald-400/80 truncate">
            P&lt;USAJOHNSON&lt;&lt;SARAH&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;
            <br />
            P123456780USA9005142F3005138&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;06
          </div>

          {/* Suspicious Tampering Region Highlight Boxes */}
          {regions.map((reg, idx) => (
            <div
              key={idx}
              className="absolute border-2 border-red-500 bg-red-500/20 rounded pointer-events-none transition-all animate-pulse"
              style={{
                left: `${reg.x}%`,
                top: `${reg.y}%`,
                width: `${reg.width}%`,
                height: `${reg.height}%`,
              }}
            >
              <span className="absolute -top-4 left-0 text-[8px] font-mono font-bold px-1 rounded bg-red-600 text-white uppercase">
                {reg.type || 'Anomaly'} ({Math.round(reg.confidence * 100)}%)
              </span>
            </div>
          ))}
        </div>

        {/* ─── High Magnification Forensic Loupe ─── */}
        {isHovered && (
          <div
            className="absolute pointer-events-none w-36 h-36 rounded-full border-2 border-emerald-400 shadow-2xl overflow-hidden bg-slate-900/95 backdrop-blur-md flex items-center justify-center transition-transform"
            style={{
              left: `${cursorPos.x}%`,
              top: `${cursorPos.y}%`,
              transform: 'translate(-50%, -50%)',
              boxShadow: '0 0 30px rgba(16, 185, 129, 0.4), inset 0 0 15px rgba(0,0,0,0.8)',
            }}
          >
            {/* Crosshair lines */}
            <div className="absolute inset-0 flex items-center justify-center opacity-30">
              <div className="w-full h-[1px] bg-emerald-400" />
              <div className="h-full w-[1px] bg-emerald-400 absolute" />
            </div>

            {/* Magnifier Reticle Scale */}
            <div className="text-center space-y-0.5 z-10">
              <span className="text-[10px] font-mono font-bold text-emerald-300">4.0× LOUPE</span>
              <p className="text-[9px] font-mono text-emerald-400/80">
                X: {Math.round(cursorPos.x)}% Y: {Math.round(cursorPos.y)}%
              </p>
              {activeRegion ? (
                <div className="px-2 py-0.5 rounded bg-red-600/90 text-white text-[9px] font-mono font-bold uppercase mt-1">
                  ⚠️ {activeRegion.type}
                </div>
              ) : (
                <span className="text-[8px] font-mono text-emerald-400/60 block">Grid: Clear</span>
              )}
            </div>

            {/* Simulated Microscopic Pixel Distortion */}
            <div
              className="absolute inset-0 opacity-20 pointer-events-none"
              style={{
                backgroundImage: `radial-gradient(#10b981 1px, transparent 1px)`,
                backgroundSize: '4px 4px',
              }}
            />
          </div>
        )}
      </div>

      {/* Loupe Status Bar */}
      <div className="p-3 border-t flex flex-wrap items-center justify-between gap-2 text-xs" style={{ borderColor: 'var(--border-subtle)', background: 'var(--surface-warm)' }}>
        <div className="flex items-center gap-2">
          <ZoomIn className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>
            Interactive Forensics Magnifier (Hover to inspect microscopic pixels)
          </span>
        </div>

        {activeRegion ? (
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-red-500/10 text-red-700 dark:text-red-400 font-mono text-xs font-bold">
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>
              {activeRegion.type} • Confidence: {Math.round(activeRegion.confidence * 100)}%
            </span>
          </div>
        ) : (
          <span className="text-[11px] font-mono" style={{ color: 'var(--text-muted)' }}>
            Status: {regions.length > 0 ? `${regions.length} suspicious anomaly zones detected` : 'No tampering detected'}
          </span>
        )}
      </div>
    </div>
  );
}
