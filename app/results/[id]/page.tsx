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
  ZoomIn,
  Flame,
  Clock,
  UserCheck,
  Sparkles,
  Columns,
  Network,
  ShieldCheck,
  X,
} from 'lucide-react';
import TopNav from '@/components/layout/TopNav';
import RiskScoreHeader from '@/components/results/RiskScoreHeader';
import RiskBreakdown from '@/components/results/RiskBreakdown';
import OCRResults from '@/components/results/OCRResults';
import ValidationChecks from '@/components/results/ValidationChecks';
import FaceVerification from '@/components/results/FaceVerification';
import FlagExplanation from '@/components/results/FlagExplanation';

// Forensic Feature Components
import ReviewDesk from '@/components/forensics/ReviewDesk';
import ForensicMagnifier from '@/components/forensics/ForensicMagnifier';
import SuspicionHeatmap from '@/components/forensics/SuspicionHeatmap';
import AuthenticityTimeline from '@/components/forensics/AuthenticityTimeline';
import RiskContributorBars from '@/components/forensics/RiskContributorBars';
import OfficerDecisionCenter from '@/components/forensics/OfficerDecisionCenter';
import InvestigationReportModal from '@/components/forensics/InvestigationReportModal';
import DocumentCompare from '@/components/forensics/DocumentCompare';
import FraudNetwork from '@/components/forensics/FraudNetwork';
import PublicVerificationBadge from '@/components/verify/PublicVerificationBadge';

import { api } from '@/services/api';
import type { VerificationResult, DocumentComparisonPair } from '@/types';
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
  const [activeViewMode, setActiveViewMode] = useState<
    'summary' | 'desk' | 'magnifier' | 'heatmap' | 'timeline' | 'compare' | 'fraud_network'
  >('summary');
  const [showReportModal, setShowReportModal] = useState(false);
  const [showBadgeModal, setShowBadgeModal] = useState(false);
  const [comparisonPair, setComparisonPair] = useState<DocumentComparisonPair | null>(null);

  useEffect(() => {
    Promise.all([
      api.getVerification(id),
      api.getDocumentComparison('cmp-001'),
    ])
      .then(([res, comp]) => {
        setResult(res);
        setComparisonPair(comp);
      })
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

      <div className="flex-1 p-6 md:p-8 max-w-6xl mx-auto w-full space-y-6">
        {/* Action Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <button
            onClick={() => router.push('/history')}
            className="btn-ghost text-xs self-start"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Audit Log</span>
          </button>

          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs mr-2 font-mono" style={{ color: 'var(--text-muted)' }}>
              {formatDate(result.createdAt)}
            </span>
            <button
              onClick={() => setShowBadgeModal(true)}
              className="btn-secondary text-xs py-2 px-3"
              title="Generate Public Verification Badge"
            >
              <ShieldCheck className="w-3.5 h-3.5" style={{ color: 'var(--accent)' }} />
              <span>Public Badge</span>
            </button>
            <button
              onClick={() => router.push(`/traveler-profile?id=${result.travelerProfileId || 'TRV-88210'}`)}
              className="btn-secondary text-xs py-2 px-3"
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>Traveler Profile</span>
            </button>
            <button
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                alert('Secure verification report link copied to clipboard.');
              }}
              className="btn-secondary text-xs py-2 px-3"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Share</span>
            </button>
            <button
              onClick={() => setShowReportModal(true)}
              className="btn-primary text-xs py-2 px-4 font-bold shadow-xs"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Generate Dossier</span>
            </button>
          </div>
        </div>

        {/* ─── Hero Risk Assessment Header ─── */}
        <RiskScoreHeader
          score={result.risk.overallScore}
          level={result.risk.riskLevel}
          recommendation={result.risk.recommendation}
        />

        {/* ─── Forensic Mode Navigation Switcher ─── */}
        <div className="flex p-1.5 rounded-2xl card-warm-subtle overflow-x-auto gap-1 text-xs font-bold">
          {[
            { id: 'summary' as const, label: 'Overview & Findings', icon: Sparkles },
            { id: 'heatmap' as const, label: 'Tamper Heatmap', icon: Flame },
            { id: 'fraud_network' as const, label: 'Fraud Network', icon: Network },
            { id: 'desk' as const, label: 'Review Desk', icon: Layers },
            { id: 'magnifier' as const, label: 'Forensic Loupe', icon: ZoomIn },
            { id: 'timeline' as const, label: 'Authenticity Timeline', icon: Clock },
            { id: 'compare' as const, label: 'Document Compare', icon: Columns },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeViewMode === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveViewMode(tab.id)}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl transition-all whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'bg-[var(--accent)] text-white shadow-xs'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface)]'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* ─── MODE 1: Overview & Summary ─── */}
        {activeViewMode === 'summary' && (
          <div className="space-y-6 fade-in-up">
            {/* AI Risk Contributor Breakdown Panel */}
            <RiskContributorBars risk={result.risk} />

            {/* Flagged Anomalies & Evidence */}
            {result.flags && result.flags.length > 0 && (
              <FlagExplanation flags={result.flags} />
            )}

            {/* Two Column Layout: Risk Breakdown & Biometrics */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <RiskBreakdown signals={result.risk.signals} />
              {result.faceVerification && <FaceVerification data={result.faceVerification} />}
            </div>

            {/* Validation Checks */}
            {result.validation && <ValidationChecks validation={result.validation} />}

            {/* OCR Extracted Fields */}
            {result.ocr && <OCRResults ocr={result.ocr} />}

            {/* Officer Decision Center */}
            <OfficerDecisionCenter
              verificationId={result.id}
              currentDecision={result.officerDecision}
              aiRiskLevel={result.risk.riskLevel}
              onDecisionSaved={(d) => setResult((prev) => (prev ? { ...prev, officerDecision: d } : prev))}
            />
          </div>
        )}

        {/* ─── MODE: Visual Tamper Heatmap ─── */}
        {activeViewMode === 'heatmap' && (
          <div className="fade-in-up">
            <SuspicionHeatmap
              documentName={result.document.fileName}
              regions={result.tampering?.regions || []}
            />
          </div>
        )}

        {/* ─── MODE: Fraud Ring Detection (Fraud Network) ─── */}
        {activeViewMode === 'fraud_network' && (
          <div className="fade-in-up">
            <FraudNetwork />
          </div>
        )}

        {/* ─── MODE 2: Split-Screen Review Desk ─── */}
        {activeViewMode === 'desk' && (
          <div className="fade-in-up">
            <ReviewDesk result={result} />
          </div>
        )}

        {/* ─── MODE 3: Forensic Magnifier / Loupe ─── */}
        {activeViewMode === 'magnifier' && (
          <div className="fade-in-up space-y-4">
            <ForensicMagnifier
              documentTitle={result.document.fileName}
              regions={result.tampering?.regions || []}
            />
          </div>
        )}

        {/* ─── MODE 5: Authenticity Timeline ─── */}
        {activeViewMode === 'timeline' && (
          <div className="fade-in-up">
            <AuthenticityTimeline events={result.timeline || []} />
          </div>
        )}

        {/* ─── MODE 6: Document Compare ─── */}
        {activeViewMode === 'compare' && comparisonPair && (
          <div className="fade-in-up">
            <DocumentCompare pair={comparisonPair} />
          </div>
        )}
      </div>

      {/* Public Verification Badge Modal */}
      {showBadgeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div
            className="relative w-full max-w-lg rounded-3xl border p-6 md:p-8 space-y-4 shadow-xl fade-in-up"
            style={{
              background: 'var(--surface)',
              borderColor: 'var(--border-color)',
            }}
          >
            <button
              onClick={() => setShowBadgeModal(false)}
              className="absolute top-5 right-5 p-2 rounded-full hover:bg-[var(--surface-warm)] text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            <PublicVerificationBadge result={result} onClose={() => setShowBadgeModal(false)} />
          </div>
        </div>
      )}

      {/* Investigation Report Modal (Dossier Generator) */}
      <InvestigationReportModal
        isOpen={showReportModal}
        onClose={() => setShowReportModal(false)}
        result={result}
      />
    </>
  );
}
