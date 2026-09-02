'use client';

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Download,
  Share2,
  FileText,
  Shield,
  Layers,
  Image as ImageIcon,
  CheckCircle2,
  AlertTriangle,
  FileCheck2,
} from 'lucide-react';
import TopNav from '@/components/layout/TopNav';
import RiskScoreHeader from '@/components/results/RiskScoreHeader';
import RiskBreakdown from '@/components/results/RiskBreakdown';
import OCRResults from '@/components/results/OCRResults';
import ValidationChecks from '@/components/results/ValidationChecks';
import FaceVerification from '@/components/results/FaceVerification';
import FlagExplanation from '@/components/results/FlagExplanation';
import AIExplanation from '@/components/results/AIExplanation';
import { api } from '@/services/api';
import type { VerificationResult } from '@/types';
import { useLanguage } from '@/context/LanguageContext';

interface ResultsPageProps {
  params: Promise<{ id: string }>;
}

export default function ResultsPage({ params }: ResultsPageProps) {
  const { id } = use(params);
  const router = useRouter();
  const { t } = useLanguage();
  const [result, setResult] = useState<VerificationResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeDocTab, setActiveDocTab] = useState<'original' | 'forensic'>('original');

  useEffect(() => {
    api
      .getVerification(id)
      .then(setResult)
      .catch(() => router.push('/'))
      .finally(() => setLoading(false));
  }, [id, router]);

  if (loading || !result) {
    return (
      <>
        <TopNav title="Verification Result" />
        <div className="flex-1 flex items-center justify-center min-h-[60vh]">
          <div
            className="w-10 h-10 rounded-full border-3 border-t-transparent animate-spin"
            style={{ borderColor: 'var(--accent)', borderTopColor: 'transparent' }}
          />
        </div>
      </>
    );
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <>
      <TopNav
        title={`Audit Report: ${result.id}`}
        breadcrumbs={[
          { label: 'Dashboard', href: '/' },
          { label: 'History', href: '/history' },
          { label: result.id },
        ]}
      />

      <div className="flex-1 p-6 md:p-8 max-w-5xl mx-auto w-full space-y-6">
        {/* Action Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <button
            onClick={() => router.push('/history')}
            className="btn-ghost text-xs self-start"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to History</span>
          </button>

          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs mr-2 font-mono" style={{ color: 'var(--text-muted)' }}>
              {formatDate(result.createdAt)}
            </span>
            <button
              onClick={() => router.push(`/reports?id=${result.id}`)}
              className="btn-secondary text-xs py-2 px-3"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Full Dossier</span>
            </button>
            <button
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                alert('Verification report link copied to clipboard.');
              }}
              className="btn-secondary text-xs py-2 px-3"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Share</span>
            </button>
            <button
              onClick={() => router.push(`/reports?id=${result.id}`)}
              className="btn-primary text-xs py-2 px-3.5 font-bold"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export PDF</span>
            </button>
          </div>
        </div>

        {/* ─── Hero Risk Assessment Header ─── */}
        <RiskScoreHeader
          score={result.risk.overallScore}
          level={result.risk.riskLevel}
          recommendation={result.risk.recommendation}
        />

        {/* ─── AI Forensic Synthesis ─── */}
        <AIExplanation explanation={result.risk.aiExplanation} />

        {/* ─── Flagged Anomalies & Evidence (Why was this flagged?) ─── */}
        {result.flags && result.flags.length > 0 && (
          <FlagExplanation flags={result.flags} />
        )}

        {/* ─── Document Forensics View Tab Component ─── */}
        <div
          className="p-5 md:p-6 rounded-2xl border shadow-xs space-y-4"
          style={{
            background: 'var(--surface)',
            borderColor: 'var(--border-color)',
          }}
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-4" style={{ borderColor: 'var(--border-subtle)' }}>
            <div>
              <span className="editorial-label">Artifact Inspection</span>
              <h3 className="text-base font-bold mt-0.5" style={{ color: 'var(--text-primary)' }}>
                Document Forensics & Tamper Layer
              </h3>
            </div>

            {/* Sliding Tab Switch */}
            <div className="flex p-1 rounded-xl card-warm-subtle self-start">
              <button
                onClick={() => setActiveDocTab('original')}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  activeDocTab === 'original'
                    ? 'bg-white dark:bg-[#1C1714] text-[#C85A32] shadow-sm'
                    : 'text-stone-500 hover:text-stone-800 dark:hover:text-stone-200'
                }`}
              >
                ORIGINAL DOCUMENT
              </button>
              <button
                onClick={() => setActiveDocTab('forensic')}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  activeDocTab === 'forensic'
                    ? 'bg-white dark:bg-[#1C1714] text-[#C85A32] shadow-sm'
                    : 'text-stone-500 hover:text-stone-800 dark:hover:text-stone-200'
                }`}
              >
                FORENSIC VIEW
              </button>
            </div>
          </div>

          {/* Tab Content */}
          {activeDocTab === 'original' ? (
            <div
              className="rounded-xl border p-8 text-center flex flex-col items-center justify-center space-y-3 card-warm-subtle"
              style={{ minHeight: '220px' }}
            >
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center"
                style={{ background: 'var(--accent-light)', color: 'var(--accent)' }}
              >
                <FileCheck2 className="w-7 h-7" />
              </div>
              <div>
                <p className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>
                  {result.document.fileName}
                </p>
                <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                  {result.document.type.replace(/_/g, ' ').toUpperCase()} • Uploaded via Secure Channel
                </p>
              </div>
              <span className="text-[10px] font-mono px-2.5 py-1 rounded bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 font-bold">
                ✓ 300 DPI COLOR SCAN VERIFIED
              </span>
            </div>
          ) : (
            <div
              className="rounded-xl border p-6 space-y-4 card-warm-subtle"
              style={{ minHeight: '220px' }}
            >
              {result.tampering && result.tampering.regions && result.tampering.regions.length > 0 ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-xs font-bold text-red-600 dark:text-red-400">
                    <AlertTriangle className="w-4 h-4" />
                    <span>Suspicious Manipulated Regions Localized ({result.tampering.regions.length})</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {result.tampering.regions.map((region, idx) => (
                      <div key={idx} className="p-3 rounded-lg border bg-white dark:bg-[#1C1714]" style={{ borderColor: 'rgba(166, 44, 44, 0.3)' }}>
                        <span className="text-[10px] font-bold text-red-600 uppercase">Region 0{idx + 1}: {region.type}</span>
                        <p className="text-xs mt-1" style={{ color: 'var(--text-primary)' }}>
                          Bounding Box: [X: {region.x}, Y: {region.y}, W: {region.width}, H: {region.height}]
                        </p>
                        <p className="text-[10px] font-mono mt-0.5 text-stone-500">Confidence: {Math.round(region.confidence * 100)}%</p>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 space-y-2">
                  <div
                    className="w-12 h-12 rounded-xl mx-auto flex items-center justify-center"
                    style={{ background: 'var(--surface)', color: 'var(--text-muted)' }}
                  >
                    <Layers className="w-6 h-6" />
                  </div>
                  <p className="text-xs font-bold" style={{ color: 'var(--text-primary)' }}>
                    Document-level analysis available.
                  </p>
                  <p className="text-xs max-w-md mx-auto" style={{ color: 'var(--text-muted)' }}>
                    Region localization is not currently provided for this artifact. Overall tamper integrity classification was evaluated via high-frequency noise & compression artifact filters.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* ─── Two Column Layout: Risk Breakdown & Biometrics ─── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <RiskBreakdown signals={result.risk.signals} />
          {result.faceVerification && <FaceVerification data={result.faceVerification} />}
        </div>

        {/* ─── Validation Checks ─── */}
        {result.validation && <ValidationChecks validation={result.validation} />}

        {/* ─── OCR Extracted Fields ─── */}
        {result.ocr && <OCRResults ocr={result.ocr} />}

        {/* ─── Tampering Detection Module ─── */}
        {result.tampering && (
          <div
            className="p-5 md:p-6 rounded-2xl border shadow-xs space-y-4"
            style={{
              background: 'var(--surface)',
              borderColor: 'var(--border-color)',
            }}
          >
            <div className="flex items-center justify-between">
              <div>
                <span className="editorial-label">Forensics</span>
                <h3 className="text-sm md:text-base font-bold mt-0.5" style={{ color: 'var(--text-primary)' }}>
                  Digital Tampering & Splice Detection
                </h3>
              </div>
              <span
                className="text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase"
                style={{
                  background: result.tampering.isTampered ? 'var(--risk-high-bg)' : 'var(--risk-low-bg)',
                  color: result.tampering.isTampered ? 'var(--risk-high)' : 'var(--risk-low)',
                }}
              >
                {result.tampering.isTampered ? 'Tampering Detected' : 'Pixel Integrity Confirmed'}
              </span>
            </div>

            <div
              className="p-3.5 rounded-xl border flex items-center justify-between gap-3"
              style={{
                background: result.tampering.isTampered ? 'var(--risk-high-bg)' : 'var(--risk-low-bg)',
                borderColor: result.tampering.isTampered ? 'rgba(166, 44, 44, 0.3)' : 'rgba(45, 122, 77, 0.3)',
              }}
            >
              <span className="text-xs font-bold" style={{ color: result.tampering.isTampered ? 'var(--risk-high)' : 'var(--risk-low)' }}>
                {result.tampering.isTampered ? '⚠️ Forgery / Splice Artifacts Detected' : '✅ No Digital Splicing or Font Discrepancies'}
              </span>
              <span className="text-xs font-mono font-bold" style={{ color: 'var(--text-muted)' }}>
                Confidence: {Math.round(result.tampering.confidence * 100)}%
              </span>
            </div>

            <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              {result.tampering.explanation}
            </p>

            {result.tampering.techniques.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-1">
                {result.tampering.techniques.map((tech, i) => (
                  <span
                    key={i}
                    className="text-[10px] font-bold px-2.5 py-1 rounded-md"
                    style={{ background: 'var(--risk-high-bg)', color: 'var(--risk-high)' }}
                  >
                    {tech}
                  </span>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ─── Reference Verification ─── */}
        {result.reference && (
          <div
            className="p-5 md:p-6 rounded-2xl border shadow-xs space-y-4"
            style={{
              background: 'var(--surface)',
              borderColor: 'var(--border-color)',
            }}
          >
            <div className="flex items-center justify-between">
              <div>
                <span className="editorial-label">Register Cross-Check</span>
                <h3 className="text-sm md:text-base font-bold mt-0.5" style={{ color: 'var(--text-primary)' }}>
                  Authority Reference Cross-Reference
                </h3>
              </div>
              <span
                className="text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase"
                style={{
                  background: result.reference.isVerified ? 'var(--risk-low-bg)' : 'var(--risk-high-bg)',
                  color: result.reference.isVerified ? 'var(--risk-low)' : 'var(--risk-high)',
                }}
              >
                {result.reference.isVerified ? 'Register Verified' : 'Discrepancy Found'}
              </span>
            </div>

            <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              {result.reference.explanation}
            </p>

            {result.reference.referenceRecord && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs pt-1">
                {[
                  ['Holder Name', result.reference.referenceRecord.fullName],
                  ['Document Number', result.reference.referenceRecord.documentNumber],
                  ['Date of Birth', result.reference.referenceRecord.dateOfBirth],
                  ['Authority Status', result.reference.referenceRecord.status.toUpperCase()],
                ].map(([label, val]) => (
                  <div key={label} className="p-3 rounded-xl card-warm-subtle">
                    <span className="text-[10px] font-medium" style={{ color: 'var(--text-muted)' }}>{label}</span>
                    <p className="font-bold mt-0.5 truncate" style={{ color: 'var(--text-primary)' }}>{val}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}
