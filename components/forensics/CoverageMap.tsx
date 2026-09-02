'use client';

import { useState } from 'react';
import {
  Globe2,
  MapPin,
  ShieldCheck,
  AlertTriangle,
  Activity,
  CheckCircle2,
  TrendingUp,
  Server,
  Layers,
  Sparkles,
  Info,
} from 'lucide-react';

export interface CoverageRegion {
  id: string;
  name: string;
  coordinates: { x: number; y: number }; // Percentage on map (0-100)
  screeningsCount: number;
  activeDeployments: number;
  clearanceRate: number; // e.g. 96.4%
  activeAlerts: number;
  status: 'operational' | 'high_volume' | 'alert';
  topDocumentTypes: string[];
  recentGate: string;
}

const defaultRegions: CoverageRegion[] = [
  {
    id: 'reg-india',
    name: 'India & South Asia',
    coordinates: { x: 68, y: 48 },
    screeningsCount: 12430,
    activeDeployments: 18,
    clearanceRate: 97.2,
    activeAlerts: 4,
    status: 'high_volume',
    topDocumentTypes: ['Passport (ICAO)', 'Aadhaar ID', 'Driver License'],
    recentGate: 'Delhi IGI Airport (T3 Border E-Gates)',
  },
  {
    id: 'reg-europe',
    name: 'Europe (Schengen Zone)',
    coordinates: { x: 50, y: 32 },
    screeningsCount: 8920,
    activeDeployments: 14,
    clearanceRate: 96.8,
    activeAlerts: 2,
    status: 'operational',
    topDocumentTypes: ['EU National ID', 'British Passport', 'Schengen Visa'],
    recentGate: 'Frankfurt Airport Terminal 1 Gate B',
  },
  {
    id: 'reg-na',
    name: 'North America (US & Canada)',
    coordinates: { x: 24, y: 34 },
    screeningsCount: 15820,
    activeDeployments: 22,
    clearanceRate: 98.1,
    activeAlerts: 5,
    status: 'high_volume',
    topDocumentTypes: ['US Passport Book', 'AAMVA Driver License', 'B1/B2 Visa'],
    recentGate: 'JFK Int Airport E-Passport Lanes',
  },
  {
    id: 'reg-me',
    name: 'Middle East (GCC Hubs)',
    coordinates: { x: 59, y: 44 },
    screeningsCount: 6210,
    activeDeployments: 10,
    clearanceRate: 95.9,
    activeAlerts: 3,
    status: 'operational',
    topDocumentTypes: ['UAE Smart Pass', 'Saudi Iqama', 'GCC Resident ID'],
    recentGate: 'Dubai International (DXB) Smart Gates',
  },
  {
    id: 'reg-sea',
    name: 'Southeast Asia (ASEAN)',
    coordinates: { x: 78, y: 56 },
    screeningsCount: 4120,
    activeDeployments: 8,
    clearanceRate: 96.5,
    activeAlerts: 1,
    status: 'operational',
    topDocumentTypes: ['Singapore NRIC', 'MYKAD Identity', 'Tourist Visa'],
    recentGate: 'Singapore Changi Terminal 4 Autogates',
  },
  {
    id: 'reg-latam',
    name: 'Latin America',
    coordinates: { x: 32, y: 68 },
    screeningsCount: 3450,
    activeDeployments: 6,
    clearanceRate: 94.7,
    activeAlerts: 2,
    status: 'operational',
    topDocumentTypes: ['Mercosur Travel Card', 'National DNI', 'Work Permit'],
    recentGate: 'São Paulo–Guarulhos International',
  },
  {
    id: 'reg-oce',
    name: 'Oceania (ANZ Hubs)',
    coordinates: { x: 86, y: 78 },
    screeningsCount: 2190,
    activeDeployments: 5,
    clearanceRate: 99.1,
    activeAlerts: 0,
    status: 'operational',
    topDocumentTypes: ['Australian ePassport', 'NZ SmartGate ID'],
    recentGate: 'Sydney Kingsford Smith SmartGates',
  },
];

export default function CoverageMap() {
  const [regions] = useState<CoverageRegion[]>(defaultRegions);
  const [selectedRegion, setSelectedRegion] = useState<CoverageRegion>(defaultRegions[0]);

  const totalScreenings = regions.reduce((acc, r) => acc + r.screeningsCount, 0);
  const totalDeployments = regions.reduce((acc, r) => acc + r.activeDeployments, 0);

  return (
    <div className="space-y-4">
      {/* ─── Control Header Toolbar ─── */}
      <div
        className="flex flex-col md:flex-row md:items-center justify-between gap-3 p-4 rounded-2xl border bg-[var(--surface)]"
        style={{ borderColor: 'var(--border-color)' }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center text-white shadow-xs"
            style={{ background: 'var(--gradient-accent)' }}
          >
            <Globe2 className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>
                Live Operational Coverage Map
              </h3>
              <span
                className="text-[10px] font-bold px-2 py-0.5 rounded-full uppercase"
                style={{ background: 'var(--accent-light)', color: 'var(--accent)' }}
              >
                DEMO SCREENING DATA
              </span>
            </div>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
              Operational inspection checkpoints, border screening activity, and real-time credential velocity.
            </p>
          </div>
        </div>

        {/* Global Aggregate Highlights */}
        <div className="flex items-center gap-3 text-xs">
          <div className="px-3 py-1.5 rounded-xl card-warm-subtle">
            <span className="text-[10px] uppercase font-bold text-[var(--text-muted)] block">Global Screenings</span>
            <span className="font-extrabold text-sm text-[var(--accent)] font-mono">{totalScreenings.toLocaleString()}</span>
          </div>
          <div className="px-3 py-1.5 rounded-xl card-warm-subtle">
            <span className="text-[10px] uppercase font-bold text-[var(--text-muted)] block">Active Checkpoints</span>
            <span className="font-extrabold text-sm text-[var(--text-primary)] font-mono">{totalDeployments} Hubs</span>
          </div>
        </div>
      </div>

      {/* ─── Map Canvas & Detail Grid ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Warm SVG Geographic Projection (8 cols) */}
        <div className="lg:col-span-8 flex flex-col space-y-3">
          <div
            className="relative aspect-[16/9] w-full rounded-2xl border overflow-hidden p-6 select-none shadow-sm flex items-center justify-center"
            style={{
              background: 'var(--surface-warm)',
              borderColor: 'var(--border-color)',
            }}
          >
            {/* Soft Warm Graticule Map Grid */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-30">
              <defs>
                <pattern id="coverage-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="var(--border-color)" strokeWidth="0.75" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#coverage-grid)" />
              {/* Equator & Meridian lines */}
              <line x1="0" y1="50%" x2="100%" y2="50%" stroke="var(--accent)" strokeWidth="0.75" strokeDasharray="3,3" opacity="0.4" />
              <line x1="50%" y1="0" x2="50%" y2="100%" stroke="var(--accent)" strokeWidth="0.75" strokeDasharray="3,3" opacity="0.4" />
            </svg>

            {/* Stylized Warm World Continental Outlines */}
            <svg
              viewBox="0 0 1000 500"
              className="absolute inset-0 w-full h-full pointer-events-none"
              style={{ filter: 'drop-shadow(0 2px 8px rgba(49, 92, 69, 0.08))' }}
            >
              {/* North America */}
              <path
                d="M 150,90 Q 220,80 280,120 Q 260,180 220,220 Q 180,240 140,190 Q 110,140 150,90 Z"
                fill="var(--surface)"
                stroke="var(--border-color)"
                strokeWidth="1.5"
              />
              {/* South America */}
              <path
                d="M 280,260 Q 350,280 340,360 Q 300,430 270,440 Q 250,380 260,310 Z"
                fill="var(--surface)"
                stroke="var(--border-color)"
                strokeWidth="1.5"
              />
              {/* Europe */}
              <path
                d="M 460,90 Q 540,80 560,130 Q 520,180 470,170 Q 440,130 460,90 Z"
                fill="var(--surface)"
                stroke="var(--border-color)"
                strokeWidth="1.5"
              />
              {/* Africa */}
              <path
                d="M 460,190 Q 550,190 560,270 Q 520,380 480,380 Q 430,310 440,230 Z"
                fill="var(--surface)"
                stroke="var(--border-color)"
                strokeWidth="1.5"
              />
              {/* Asia */}
              <path
                d="M 570,90 Q 750,70 820,160 Q 780,270 670,270 Q 610,230 580,160 Z"
                fill="var(--surface)"
                stroke="var(--border-color)"
                strokeWidth="1.5"
              />
              {/* India subcontinent */}
              <path
                d="M 660,220 Q 710,230 700,290 Q 670,310 650,260 Z"
                fill="var(--surface)"
                stroke="var(--border-color)"
                strokeWidth="1.5"
              />
              {/* Australia */}
              <path
                d="M 800,340 Q 880,330 890,400 Q 830,440 790,410 Z"
                fill="var(--surface)"
                stroke="var(--border-color)"
                strokeWidth="1.5"
              />
            </svg>

            {/* Interactive Regional Hotspots */}
            {regions.map((reg) => {
              const isSelected = selectedRegion.id === reg.id;

              return (
                <button
                  key={reg.id}
                  onClick={() => setSelectedRegion(reg)}
                  className={`absolute -translate-x-1/2 -translate-y-1/2 group cursor-pointer transition-all duration-200 z-10`}
                  style={{
                    left: `${reg.coordinates.x}%`,
                    top: `${reg.coordinates.y}%`,
                  }}
                  title={reg.name}
                >
                  {/* Outer Pulsing Wave */}
                  <span
                    className={`absolute -inset-2 rounded-full animate-ping opacity-30 ${
                      reg.status === 'high_volume' ? 'bg-[var(--accent)]' : 'bg-[var(--secondary-accent)]'
                    }`}
                  />

                  {/* Marker Node Badge */}
                  <div
                    className={`relative px-2.5 py-1 rounded-xl border flex items-center gap-1.5 shadow-sm transition-transform ${
                      isSelected
                        ? 'ring-2 ring-offset-2 ring-[var(--accent)] scale-110 bg-[var(--accent)] text-white'
                        : 'bg-[var(--surface)] text-[var(--text-primary)] hover:scale-105'
                    }`}
                    style={{
                      borderColor: isSelected ? 'var(--accent)' : 'var(--border-color)',
                    }}
                  >
                    <span
                      className="w-2 h-2 rounded-full flex-shrink-0"
                      style={{
                        background: isSelected ? '#FFFFFF' : reg.activeAlerts > 3 ? '#A94B45' : '#477A52',
                      }}
                    />
                    <span className="text-[11px] font-bold whitespace-nowrap">
                      {reg.name.split(' ')[0]}
                    </span>
                    <span
                      className="text-[9px] font-mono font-bold px-1 rounded"
                      style={{
                        background: isSelected ? 'rgba(255,255,255,0.2)' : 'var(--surface-warm)',
                        color: isSelected ? '#FFFFFF' : 'var(--text-secondary)',
                      }}
                    >
                      {Math.round(reg.screeningsCount / 1000)}k
                    </span>
                  </div>
                </button>
              );
            })}

            {/* Bottom Status Legend */}
            <div
              className="absolute bottom-3 left-3 px-3 py-1.5 rounded-xl border bg-[var(--surface)]/90 backdrop-blur-xs text-[10px] font-bold flex items-center gap-3 shadow-xs"
              style={{ borderColor: 'var(--border-subtle)', color: 'var(--text-secondary)' }}
            >
              <div className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full" style={{ background: '#477A52' }} />
                <span>Normal Traffic</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full" style={{ background: '#315C45' }} />
                <span>High Volume Checkpoint</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full" style={{ background: '#A94B45' }} />
                <span>Elevated Alert Level</span>
              </div>
            </div>
          </div>

          {/* Region Quick Select Strip */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
            {regions.map((reg) => (
              <button
                key={reg.id}
                onClick={() => setSelectedRegion(reg)}
                className={`px-3 py-1.5 rounded-xl border whitespace-nowrap transition-all cursor-pointer font-medium ${
                  selectedRegion.id === reg.id
                    ? 'bg-[var(--accent)] text-white font-bold shadow-xs'
                    : 'bg-[var(--surface)] text-[var(--text-secondary)] hover:bg-[var(--surface-warm)]'
                }`}
                style={{ borderColor: 'var(--border-color)' }}
              >
                {reg.name} ({reg.screeningsCount.toLocaleString()})
              </button>
            ))}
          </div>
        </div>

        {/* Right: Selected Region Detailed Intelligence Panel (4 cols) */}
        <div className="lg:col-span-4">
          <div
            className="p-5 rounded-2xl border space-y-4 shadow-sm fade-in-up"
            style={{
              background: 'var(--surface)',
              borderColor: 'var(--border-color)',
            }}
          >
            {/* Region Header */}
            <div className="border-b pb-3 space-y-1.5" style={{ borderColor: 'var(--border-subtle)' }}>
              <div className="flex items-center justify-between">
                <span className="editorial-label">OPERATIONAL SECTOR</span>
                <span
                  className="text-[10px] font-bold px-2 py-0.5 rounded-full uppercase"
                  style={{
                    background: selectedRegion.activeAlerts > 3 ? 'var(--risk-review-bg)' : 'var(--risk-low-bg)',
                    color: selectedRegion.activeAlerts > 3 ? 'var(--risk-review)' : 'var(--risk-low)',
                  }}
                >
                  {selectedRegion.status.replace('_', ' ')}
                </span>
              </div>
              <h4 className="text-base font-bold" style={{ color: 'var(--text-primary)' }}>
                {selectedRegion.name}
              </h4>
              <p className="text-xs flex items-center gap-1 font-medium" style={{ color: 'var(--text-muted)' }}>
                <MapPin className="w-3.5 h-3.5" style={{ color: 'var(--accent)' }} />
                <span>Primary Gate: {selectedRegion.recentGate}</span>
              </p>
            </div>

            {/* Metrics Breakdown Grid */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-3 rounded-xl card-warm-subtle space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider block" style={{ color: 'var(--text-muted)' }}>
                  Total Screenings
                </span>
                <p className="text-lg font-extrabold font-mono" style={{ color: 'var(--accent)' }}>
                  {selectedRegion.screeningsCount.toLocaleString()}
                </p>
              </div>

              <div className="p-3 rounded-xl card-warm-subtle space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider block" style={{ color: 'var(--text-muted)' }}>
                  Clearance Rate
                </span>
                <p className="text-lg font-extrabold font-mono" style={{ color: 'var(--risk-low)' }}>
                  {selectedRegion.clearanceRate}%
                </p>
              </div>

              <div className="p-3 rounded-xl card-warm-subtle space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider block" style={{ color: 'var(--text-muted)' }}>
                  Active E-Gates
                </span>
                <p className="text-base font-bold" style={{ color: 'var(--text-primary)' }}>
                  {selectedRegion.activeDeployments} Checkpoints
                </p>
              </div>

              <div className="p-3 rounded-xl card-warm-subtle space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider block" style={{ color: 'var(--text-muted)' }}>
                  Active Alerts
                </span>
                <p className="text-base font-bold" style={{ color: selectedRegion.activeAlerts > 0 ? 'var(--risk-review)' : 'var(--risk-low)' }}>
                  {selectedRegion.activeAlerts} Anomalies
                </p>
              </div>
            </div>

            {/* Frequent Credential Types */}
            <div className="space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider block" style={{ color: 'var(--text-muted)' }}>
                Frequent Screened Credential Profiles
              </span>
              <div className="space-y-1.5">
                {selectedRegion.topDocumentTypes.map((doc, idx) => (
                  <div
                    key={idx}
                    className="p-2 rounded-lg border text-xs flex items-center justify-between bg-[var(--surface-warm)]"
                    style={{ borderColor: 'var(--border-subtle)', color: 'var(--text-secondary)' }}
                  >
                    <span className="font-medium">{doc}</span>
                    <span className="text-[10px] font-mono font-bold" style={{ color: 'var(--accent)' }}>
                      HIGH CONCORDANCE
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Operational Status Note */}
            <div className="p-3 rounded-xl border flex items-center gap-2.5 text-[11px] bg-[var(--surface-warm)]" style={{ borderColor: 'var(--border-subtle)' }}>
              <Server className="w-4 h-4 flex-shrink-0" style={{ color: 'var(--accent)' }} />
              <span style={{ color: 'var(--text-secondary)' }}>
                Edge inference latency: <strong>~240ms</strong> per credential with zero packet loss across regional e-gates.
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
