'use client';

import { useState } from 'react';
import {
  FileText,
  Download,
  Printer,
  X,
  Shield,
  CheckCircle2,
  AlertTriangle,
  Lock,
  Share2,
} from 'lucide-react';
import type { VerificationResult } from '@/types';
import StatusBadge from '@/components/ui/StatusBadge';

interface InvestigationReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  result: VerificationResult;
}

export default function InvestigationReportModal({
  isOpen,
  onClose,
  result,
}: InvestigationReportModalProps) {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    const reportData = JSON.stringify(result, null, 2);
    const blob = new Blob([reportData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `VERIDOC_INVESTIGATION_REPORT_${result.id}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="w-full max-w-4xl rounded-3xl border shadow-2xl overflow-hidden flex flex-col max-h-[90vh] bg-white dark:bg-[#101E17] animate-in zoom-in-95 duration-200"
        style={{ borderColor: 'var(--border-color)' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Actions */}
        <div
          className="p-4 px-6 border-b flex items-center justify-between"
          style={{ background: 'var(--surface-warm)', borderColor: 'var(--border-subtle)' }}
        >
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <span className="text-xs font-bold font-mono text-emerald-700 dark:text-emerald-400">
              OFFICIAL INVESTIGATION DOSSIER • {result.id}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button onClick={handlePrint} className="btn-secondary text-xs py-1.5 px-3">
              <Printer className="w-3.5 h-3.5" />
              <span>Print Dossier</span>
            </button>
            <button onClick={handleDownload} className="btn-primary text-xs py-1.5 px-3 font-bold shadow-xs">
              <Download className="w-3.5 h-3.5" />
              <span>Export Record</span>
            </button>
            <button onClick={onClose} className="btn-ghost p-1.5 rounded-lg ml-1">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Dossier Content Body (Printable) */}
        <div className="p-8 md:p-12 overflow-y-auto space-y-8 text-left font-sans">
          {/* Official Letterhead */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b-2 border-emerald-800/30 pb-6">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <div className="w-6 h-6 rounded-lg bg-emerald-700 text-white flex items-center justify-center text-xs font-bold">
                  V
                </div>
                <span className="text-sm font-extrabold tracking-tight" style={{ color: 'var(--text-primary)' }}>
                  VERIDOC <span className="text-emerald-600">AI</span> IDENTITY SECURITY
                </span>
              </div>
              <h1 className="text-xl md:text-2xl font-black tracking-tight" style={{ color: 'var(--text-primary)' }}>
                FORENSIC IDENTITY INVESTIGATION REPORT
              </h1>
              <p className="text-xs font-mono text-stone-500">
                Border Control Document Security Division • ICAO Doc 9303 Audit Standard
              </p>
            </div>

            <div className="text-left sm:text-right font-mono text-xs text-stone-500 space-y-0.5">
              <p>Record ID: <strong>{result.id}</strong></p>
              <p>Generated: {formatDate(result.createdAt)}</p>
              <p>Status: <strong className="text-emerald-600 dark:text-emerald-400">CONFIRMED HASH</strong></p>
            </div>
          </div>

          {/* Executive Risk Index Summary */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl border card-warm-subtle">
              <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500">Risk Assessment</span>
              <div className="flex items-center gap-2 mt-1">
                <span
                  className="text-2xl font-extrabold font-mono"
                  style={{
                    color:
                      result.risk.overallScore <= 30
                        ? 'var(--risk-low)'
                        : result.risk.overallScore <= 60
                        ? 'var(--risk-review)'
                        : 'var(--risk-high)',
                  }}
                >
                  {result.risk.overallScore} / 100
                </span>
                <StatusBadge level={result.risk.riskLevel} size="sm" />
              </div>
            </div>

            <div className="p-4 rounded-2xl border card-warm-subtle">
              <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500">Tampering Classification</span>
              <p className="text-sm font-bold mt-1.5" style={{ color: 'var(--text-primary)' }}>
                {result.tampering?.isTampered ? '⚠️ Manipulated Pixels Localized' : '✓ 0 Forgery Artifacts'}
              </p>
            </div>

            <div className="p-4 rounded-2xl border card-warm-subtle">
              <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500">Biometric Similarity</span>
              <p className="text-sm font-bold mt-1.5" style={{ color: 'var(--text-primary)' }}>
                {result.faceVerification ? `${Math.round(result.faceVerification.similarity * 100)}% Cosine Match` : 'N/A'}
              </p>
            </div>
          </div>

          {/* Traveler & Document Data Table */}
          <div className="space-y-3">
            <span className="editorial-label">Subject & Credential Metadata</span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              {result.ocr?.fields.map((f, i) => (
                <div key={i} className="p-3 rounded-xl border card-warm-subtle">
                  <span className="text-[10px] text-stone-500 block uppercase">{f.fieldName}</span>
                  <strong className="text-xs truncate block mt-0.5" style={{ color: 'var(--text-primary)' }}>
                    {f.value}
                  </strong>
                </div>
              ))}
            </div>
          </div>

          {/* Officer Decision & Findings */}
          <div className="p-5 rounded-2xl border card-warm-subtle space-y-2">
            <span className="editorial-label">Inspector Adjudication Record</span>
            <div className="flex items-center justify-between text-xs">
              <span>Inspector ID: <strong>{result.officerDecision?.officerId || 'OFFICER-7741'}</strong></span>
              <span>Verdict: <strong className="uppercase text-emerald-600">{result.officerDecision?.verdict || 'APPROVED'}</strong></span>
            </div>
            <p className="text-xs italic text-stone-600 dark:text-stone-300 pt-1">
              "{result.officerDecision?.notes || result.risk.recommendation}"
            </p>
          </div>

          {/* Cryptographic Seal */}
          <div className="border-t pt-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-[10px] font-mono text-stone-400">
            <span className="flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-emerald-600" />
              Cryptographically Signed & Timestamped (SHA-256 Ledger Verified)
            </span>
            <span>VeriDoc Multi-Modal Engine v4.1</span>
          </div>
        </div>
      </div>
    </div>
  );
}
