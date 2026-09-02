'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { FileText, Download, Printer, ArrowLeft, Shield, Sparkles, CheckCircle2 } from 'lucide-react';
import TopNav from '@/components/layout/TopNav';
import RiskGauge from '@/components/ui/RiskGauge';
import StatusBadge from '@/components/ui/StatusBadge';
import ProgressBar from '@/components/ui/ProgressBar';
import { api } from '@/services/api';
import type { VerificationResult } from '@/types';
import { useLanguage } from '@/context/LanguageContext';

function ReportsContent() {
  const { t } = useLanguage();
  const searchParams = useSearchParams();
  const verificationId = searchParams.get('id');
  const [result, setResult] = useState<VerificationResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedId, setSelectedId] = useState(verificationId || '');

  const loadReport = async (id: string) => {
    if (!id) return;
    setLoading(true);
    try {
      const data = await api.getReport(id);
      setResult(data);
    } catch {
      setResult(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (verificationId) {
      loadReport(verificationId);
    }
  }, [verificationId]);

  const handleGenerateReport = () => {
    loadReport(selectedId);
  };

  const handleDownloadPDF = async () => {
    if (!result) return;
    await api.generatePDFReport(result.id);
    alert('PDF Dossier generated. In production, this compiles a cryptographically signed verification certificate.');
  };

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

  return (
    <>
      <TopNav
        title={t('nav.reports', 'Reports')}
        breadcrumbs={[{ label: 'Dashboard', href: '/' }, { label: 'Forensic Reports' }]}
      />

      <div className="flex-1 p-6 md:p-8 max-w-5xl mx-auto w-full space-y-6">
        {/* Search & Query Banner */}
        {!result && (
          <div
            className="p-8 rounded-3xl border shadow-lg space-y-6 fade-in-up"
            style={{
              background: 'var(--surface)',
              borderColor: 'var(--border-color)',
            }}
          >
            <div className="flex items-center gap-3">
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-md"
                style={{ background: 'var(--accent-light)', color: 'var(--accent)' }}
              >
                <FileText className="w-6 h-6" />
              </div>
              <div>
                <span className="editorial-label">Dossier Generator</span>
                <h3 className="text-xl font-bold mt-0.5" style={{ color: 'var(--text-primary)' }}>
                  Generate Comprehensive Verification Audit Dossier
                </h3>
              </div>
            </div>

            <p className="text-xs md:text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              Enter a verification audit ID to retrieve the complete evidentiary report, OCR transcript, and model risk breakdown.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 max-w-md">
              <input
                type="text"
                value={selectedId}
                onChange={(e) => setSelectedId(e.target.value)}
                placeholder="e.g. vrf-001 or vrf-005"
                className="input text-xs"
              />
              <button
                onClick={handleGenerateReport}
                disabled={!selectedId || loading}
                className="btn-primary text-xs py-2.5 px-5 font-bold flex-shrink-0"
              >
                {loading ? 'Compiling Dossier...' : 'Generate Report'}
              </button>
            </div>

            <div className="flex items-center gap-2 flex-wrap pt-2 border-t" style={{ borderColor: 'var(--border-subtle)' }}>
              <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
                Sample audits:
              </span>
              {['vrf-001', 'vrf-002', 'vrf-003', 'vrf-004', 'vrf-005'].map((id) => (
                <button
                  key={id}
                  onClick={() => {
                    setSelectedId(id);
                    loadReport(id);
                  }}
                  className="text-xs font-mono font-bold px-2.5 py-1 rounded-lg transition-colors hover:scale-105"
                  style={{ background: 'var(--accent-light)', color: 'var(--accent)' }}
                >
                  {id}
                </button>
              ))}
            </div>
          </div>
        )}

        {loading && (
          <div className="flex items-center justify-center py-20">
            <div
              className="w-10 h-10 rounded-full border-3 border-t-transparent animate-spin"
              style={{ borderColor: 'var(--accent)', borderTopColor: 'transparent' }}
            />
          </div>
        )}

        {result && !loading && (
          <div className="space-y-6 fade-in-up">
            {/* Action Bar */}
            <div className="flex items-center justify-between">
              <button onClick={() => setResult(null)} className="btn-ghost text-xs">
                <ArrowLeft className="w-4 h-4" />
                <span>Search Another Dossier</span>
              </button>
              <div className="flex items-center gap-2">
                <button onClick={handleDownloadPDF} className="btn-primary text-xs py-2 px-3.5 font-bold shadow-md">
                  <Download className="w-3.5 h-3.5" />
                  <span>Download PDF Dossier</span>
                </button>
                <button onClick={() => window.print()} className="btn-secondary text-xs py-2 px-3">
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print</span>
                </button>
              </div>
            </div>

            {/* Printable Report Document Card */}
            <div
              className="p-8 md:p-12 rounded-3xl border shadow-xl space-y-8"
              style={{
                background: 'var(--surface)',
                borderColor: 'var(--border-color)',
              }}
            >
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-6" style={{ borderColor: 'var(--border-subtle)' }}>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Shield className="w-5 h-5 text-[#C85A32]" />
                    <span className="text-base font-extrabold tracking-tight" style={{ color: 'var(--text-primary)' }}>
                      VERIDOC <span style={{ color: 'var(--accent)' }}>AI</span>
                    </span>
                  </div>
                  <h2 className="text-xl font-extrabold" style={{ color: 'var(--text-primary)' }}>
                    Identity Verification & Forensic Report
                  </h2>
                </div>
                <div className="text-left sm:text-right font-mono text-xs" style={{ color: 'var(--text-muted)' }}>
                  <p>Audit ID: <span className="font-bold text-[#C85A32]">{result.id}</span></p>
                  <p>Generated: {formatDate(new Date().toISOString())}</p>
                </div>
              </div>

              {/* Assessment Summary */}
              <div
                className="p-6 rounded-2xl border flex flex-col md:flex-row items-center gap-6"
                style={{
                  background: 'var(--gradient-warm-hero)',
                  borderColor: 'rgba(200, 90, 50, 0.25)',
                }}
              >
                <RiskGauge score={result.risk.overallScore} level={result.risk.riskLevel} size={120} showLabel={false} />
                <div className="flex-1 space-y-1 text-center md:text-left">
                  <div className="flex items-center gap-2 justify-center md:justify-start">
                    <span className="text-base font-extrabold" style={{ color: 'var(--text-primary)' }}>
                      Risk Assessment
                    </span>
                    <StatusBadge level={result.risk.riskLevel} size="sm" />
                  </div>
                  <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                    {result.risk.recommendation}
                  </p>
                </div>
              </div>

              {/* Document Metadata Grid */}
              <div className="space-y-3">
                <span className="editorial-label">Artifact Metadata</span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  {[
                    ['Document Format', result.document.type.replace(/_/g, ' ').toUpperCase()],
                    ['Source File', result.document.fileName],
                    ['Timestamp', formatDate(result.createdAt)],
                    ['Verification Status', result.status.toUpperCase()],
                  ].map(([label, value]) => (
                    <div key={label} className="p-3.5 rounded-xl border card-warm-subtle">
                      <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>{label}</span>
                      <p className="font-bold mt-1 truncate" style={{ color: 'var(--text-primary)' }}>{value}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Signal Weights Breakdown */}
              <div className="space-y-3">
                <span className="editorial-label">Evidentiary Weights</span>
                <div className="space-y-3">
                  {result.risk.signals.map((signal, i) => (
                    <ProgressBar
                      key={i}
                      value={signal.score}
                      label={signal.name}
                      showValue
                      color={
                        signal.status === 'low'
                          ? 'var(--risk-low)'
                          : signal.status === 'review'
                          ? 'var(--risk-review)'
                          : 'var(--risk-high)'
                      }
                    />
                  ))}
                </div>
              </div>

              {/* OCR Extraction */}
              {result.ocr && (
                <div className="space-y-3">
                  <span className="editorial-label">OCR Extracted Transcript</span>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs">
                    {result.ocr.fields.map((field, i) => (
                      <div key={i} className="p-3 rounded-xl border card-warm-subtle flex items-center justify-between">
                        <div>
                          <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>{field.fieldName}</span>
                          <p className="font-bold mt-0.5" style={{ color: 'var(--text-primary)' }}>{field.value}</p>
                        </div>
                        <span className="text-[10px] font-mono font-bold text-emerald-600 dark:text-emerald-400">
                          {Math.round(field.confidence * 100)}%
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* AI Summary */}
              <div className="p-5 rounded-2xl border card-warm-subtle space-y-1.5">
                <span className="editorial-label">Forensic Analysis Summary</span>
                <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                  {result.risk.aiExplanation}
                </p>
              </div>

              {/* Disclaimer */}
              <div className="border-t pt-4 text-center text-[10px]" style={{ borderColor: 'var(--border-subtle)', color: 'var(--text-muted)' }}>
                This verification audit was generated by VeriDoc AI Multi-Modal Engine. Assessments should be reviewed in accordance with organizational compliance protocols.
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default function ReportsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex-1 flex items-center justify-center min-h-[60vh]">
          <div
            className="w-10 h-10 rounded-full border-3 border-t-transparent animate-spin"
            style={{ borderColor: 'var(--accent)', borderTopColor: 'transparent' }}
          />
        </div>
      }
    >
      <ReportsContent />
    </Suspense>
  );
}
