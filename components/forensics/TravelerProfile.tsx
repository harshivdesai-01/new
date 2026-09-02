'use client';

import { useState } from 'react';
import {
  Users,
  ShieldCheck,
  AlertTriangle,
  FileText,
  CheckCircle2,
  Calendar,
  Globe,
  Fingerprint,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';
import type { TravelerProfile as TravelerProfileType } from '@/types';
import ProgressBar from '@/components/ui/ProgressBar';

interface TravelerProfileProps {
  profile: TravelerProfileType;
}

export default function TravelerProfile({ profile }: TravelerProfileProps) {
  const [selectedDocId, setSelectedDocId] = useState<string>(
    profile.documents[0]?.id || ''
  );

  const selectedDoc = profile.documents.find((d) => d.id === selectedDocId);

  return (
    <div
      className="p-6 md:p-8 rounded-3xl border shadow-lg space-y-6"
      style={{
        background: 'var(--surface)',
        borderColor: 'var(--border-color)',
      }}
    >
      {/* Header Profile Summary */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-6" style={{ borderColor: 'var(--border-subtle)' }}>
        <div className="flex items-center gap-4">
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center font-bold text-xl shadow-md"
            style={{ background: 'var(--gradient-accent)', color: '#FFFFFF' }}
          >
            {profile.primaryName.charAt(0)}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="editorial-label">Cross-Document Traveler Dossier</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 font-bold">
                {profile.documents.length} LINKED CREDENTIALS
              </span>
            </div>
            <h2 className="text-xl md:text-2xl font-extrabold mt-0.5" style={{ color: 'var(--text-primary)' }}>
              {profile.primaryName}
            </h2>
            <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
              DOB: {profile.dob} • Nationality: {profile.nationality} • Profile ID: {profile.travelerId}
            </p>
          </div>
        </div>

        {/* Consistency Score Badge */}
        <div className="flex items-center gap-4 p-3.5 rounded-2xl border card-warm-subtle">
          <div className="text-right">
            <span className="text-[10px] font-bold uppercase tracking-wider block" style={{ color: 'var(--text-muted)' }}>
              Identity Consistency
            </span>
            <span
              className="text-2xl font-extrabold font-mono"
              style={{
                color:
                  profile.consistencyScore >= 90
                    ? 'var(--risk-low)'
                    : profile.consistencyScore >= 70
                    ? 'var(--risk-review)'
                    : 'var(--risk-high)',
              }}
            >
              {profile.consistencyScore}%
            </span>
          </div>
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center font-bold"
            style={{
              background:
                profile.consistencyScore >= 90
                  ? 'var(--risk-low-bg)'
                  : 'var(--risk-high-bg)',
              color:
                profile.consistencyScore >= 90
                  ? 'var(--risk-low)'
                  : 'var(--risk-high)',
            }}
          >
            {profile.consistencyScore >= 90 ? <ShieldCheck className="w-6 h-6" /> : <AlertTriangle className="w-6 h-6" />}
          </div>
        </div>
      </div>

      {/* Conflict Warnings (if any) */}
      {profile.conflicts.length > 0 && (
        <div className="space-y-2.5">
          <div className="flex items-center gap-2 text-xs font-bold text-red-600 dark:text-red-400">
            <AlertTriangle className="w-4 h-4" />
            <span>Identity Inconsistencies & Conflicts Detected ({profile.conflicts.length})</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {profile.conflicts.map((conflict, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl border bg-red-500/5 dark:bg-red-500/10 border-red-500/30 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-red-600 text-white">
                    {conflict.field}
                  </span>
                  <span className="text-[10px] font-mono text-red-600 font-bold uppercase">
                    {conflict.severity} SEVERITY
                  </span>
                </div>
                <p className="text-xs font-semibold text-red-700 dark:text-red-300">
                  {conflict.message}
                </p>
                <div className="grid grid-cols-2 gap-2 text-[11px] pt-1 border-t border-red-500/20 font-mono">
                  <div>
                    <span className="text-stone-500 block truncate">{conflict.docA.title}</span>
                    <strong className="text-red-800 dark:text-red-200">{conflict.docA.value}</strong>
                  </div>
                  <div>
                    <span className="text-stone-500 block truncate">{conflict.docB.title}</span>
                    <strong className="text-red-800 dark:text-red-200">{conflict.docB.value}</strong>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Linked Documents Grid */}
      <div className="space-y-3">
        <span className="editorial-label">Linked Identity Credentials</span>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {profile.documents.map((doc) => {
            const isSelected = selectedDocId === doc.id;
            return (
              <button
                key={doc.id}
                type="button"
                onClick={() => setSelectedDocId(doc.id)}
                className="p-4 rounded-2xl border text-left transition-all relative overflow-hidden group"
                style={{
                  background: isSelected ? 'var(--accent-light)' : 'var(--surface)',
                  borderColor: isSelected ? 'var(--accent)' : 'var(--border-subtle)',
                  boxShadow: isSelected ? '0 4px 16px var(--accent-glow)' : 'none',
                }}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-700 dark:text-emerald-400">
                    {doc.type.toUpperCase()}
                  </span>
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{
                      background:
                        doc.status === 'valid' ? 'var(--risk-low)' : 'var(--risk-high)',
                    }}
                  />
                </div>
                <h4 className="text-xs font-bold truncate" style={{ color: 'var(--text-primary)' }}>
                  {doc.title}
                </h4>
                <p className="text-[11px] font-mono mt-1" style={{ color: 'var(--text-muted)' }}>
                  #{doc.documentNumber}
                </p>
                <p className="text-[10px] mt-0.5" style={{ color: 'var(--text-muted)' }}>
                  Expires: {doc.expiryDate}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Document Consistency Matrix */}
      {selectedDoc && (
        <div className="p-5 rounded-2xl border card-warm-subtle space-y-4">
          <div className="flex items-center justify-between border-b pb-3" style={{ borderColor: 'var(--border-subtle)' }}>
            <span className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--text-primary)' }}>
              Cross-Verification Matrix for {selectedDoc.title}
            </span>
            <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400">
              ISSUING COUNTRY: {selectedDoc.issueCountry.toUpperCase()}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-white dark:bg-[#101E17] border" style={{ borderColor: 'var(--border-subtle)' }}>
              <span className="text-[10px] text-stone-500 font-semibold block">Full Name Concordance</span>
              <p className="font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">
                ✓ {selectedDoc.extractedFields.fullName}
              </p>
            </div>
            <div className="p-3 rounded-xl bg-white dark:bg-[#101E17] border" style={{ borderColor: 'var(--border-subtle)' }}>
              <span className="text-[10px] text-stone-500 font-semibold block">Date of Birth</span>
              <p className="font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">
                ✓ {selectedDoc.extractedFields.dob}
              </p>
            </div>
            <div className="p-3 rounded-xl bg-white dark:bg-[#101E17] border" style={{ borderColor: 'var(--border-subtle)' }}>
              <span className="text-[10px] text-stone-500 font-semibold block">Nationality Check</span>
              <p className="font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">
                ✓ {selectedDoc.extractedFields.nationality}
              </p>
            </div>
            <div className="p-3 rounded-xl bg-white dark:bg-[#101E17] border" style={{ borderColor: 'var(--border-subtle)' }}>
              <span className="text-[10px] text-stone-500 font-semibold block">Biometric Face Vector</span>
              <p className="font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">
                ✓ {profile.faceConsistency}% Match
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
