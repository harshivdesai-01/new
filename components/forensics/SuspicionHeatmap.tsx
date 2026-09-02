'use client';

import { useState, useRef } from 'react';
import {
  Flame,
  AlertTriangle,
  CheckCircle,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Move,
  Layers,
  ShieldAlert,
  Info,
  Sliders,
  Scan,
} from 'lucide-react';
import type { TamperingRegion } from '@/types';

interface SuspicionHeatmapProps {
  regions?: TamperingRegion[];
  documentName: string;
}

interface EnhancedRegion extends TamperingRegion {
  affectedField?: string;
}

export default function SuspicionHeatmap({
  regions = [],
  documentName,
}: SuspicionHeatmapProps) {
  // If regions have no affectedField or default items are needed, provide enriched defaults
  const sampleRegions: EnhancedRegion[] = regions.length > 0
    ? regions.map((r) => ({
        ...r,
        affectedField:
          r.category === 'text_manipulation'
            ? r.type.toLowerCase().includes('date')
              ? 'Date of Birth'
              : 'Holder Full Name'
            : r.category === 'photo_boundary'
            ? 'Passport Photograph'
            : r.category === 'stamp_anomaly'
            ? 'Visa Authentication Stamp'
            : 'Document Number & MRZ',
      }))
    : [
        {
          id: 'hm-1',
          x: 10,
          y: 22,
          width: 24,
          height: 38,
          type: 'Photo Replacement Splice',
          affectedField: 'Passport Photograph',
          confidence: 0.94,
          severity: 'high',
          category: 'photo_boundary',
          description:
            'Microscopic edge feathering along photograph boundary suggests photo replacement. High compression noise discontinuity detected.',
        },
        {
          id: 'hm-2',
          x: 40,
          y: 38,
          width: 28,
          height: 9,
          type: 'Text Manipulation (Inpainting)',
          affectedField: 'Date of Birth',
          confidence: 0.91,
          severity: 'high',
          category: 'text_manipulation',
          description:
            'Character-level visual inconsistency detected. Background guilloche waves disrupted beneath altered numerical glyphs.',
        },
        {
          id: 'hm-3',
          x: 72,
          y: 18,
          width: 20,
          height: 20,
          type: 'Stamp Forgery / Anomaly',
          affectedField: 'Consular Visa Stamp',
          confidence: 0.76,
          severity: 'medium',
          category: 'stamp_anomaly',
          description:
            'Ink diffusion pattern fails spectral UV test. Stamp alignment deviates by 4.2 degrees from authorized template.',
        },
        {
          id: 'hm-4',
          x: 40,
          y: 72,
          width: 52,
          height: 12,
          type: 'Font Kerning Inconsistency',
          affectedField: 'MRZ Checksum Row',
          confidence: 0.62,
          severity: 'low',
          category: 'font_injection',
          description:
            'Slight anti-aliasing variation detected in secondary optical checksum glyphs.',
        },
      ];

  const activeRegions = sampleRegions;
  const [activeLayer, setActiveLayer] = useState<'heatmap' | 'ela' | 'boxes'>('heatmap');
  const [zoom, setZoom] = useState<number>(1);
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [selectedHotspot, setSelectedHotspot] = useState<EnhancedRegion | null>(
    activeRegions.length > 0 ? activeRegions[0] : null
  );
  const [hoveredHotspot, setHoveredHotspot] = useState<EnhancedRegion | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);

  const handleZoomIn = () => setZoom((prev) => Math.min(prev + 0.25, 2.5));
  const handleZoomOut = () => setZoom((prev) => Math.max(prev - 0.25, 0.75));
  const handleResetZoom = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (zoom > 1) {
      setIsPanning(true);
      setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isPanning && zoom > 1) {
      setPan({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    }
  };

  const handleMouseUp = () => setIsPanning(false);

  // Warm color classification for suspicion levels
  const getSeverityStyle = (severity?: string) => {
    switch (severity) {
      case 'high':
        return {
          border: '#A94B45',
          bg: 'rgba(169, 75, 69, 0.28)',
          glow: 'rgba(169, 75, 69, 0.75)',
          badge: 'High Suspicion',
          badgeBg: '#A94B45',
          badgeText: '#FFFFFF',
          textColor: '#A94B45',
        };
      case 'medium':
        return {
          border: '#C58A3A',
          bg: 'rgba(197, 138, 58, 0.25)',
          glow: 'rgba(197, 138, 58, 0.65)',
          badge: 'Medium Suspicion',
          badgeBg: '#C58A3A',
          badgeText: '#FFFFFF',
          textColor: '#C58A3A',
        };
      case 'low':
      default:
        return {
          border: '#667A52',
          bg: 'rgba(102, 122, 82, 0.20)',
          glow: 'rgba(102, 122, 82, 0.45)',
          badge: 'Low Suspicion',
          badgeBg: '#667A52',
          badgeText: '#FFFFFF',
          textColor: '#667A52',
        };
    }
  };

  const currentDisplayHotspot = hoveredHotspot || selectedHotspot;

  return (
    <div className="space-y-4">
      {/* ─── Control Header Toolbar ─── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 p-3.5 rounded-2xl border bg-[var(--surface)]" style={{ borderColor: 'var(--border-color)' }}>
        <div className="flex items-center gap-2.5">
          <div
            className="w-8 h-8 rounded-xl flex items-center justify-center text-white shadow-xs"
            style={{ background: 'var(--gradient-accent)' }}
          >
            <Flame className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--text-primary)' }}>
              Visual Tamper Heatmap & Multi-Layer Forensic Scanner
            </h3>
            <p className="text-[11px]" style={{ color: 'var(--text-muted)' }}>
              Optical density, ELA spectrum, and localized anomaly bounding analysis for <span className="font-mono font-semibold">{documentName}</span>
            </p>
          </div>
        </div>

        {/* Action Controls: Layer Switcher & Zoom */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Layer Selector */}
          <div className="flex p-1 rounded-xl card-warm-subtle text-xs font-bold">
            <button
              onClick={() => setActiveLayer('heatmap')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                activeLayer === 'heatmap'
                  ? 'bg-[var(--accent)] text-white shadow-xs'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              🔥 Thermal Heatmap
            </button>
            <button
              onClick={() => setActiveLayer('ela')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                activeLayer === 'ela'
                  ? 'bg-[var(--accent)] text-white shadow-xs'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              ⚡ ELA Spectrum
            </button>
            <button
              onClick={() => setActiveLayer('boxes')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                activeLayer === 'boxes'
                  ? 'bg-[var(--accent)] text-white shadow-xs'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              🎯 Bounding Zones
            </button>
          </div>

          {/* Zoom Controls */}
          <div className="flex items-center gap-1 p-1 rounded-xl card-warm-subtle">
            <button
              onClick={handleZoomOut}
              className="p-1.5 rounded-lg hover:bg-[var(--surface)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors cursor-pointer"
              title="Zoom Out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="text-[11px] font-mono font-bold px-1.5 text-[var(--text-primary)] min-w-[42px] text-center">
              {Math.round(zoom * 100)}%
            </span>
            <button
              onClick={handleZoomIn}
              className="p-1.5 rounded-lg hover:bg-[var(--surface)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors cursor-pointer"
              title="Zoom In"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handleResetZoom}
              className="p-1.5 rounded-lg hover:bg-[var(--surface)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors cursor-pointer"
              title="Reset View"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* ─── Heatmap Visual Interactive Canvas ─── */}
      <div
        ref={containerRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        className={`relative aspect-[16/9] w-full rounded-2xl overflow-hidden border p-6 flex items-center justify-center select-none shadow-sm transition-colors ${
          zoom > 1 ? 'cursor-grab active:cursor-grabbing' : 'cursor-default'
        }`}
        style={{
          background: 'var(--surface-warm)',
          borderColor: 'var(--border-color)',
        }}
      >
        {/* Document Frame with Pan/Zoom Transform */}
        <div
          className="relative w-[92%] h-[90%] rounded-xl border p-6 overflow-hidden transition-transform duration-100 ease-out shadow-md"
          style={{
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
            transformOrigin: 'center center',
            background: 'var(--surface)',
            borderColor: 'var(--border-color)',
          }}
        >
          {/* Header Metadata Ribbon */}
          <div className="flex items-center justify-between border-b pb-2.5" style={{ borderColor: 'var(--border-subtle)' }}>
            <div className="flex items-center gap-2">
              <Scan className="w-3.5 h-3.5" style={{ color: 'var(--accent)' }} />
              <span className="text-[10px] font-mono font-bold tracking-wider" style={{ color: 'var(--text-primary)' }}>
                VERIDOC DENSITY ANALYZER — {documentName.toUpperCase()}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[9px] font-mono px-2 py-0.5 rounded card-warm-subtle font-bold" style={{ color: 'var(--text-secondary)' }}>
                ISO/IEC 18013 FORENSIC GRID
              </span>
              <span className="text-[9px] font-mono font-bold" style={{ color: 'var(--accent)' }}>
                CALIBRATED
              </span>
            </div>
          </div>

          {/* Document Synthetic Layout Representation */}
          <div className="grid grid-cols-12 gap-4 mt-4 h-[72%]">
            {/* Portrait Zone */}
            <div
              className="col-span-4 rounded-xl border flex flex-col items-center justify-center p-3 relative overflow-hidden"
              style={{
                background: 'var(--surface-warm)',
                borderColor: 'var(--border-subtle)',
              }}
            >
              <div className="w-20 h-24 rounded-lg border flex items-center justify-center bg-[var(--surface)] text-3xl shadow-inner" style={{ borderColor: 'var(--border-subtle)' }}>
                👤
              </div>
              <span className="text-[9px] font-mono font-bold mt-2 uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
                PRIMARY PORTRAIT
              </span>
            </div>

            {/* Document Data Fields Representation */}
            <div className="col-span-8 flex flex-col justify-between py-1 font-mono">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="h-4 rounded-md w-2/5" style={{ background: 'var(--surface-warm)' }} />
                  <div className="h-3.5 rounded-md w-1/4" style={{ background: 'var(--surface-warm)' }} />
                </div>
                <div className="h-4 rounded-md w-3/5" style={{ background: 'var(--surface-warm)' }} />
                <div className="h-4 rounded-md w-1/2" style={{ background: 'var(--surface-warm)' }} />
                <div className="h-4 rounded-md w-2/3" style={{ background: 'var(--surface-warm)' }} />
              </div>

              {/* MRZ Zone Bar */}
              <div className="p-2.5 rounded-lg border space-y-1.5" style={{ background: 'var(--surface-warm)', borderColor: 'var(--border-subtle)' }}>
                <div className="h-2.5 rounded w-full" style={{ background: 'rgba(37, 41, 35, 0.12)' }} />
                <div className="h-2.5 rounded w-5/6" style={{ background: 'rgba(37, 41, 35, 0.12)' }} />
              </div>
            </div>
          </div>

          {/* ─── Layer 1: Thermal Heatmap Blobs ─── */}
          {activeLayer === 'heatmap' && (
            <div className="absolute inset-0 pointer-events-none">
              {activeRegions.map((reg, idx) => {
                const style = getSeverityStyle(reg.severity);
                return (
                  <div
                    key={`hm-blob-${idx}`}
                    className="absolute rounded-full blur-2xl transition-opacity duration-300 animate-pulse"
                    style={{
                      left: `${reg.x}%`,
                      top: `${reg.y}%`,
                      width: `${Math.max(90, reg.width * 2.2)}px`,
                      height: `${Math.max(65, reg.height * 2.2)}px`,
                      background: `radial-gradient(circle, ${style.glow} 0%, ${style.bg} 50%, transparent 80%)`,
                      opacity: hoveredHotspot && hoveredHotspot.id !== reg.id ? 0.35 : 0.85,
                    }}
                  />
                );
              })}
            </div>
          )}

          {/* ─── Layer 2: ELA Noise Spectrum ─── */}
          {activeLayer === 'ela' && (
            <div
              className="absolute inset-0 pointer-events-none opacity-50 mix-blend-multiply dark:mix-blend-screen"
              style={{
                backgroundImage: `radial-gradient(circle at 35% 35%, rgba(184, 107, 75, 0.45) 1px, transparent 1px), radial-gradient(circle at 65% 65%, rgba(169, 75, 69, 0.5) 2px, transparent 2px), radial-gradient(circle at 50% 50%, rgba(102, 122, 82, 0.35) 1.5px, transparent 1.5px)`,
                backgroundSize: '10px 10px, 14px 14px, 8px 8px',
              }}
            />
          )}

          {/* ─── Layer 3 & Interactive Hotspot Bounding Boxes ─── */}
          {activeRegions.map((reg, idx) => {
            const style = getSeverityStyle(reg.severity);
            const isSelected = selectedHotspot?.id === reg.id;
            const isHovered = hoveredHotspot?.id === reg.id;

            return (
              <button
                key={reg.id || idx}
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedHotspot(reg);
                }}
                onMouseEnter={() => setHoveredHotspot(reg)}
                onMouseLeave={() => setHoveredHotspot(null)}
                className={`absolute rounded-lg transition-all flex flex-col justify-between p-1 cursor-pointer ${
                  isSelected
                    ? 'ring-2 ring-offset-2 ring-[var(--accent)] scale-105 z-20'
                    : isHovered
                    ? 'scale-102 z-10'
                    : 'opacity-90'
                }`}
                style={{
                  left: `${reg.x}%`,
                  top: `${reg.y}%`,
                  width: `${reg.width}%`,
                  height: `${reg.height}%`,
                  backgroundColor: style.bg,
                  border: `2px ${activeLayer === 'boxes' ? 'solid' : 'dashed'} ${style.border}`,
                  boxShadow: isSelected || isHovered ? `0 4px 14px ${style.glow}` : 'none',
                }}
              >
                <div className="flex items-center justify-between w-full">
                  <span
                    className="text-[9px] font-mono font-extrabold px-1.5 py-0.5 rounded shadow-xs"
                    style={{ background: style.badgeBg, color: style.badgeText }}
                  >
                    0{idx + 1}
                  </span>
                  <span
                    className="text-[9px] font-mono font-bold px-1 rounded bg-[var(--surface)] text-[var(--text-primary)] border shadow-xs"
                    style={{ borderColor: 'var(--border-subtle)' }}
                  >
                    {Math.round(reg.confidence * 100)}%
                  </span>
                </div>
                <div className="text-left truncate">
                  <span className="text-[8px] font-bold uppercase tracking-tight px-1 py-0.5 rounded bg-[var(--surface)]/90 text-[var(--text-primary)] truncate block">
                    {reg.affectedField || reg.type}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Legend Overlay at Bottom-Right */}
        <div
          className="absolute bottom-3 right-3 flex items-center gap-3 px-3 py-1.5 rounded-xl border bg-[var(--surface)]/90 backdrop-blur-xs text-[10px] font-bold shadow-xs"
          style={{ borderColor: 'var(--border-color)', color: 'var(--text-secondary)' }}
        >
          <div className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full" style={{ background: '#667A52' }} />
            <span>Low</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full" style={{ background: '#C58A3A' }} />
            <span>Medium</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full" style={{ background: '#A94B45' }} />
            <span>High</span>
          </div>
        </div>
      </div>

      {/* ─── Hotspot Forensic Detail Inspection Panel ─── */}
      {currentDisplayHotspot ? (
        <div
          className="p-5 rounded-2xl border transition-all fade-in-up space-y-3"
          style={{
            background: 'var(--surface)',
            borderColor: getSeverityStyle(currentDisplayHotspot.severity).border,
          }}
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b pb-3" style={{ borderColor: 'var(--border-subtle)' }}>
            <div className="flex items-center gap-2.5">
              <div
                className="w-7 h-7 rounded-lg flex items-center justify-center text-white"
                style={{ background: getSeverityStyle(currentDisplayHotspot.severity).badgeBg }}
              >
                <AlertTriangle className="w-4 h-4" />
              </div>
              <div>
                <span className="editorial-label">TAMPER INDICATOR</span>
                <h4 className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>
                  {currentDisplayHotspot.type}
                </h4>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span
                className="text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wider"
                style={{
                  background: `${getSeverityStyle(currentDisplayHotspot.severity).textColor}18`,
                  color: getSeverityStyle(currentDisplayHotspot.severity).textColor,
                  border: `1px solid ${getSeverityStyle(currentDisplayHotspot.severity).textColor}30`,
                }}
              >
                Severity: {currentDisplayHotspot.severity ? currentDisplayHotspot.severity.toUpperCase() : 'HIGH'}
              </span>
              <span
                className="text-xs font-mono font-extrabold px-3 py-1 rounded-lg text-white"
                style={{ background: getSeverityStyle(currentDisplayHotspot.severity).badgeBg }}
              >
                Confidence: {Math.round(currentDisplayHotspot.confidence * 100)}%
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1 text-xs">
            <div className="p-3 rounded-xl card-warm-subtle space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
                Affected Field
              </span>
              <p className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>
                {currentDisplayHotspot.affectedField || 'Credential Field'}
              </p>
            </div>

            <div className="p-3 rounded-xl card-warm-subtle space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
                Detection Method
              </span>
              <p className="font-semibold" style={{ color: 'var(--text-primary)' }}>
                {currentDisplayHotspot.category
                  ? currentDisplayHotspot.category.replace(/_/g, ' ').toUpperCase()
                  : 'OPTICAL COMPRESSION & ELA'}
              </p>
            </div>

            <div className="p-3 rounded-xl card-warm-subtle space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
                Coordinates & Boundary
              </span>
              <p className="font-mono text-xs" style={{ color: 'var(--text-secondary)' }}>
                X: {currentDisplayHotspot.x}% | Y: {currentDisplayHotspot.y}% | W: {currentDisplayHotspot.width}% | H: {currentDisplayHotspot.height}%
              </p>
            </div>
          </div>

          <div className="pt-2">
            <span className="text-[10px] font-bold uppercase tracking-wider block mb-1" style={{ color: 'var(--text-muted)' }}>
              Forensic Explanation
            </span>
            <p className="text-xs leading-relaxed p-3 rounded-xl border bg-[var(--surface-warm)]" style={{ color: 'var(--text-secondary)', borderColor: 'var(--border-subtle)' }}>
              {currentDisplayHotspot.description ||
                'Character-level visual inconsistency detected. Localized variance in pixel density and wave compression indicates intentional modification.'}
            </p>
          </div>
        </div>
      ) : (
        <div className="p-4 rounded-2xl border flex items-center gap-3 card-warm-subtle" style={{ borderColor: 'var(--border-color)' }}>
          <CheckCircle className="w-5 h-5" style={{ color: 'var(--risk-low)' }} />
          <div>
            <p className="text-xs font-bold" style={{ color: 'var(--text-primary)' }}>
              Uniform Pixel Density Across Document Substrate
            </p>
            <p className="text-[11px]" style={{ color: 'var(--text-muted)' }}>
              Zero high-variance localized tampering artifacts detected across optical, high-frequency ELA, and typography checks.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
