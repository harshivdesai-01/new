'use client';

import { useState } from 'react';
import {
  Users,
  FileText,
  Building2,
  AlertTriangle,
  Share2,
  ShieldAlert,
  Search,
  CheckCircle,
  Network,
  ListFilter,
  Info,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  RotateCcw,
} from 'lucide-react';

export type NodeType = 'person' | 'document' | 'organization' | 'event';
export type NodeRisk = 'high' | 'medium' | 'low';

export interface FraudNode {
  id: string;
  label: string;
  type: NodeType;
  risk: NodeRisk;
  x: number; // percentage position 0-100
  y: number;
  confidence: number;
  connectedCount: number;
  sharedAttributes: string[];
  details: string;
  entityRole: string;
}

export interface FraudEdge {
  from: string;
  to: string;
  label: string;
  type: 'shared_id' | 'document_ref' | 'photo_similarity' | 'address' | 'issuer_link';
  risk: NodeRisk;
}

const defaultNodes: FraudNode[] = [
  {
    id: 'node-p1',
    label: 'JOHN SMITH (Alias)',
    type: 'person',
    risk: 'high',
    x: 35,
    y: 25,
    confidence: 0.94,
    connectedCount: 4,
    sharedAttributes: ['Date of Birth (1985-11-22)', 'Photo Hash Match', 'UK Postal Code SE1'],
    details: 'Subject presented altered UK National ID (ID-7891011). Facial biometrics match 2 previous fraudulent submissions at London Heathrow.',
    entityRole: 'Primary Suspect',
  },
  {
    id: 'node-d1',
    label: 'UK ID #ID-7891011',
    type: 'document',
    risk: 'high',
    x: 62,
    y: 20,
    confidence: 0.96,
    connectedCount: 3,
    sharedAttributes: ['Modified Name Field', 'Home Office Parity Discrepancy', 'Splice Boundary'],
    details: 'Forged physical substrate originally issued to Jane Smith. Digitally altered in June 2026.',
    entityRole: 'Forged Credential',
  },
  {
    id: 'node-p2',
    label: 'JANE SMITH (Legitimate)',
    type: 'person',
    risk: 'low',
    x: 80,
    y: 42,
    confidence: 0.99,
    connectedCount: 2,
    sharedAttributes: ['Original Registry Holder', 'DOB: 1985-03-15', 'Active Passport UKP-449120'],
    details: 'Legitimate credential holder. Reported lost wallet in Manchester April 2026. Identity compromised.',
    entityRole: 'Victim of Identity Theft',
  },
  {
    id: 'node-d2',
    label: 'Passport #UKP-449120',
    type: 'document',
    risk: 'low',
    x: 82,
    y: 72,
    confidence: 0.98,
    connectedCount: 2,
    sharedAttributes: ['Official ICAO Registered', 'Zero Interpol Red Flag', 'Genuine Chip'],
    details: 'Valid British Passport active in HM Passport Office database.',
    entityRole: 'Authentic Travel Document',
  },
  {
    id: 'node-p3',
    label: 'MARK V. (Broker)',
    type: 'person',
    risk: 'high',
    x: 20,
    y: 65,
    confidence: 0.88,
    connectedCount: 3,
    sharedAttributes: ['Shared WhatsApp Contact', 'Same IP Subnet (Manchester)', 'Repeated Forgery Template'],
    details: 'Identified across 6 border screening logs as intermediary contact for synthetic travel package bookings.',
    entityRole: 'Document Broker / Facilitator',
  },
  {
    id: 'node-e1',
    label: 'Terminal 2 Gate Alert',
    type: 'event',
    risk: 'high',
    x: 48,
    y: 60,
    confidence: 0.92,
    connectedCount: 4,
    sharedAttributes: ['Rapid Successive Uploads', 'Matched Camera EXIF Tag', 'Intercept Flag'],
    details: 'Automated flag triggered when John Smith attempted secondary check-in using forged credential.',
    entityRole: 'Screening Flag Event',
  },
  {
    id: 'node-o1',
    label: 'UK Home Office Registry',
    type: 'organization',
    risk: 'low',
    x: 52,
    y: 85,
    confidence: 1.0,
    connectedCount: 2,
    sharedAttributes: ['Authoritative Identity Store', 'Active Data API Stream'],
    details: 'Official registry confirming true ownership and alert status for ID-7891011.',
    entityRole: 'Authoritative Issuer',
  },
];

const defaultEdges: FraudEdge[] = [
  { from: 'node-p1', to: 'node-d1', label: 'Presented Forged Credential', type: 'document_ref', risk: 'high' },
  { from: 'node-d1', to: 'node-p2', label: 'Stolen Identity Substrate', type: 'shared_id', risk: 'high' },
  { from: 'node-p2', to: 'node-d2', label: 'Legitimate Holder', type: 'document_ref', risk: 'low' },
  { from: 'node-p1', to: 'node-e1', label: 'Triggered Fraud Intercept', type: 'shared_id', risk: 'high' },
  { from: 'node-p3', to: 'node-p1', label: 'Shared Contact & IP Footprint', type: 'address', risk: 'high' },
  { from: 'node-p3', to: 'node-e1', label: 'Linked Booking Metadata', type: 'shared_id', risk: 'high' },
  { from: 'node-d1', to: 'node-o1', label: 'Registry Check Mismatch', type: 'issuer_link', risk: 'high' },
  { from: 'node-d2', to: 'node-o1', label: 'Verified Active Record', type: 'issuer_link', risk: 'low' },
];

export default function FraudNetwork() {
  const [nodes] = useState<FraudNode[]>(defaultNodes);
  const [edges] = useState<FraudEdge[]>(defaultEdges);
  const [selectedNode, setSelectedNode] = useState<FraudNode | null>(nodes[0]);
  const [filterType, setFilterType] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'graph' | 'list'>('graph');
  const [zoom, setZoom] = useState<number>(1);

  const filteredNodes = nodes.filter((n) => {
    if (filterType === 'all') return true;
    if (filterType === 'high-risk') return n.risk === 'high';
    return n.type === filterType;
  });

  const getNodeIcon = (type: NodeType) => {
    switch (type) {
      case 'person':
        return Users;
      case 'document':
        return FileText;
      case 'organization':
        return Building2;
      case 'event':
      default:
        return AlertTriangle;
    }
  };

  const getRiskBadge = (risk: NodeRisk) => {
    switch (risk) {
      case 'high':
        return {
          bg: '#A94B45',
          border: 'rgba(169, 75, 69, 0.35)',
          text: '#FFFFFF',
          label: 'HIGH RISK',
          accent: '#A94B45',
        };
      case 'medium':
        return {
          bg: '#C58A3A',
          border: 'rgba(197, 138, 58, 0.35)',
          text: '#FFFFFF',
          label: 'MEDIUM RISK',
          accent: '#C58A3A',
        };
      case 'low':
      default:
        return {
          bg: '#477A52',
          border: 'rgba(71, 122, 82, 0.35)',
          text: '#FFFFFF',
          label: 'AUTHENTIC / CLEAR',
          accent: '#477A52',
        };
    }
  };

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
            <Network className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>
                Fraud Ring Detection & Entity Network
              </h3>
              <span
                className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                style={{ background: 'var(--accent-light)', color: 'var(--accent)' }}
              >
                INVESTIGATION GRAPH
              </span>
            </div>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
              Cross-record correlation mapping shared identity fields, stolen credentials, and broker intermediaries.
            </p>
          </div>
        </div>

        {/* View & Filter Controls */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Filter dropdown / toggles */}
          <div className="flex p-1 rounded-xl card-warm-subtle text-xs font-semibold">
            {[
              { id: 'all', label: 'All Entities' },
              { id: 'high-risk', label: 'High Risk Only' },
              { id: 'person', label: 'Persons' },
              { id: 'document', label: 'Documents' },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setFilterType(f.id)}
                className={`px-2.5 py-1.5 rounded-lg transition-all cursor-pointer ${
                  filterType === f.id
                    ? 'bg-[var(--accent)] text-white shadow-xs'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* View Mode Toggle */}
          <div className="flex p-1 rounded-xl card-warm-subtle text-xs font-semibold">
            <button
              onClick={() => setViewMode('graph')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                viewMode === 'graph'
                  ? 'bg-[var(--surface)] text-[var(--accent)] shadow-xs font-bold'
                  : 'text-[var(--text-secondary)]'
              }`}
            >
              Graph View
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                viewMode === 'list'
                  ? 'bg-[var(--surface)] text-[var(--accent)] shadow-xs font-bold'
                  : 'text-[var(--text-secondary)]'
              }`}
            >
              Cluster List
            </button>
          </div>
        </div>
      </div>

      {/* ─── Main Content Area: Graph Canvas + Detail Panel ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Side: Relationship Graph or List View (8 cols) */}
        <div className="lg:col-span-8 flex flex-col space-y-3">
          {viewMode === 'graph' ? (
            <div
              className="relative aspect-[16/10] w-full rounded-2xl border overflow-hidden p-4 select-none shadow-sm flex items-center justify-center"
              style={{
                background: 'var(--surface)',
                borderColor: 'var(--border-color)',
              }}
            >
              {/* Graph Grid Pattern Background */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20">
                <defs>
                  <pattern id="fraud-grid" width="30" height="30" patternUnits="userSpaceOnUse">
                    <circle cx="15" cy="15" r="1" fill="var(--text-muted)" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#fraud-grid)" />
              </svg>

              {/* Connecting Relationship Edges SVG */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none">
                {edges.map((edge, idx) => {
                  const fromNode = nodes.find((n) => n.id === edge.from);
                  const toNode = nodes.find((n) => n.id === edge.to);
                  if (!fromNode || !toNode) return null;

                  const isConnectedToSelected =
                    selectedNode?.id === fromNode.id || selectedNode?.id === toNode.id;

                  const strokeColor =
                    edge.risk === 'high'
                      ? 'rgba(169, 75, 69, 0.65)'
                      : edge.risk === 'medium'
                      ? 'rgba(197, 138, 58, 0.65)'
                      : 'rgba(71, 122, 82, 0.45)';

                  return (
                    <g key={`edge-${idx}`}>
                      <line
                        x1={`${fromNode.x}%`}
                        y1={`${fromNode.y}%`}
                        x2={`${toNode.x}%`}
                        y2={`${toNode.y}%`}
                        stroke={strokeColor}
                        strokeWidth={isConnectedToSelected ? 2.5 : 1.5}
                        strokeDasharray={edge.risk === 'high' ? '4,4' : 'none'}
                        className="transition-all duration-300"
                      />
                      {/* Midpoint Label if connected */}
                      {isConnectedToSelected && (
                        <foreignObject
                          x={`${(fromNode.x + toNode.x) / 2 - 12}%`}
                          y={`${(fromNode.y + toNode.y) / 2 - 2}%`}
                          width="24%"
                          height="24px"
                          className="overflow-visible"
                        >
                          <div className="flex justify-center">
                            <span
                              className="text-[9px] font-bold px-1.5 py-0.5 rounded shadow-xs text-white"
                              style={{
                                background: edge.risk === 'high' ? '#A94B45' : '#315C45',
                              }}
                            >
                              {edge.label}
                            </span>
                          </div>
                        </foreignObject>
                      )}
                    </g>
                  );
                })}
              </svg>

              {/* Interactive Graph Nodes */}
              {filteredNodes.map((node) => {
                const Icon = getNodeIcon(node.type);
                const isSelected = selectedNode?.id === node.id;
                const riskStyle = getRiskBadge(node.risk);

                return (
                  <button
                    key={node.id}
                    onClick={() => setSelectedNode(node)}
                    className={`absolute -translate-x-1/2 -translate-y-1/2 p-2.5 rounded-2xl border transition-all duration-200 cursor-pointer flex items-center gap-2 shadow-sm ${
                      isSelected
                        ? 'ring-2 ring-offset-2 ring-[var(--accent)] scale-110 z-20'
                        : 'hover:scale-105 z-10'
                    }`}
                    style={{
                      left: `${node.x}%`,
                      top: `${node.y}%`,
                      background: isSelected ? 'var(--surface-warm)' : 'var(--surface)',
                      borderColor: isSelected ? 'var(--accent)' : riskStyle.border,
                      boxShadow: isSelected ? `0 6px 20px ${riskStyle.border}` : undefined,
                    }}
                  >
                    <div
                      className="w-7 h-7 rounded-xl flex items-center justify-center text-white flex-shrink-0 shadow-xs"
                      style={{ background: riskStyle.bg }}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="text-left min-w-[70px] max-w-[120px] truncate">
                      <p className="text-[11px] font-bold truncate" style={{ color: 'var(--text-primary)' }}>
                        {node.label}
                      </p>
                      <span className="text-[9px] font-mono block uppercase tracking-tight" style={{ color: riskStyle.accent }}>
                        {node.entityRole}
                      </span>
                    </div>
                  </button>
                );
              })}

              {/* Bottom Instructions Badge */}
              <div
                className="absolute bottom-3 left-3 px-3 py-1.5 rounded-xl border bg-[var(--surface)]/90 backdrop-blur-xs text-[11px] font-medium"
                style={{ borderColor: 'var(--border-subtle)', color: 'var(--text-muted)' }}
              >
                Click any node to inspect correlated fraud evidence & shared identity fields.
              </div>
            </div>
          ) : (
            /* List / Cluster Mode for Mobile / Compact Views */
            <div className="space-y-2.5 max-h-[460px] overflow-y-auto pr-1">
              {filteredNodes.map((node) => {
                const Icon = getNodeIcon(node.type);
                const isSelected = selectedNode?.id === node.id;
                const riskStyle = getRiskBadge(node.risk);

                return (
                  <div
                    key={node.id}
                    onClick={() => setSelectedNode(node)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                      isSelected ? 'ring-2 ring-[var(--accent)] bg-[var(--surface-warm)]' : 'bg-[var(--surface)] hover:bg-[var(--surface-warm)]'
                    }`}
                    style={{ borderColor: 'var(--border-color)' }}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-9 h-9 rounded-xl flex items-center justify-center text-white shadow-xs"
                        style={{ background: riskStyle.bg }}
                      >
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-xs font-bold" style={{ color: 'var(--text-primary)' }}>
                            {node.label}
                          </h4>
                          <span
                            className="text-[9px] font-mono font-bold px-2 py-0.5 rounded-full"
                            style={{ background: `${riskStyle.accent}20`, color: riskStyle.accent }}
                          >
                            {riskStyle.label}
                          </span>
                        </div>
                        <p className="text-[11px]" style={{ color: 'var(--text-muted)' }}>
                          {node.entityRole} • {node.connectedCount} linked records
                        </p>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-[var(--text-muted)]" />
                  </div>
                );
              })}
            </div>
          )}

          {/* Network Summary Info Box */}
          <div
            className="p-3.5 rounded-2xl border flex items-center justify-between text-xs card-warm-subtle"
            style={{ borderColor: 'var(--border-subtle)' }}
          >
            <div className="flex items-center gap-2">
              <Info className="w-4 h-4" style={{ color: 'var(--accent)' }} />
              <span style={{ color: 'var(--text-secondary)' }}>
                Identified 1 active fraud ring involving 3 altered documents and 2 correlated identity brokers.
              </span>
            </div>
            <span className="font-mono font-bold text-[11px]" style={{ color: 'var(--accent)' }}>
              7 NODES • 8 EDGES
            </span>
          </div>
        </div>

        {/* Right Side: Compact Entity Detail Panel (4 cols) */}
        <div className="lg:col-span-4">
          {selectedNode ? (
            <div
              className="p-5 rounded-2xl border space-y-4 shadow-sm fade-in-up"
              style={{
                background: 'var(--surface)',
                borderColor: getRiskBadge(selectedNode.risk).border,
              }}
            >
              {/* Header */}
              <div className="border-b pb-3 space-y-1.5" style={{ borderColor: 'var(--border-subtle)' }}>
                <div className="flex items-center justify-between">
                  <span className="editorial-label">{selectedNode.type.toUpperCase()} ENTITY</span>
                  <span
                    className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                    style={{
                      background: getRiskBadge(selectedNode.risk).bg,
                      color: getRiskBadge(selectedNode.risk).text,
                    }}
                  >
                    {getRiskBadge(selectedNode.risk).label}
                  </span>
                </div>
                <h4 className="text-base font-bold" style={{ color: 'var(--text-primary)' }}>
                  {selectedNode.label}
                </h4>
                <p className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>
                  Role: <span className="font-semibold text-[var(--text-secondary)]">{selectedNode.entityRole}</span>
                </p>
              </div>

              {/* Key Metrics Grid */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-3 rounded-xl card-warm-subtle space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider block" style={{ color: 'var(--text-muted)' }}>
                    Connected Records
                  </span>
                  <p className="text-lg font-extrabold" style={{ color: 'var(--text-primary)' }}>
                    {selectedNode.connectedCount}
                  </p>
                </div>

                <div className="p-3 rounded-xl card-warm-subtle space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider block" style={{ color: 'var(--text-muted)' }}>
                    Correlation Score
                  </span>
                  <p className="text-lg font-extrabold" style={{ color: getRiskBadge(selectedNode.risk).accent }}>
                    {Math.round(selectedNode.confidence * 100)}%
                  </p>
                </div>
              </div>

              {/* Shared Attributes List */}
              <div className="space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider block" style={{ color: 'var(--text-muted)' }}>
                  Shared Attributes & Links
                </span>
                <div className="space-y-1.5">
                  {selectedNode.sharedAttributes.map((attr, idx) => (
                    <div
                      key={idx}
                      className="p-2 rounded-lg border text-xs flex items-center gap-2 bg-[var(--surface-warm)]"
                      style={{ borderColor: 'var(--border-subtle)', color: 'var(--text-secondary)' }}
                    >
                      <span className="w-1.5 h-1.5 rounded-full" style={{ background: getRiskBadge(selectedNode.risk).accent }} />
                      <span className="font-medium truncate">{attr}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Investigation Context Notes */}
              <div className="space-y-1.5 pt-1">
                <span className="text-[10px] font-bold uppercase tracking-wider block" style={{ color: 'var(--text-muted)' }}>
                  Investigation Summary
                </span>
                <p className="text-xs leading-relaxed p-3 rounded-xl border bg-[var(--surface-warm)]" style={{ color: 'var(--text-secondary)', borderColor: 'var(--border-subtle)' }}>
                  {selectedNode.details}
                </p>
              </div>
            </div>
          ) : (
            <div className="p-6 rounded-2xl border text-center card-warm-subtle">
              <p className="text-xs font-semibold" style={{ color: 'var(--text-muted)' }}>
                Select an entity node to inspect connected records.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
