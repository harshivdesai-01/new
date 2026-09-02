'use client';

import { CheckCircle, FileText, User, Database, ShieldCheck, ArrowRight, Loader2 } from 'lucide-react';
import type { DocumentType, ReferenceRecord } from '@/types';

interface ReviewStepProps {
  documentType: DocumentType | null;
  documentFile: File | null;
  selfieFile: File | null;
  referenceRecord: ReferenceRecord | null;
  onAnalyze: () => void;
  isAnalyzing: boolean;
}

const typeLabels: Record<DocumentType, string> = {
  passport: 'International Passport',
  gov_id: 'National Identity Card',
  driving_license: 'Driver’s License',
  other: 'Other Identity Document',
};

export default function ReviewStep({
  documentType,
  documentFile,
  selfieFile,
  referenceRecord,
  onAnalyze,
  isAnalyzing,
}: ReviewStepProps) {
  const items = [
    {
      icon: FileText,
      label: 'Document Type',
      value: documentType ? typeLabels[documentType] : 'Not selected',
      ready: !!documentType,
    },
    {
      icon: FileText,
      label: 'Document Scan',
      value: documentFile ? documentFile.name : 'Not uploaded',
      ready: !!documentFile,
    },
    {
      icon: User,
      label: 'Applicant Selfie',
      value: selfieFile ? selfieFile.name : 'Not uploaded',
      ready: !!selfieFile,
    },
    {
      icon: Database,
      label: 'Authority Reference Check',
      value: referenceRecord ? `Verified: ${referenceRecord.fullName}` : 'Not queried (Optional)',
      ready: true,
    },
  ];

  const allRequired = !!documentType && !!documentFile && !!selfieFile;

  return (
    <div className="space-y-4">
      <div>
        <span className="editorial-label">Step 05</span>
        <h3 className="text-xl font-bold mt-1" style={{ color: 'var(--text-primary)' }}>
          Review Submission & Initiate Analysis
        </h3>
        <p className="text-xs md:text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
          Confirm your uploaded artifacts. Initiating analysis will run multi-modal OCR, tampering localization, and facial similarity verification.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
        {items.map((item, i) => {
          const Icon = item.icon;
          return (
            <div
              key={i}
              className="glass-card-static p-4 flex items-start gap-3.5"
            >
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5"
                style={{
                  background: item.ready ? 'var(--risk-low-bg)' : 'rgba(200, 90, 50, 0.1)',
                  color: item.ready ? 'var(--risk-low)' : 'var(--accent)',
                }}
              >
                <Icon className="w-4.5 h-4.5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[11px] font-semibold" style={{ color: 'var(--text-muted)' }}>
                  {item.label}
                </p>
                <p className="text-xs font-bold truncate mt-0.5" style={{ color: 'var(--text-primary)' }}>
                  {item.value}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* 8-Stage Pipeline Notice */}
      <div
        className="p-4 rounded-xl border space-y-1.5"
        style={{
          background: 'var(--surface-warm)',
          borderColor: 'rgba(200, 90, 50, 0.2)',
        }}
      >
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4" style={{ color: 'var(--accent)' }} />
          <span className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--accent)' }}>
            8-Stage Multi-Modal Pipeline Ready
          </span>
        </div>
        <p className="text-[11px] leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
          Preprocessing → OCR Parsing → Schema Validation → Tampering Localization → Face Extraction → 1:1 Biometric Comparison → Authority Cross-Check → Risk Fusion.
        </p>
      </div>

      {/* Analyze CTA */}
      <div className="pt-2">
        <button
          onClick={onAnalyze}
          disabled={!allRequired || isAnalyzing}
          className="btn-primary w-full justify-center py-3.5 text-sm font-bold shadow-lg"
          style={{ opacity: allRequired ? 1 : 0.5 }}
        >
          {isAnalyzing ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Starting ML Pipeline...</span>
            </>
          ) : (
            <>
              <ShieldCheck className="w-5 h-5" />
              <span>Analyze & Verify Document</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </>
          )}
        </button>

        {!allRequired && (
          <p className="text-xs text-center mt-2 font-medium" style={{ color: 'var(--risk-review)' }}>
            Please select document type, document scan, and selfie photo to proceed.
          </p>
        )}
      </div>
    </div>
  );
}
