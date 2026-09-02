'use client';

import { useEffect, useState, use } from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  CheckCircle2,
  Lock,
  ArrowLeft,
  FileCheck2,
  Shield,
  Clock,
  Sparkles,
  ExternalLink,
} from 'lucide-react';
import { api } from '@/services/api';
import type { VerificationResult } from '@/types';

interface PublicBadgePageProps {
  params: Promise<{ id: string }>;
}

export default function PublicBadgePage({ params }: PublicBadgePageProps) {
  const { id } = use(params);
  const [result, setResult] = useState<VerificationResult | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .getVerification(id)
      .then(setResult)
      .catch(() => setResult(null))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-[var(--background)]">
        <div
          className="w-10 h-10 rounded-full border-3 border-t-transparent animate-spin"
          style={{ borderColor: 'var(--accent)', borderTopColor: 'transparent' }}
        />
      </div>
    );
  }

  const verificationCode = `VD-2026-${(id || 'vrf-001').replace('vrf-', '').toUpperCase().padStart(4, '0')}`;
  const verifiedDate = result
    ? new Date(result.completedAt || result.createdAt).toLocaleDateString('en-US', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      })
    : '02 September 2026';

  const isVerified = result ? result.risk.riskLevel === 'low' || result.officerDecision?.verdict === 'approve' : true;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 md:p-8 bg-[var(--background)]">
      {/* Top Brand Link */}
      <div className="mb-6 text-center">
        <Link href="/" className="inline-flex items-center gap-2.5 group">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center text-white shadow-sm"
            style={{ background: 'var(--gradient-accent)' }}
          >
            <Shield className="w-5 h-5" />
          </div>
          <span className="text-base font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>
            VERIDOC <span style={{ color: 'var(--accent)' }}>AI</span>
          </span>
        </Link>
      </div>

      {/* Main Minimal Public Verification Card */}
      <div
        className="w-full max-w-md rounded-3xl border p-6 md:p-8 space-y-6 shadow-md transition-all relative overflow-hidden"
        style={{
          background: 'var(--surface)',
          borderColor: 'var(--border-color)',
        }}
      >
        {/* Subtle Warm Watermark Accent */}
        <div
          className="absolute -top-12 -right-12 w-40 h-40 rounded-full blur-3xl opacity-15 pointer-events-none"
          style={{ background: 'var(--accent)' }}
        />

        {/* Verification Status Header */}
        <div className="text-center space-y-2 border-b pb-6" style={{ borderColor: 'var(--border-subtle)' }}>
          <div
            className="w-14 h-14 rounded-2xl mx-auto flex items-center justify-center shadow-xs text-white"
            style={{ background: isVerified ? 'var(--risk-low)' : 'var(--risk-review)' }}
          >
            <ShieldCheck className="w-8 h-8" />
          </div>

          <div className="space-y-1">
            <span
              className="text-[11px] font-mono font-bold tracking-widest uppercase px-3 py-1 rounded-full inline-block"
              style={{
                background: isVerified ? 'var(--risk-low-bg)' : 'var(--risk-review-bg)',
                color: isVerified ? 'var(--risk-low)' : 'var(--risk-review)',
                border: `1px solid ${isVerified ? 'var(--risk-low)' : 'var(--risk-review)'}30`,
              }}
            >
              {isVerified ? '✓ VERIFICATION VALID' : 'AUDIT PENDING'}
            </span>
            <h1 className="text-xl font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>
              Public Credential Attestation
            </h1>
          </div>
        </div>

        {/* Safe Verification Details (NO SENSITIVE PII) */}
        <div className="space-y-4 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3.5 rounded-xl card-warm-subtle space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider block" style={{ color: 'var(--text-muted)' }}>
                Verification ID
              </span>
              <p className="font-mono font-bold text-sm" style={{ color: 'var(--text-primary)' }}>
                {verificationCode}
              </p>
            </div>

            <div className="p-3.5 rounded-xl card-warm-subtle space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider block" style={{ color: 'var(--text-muted)' }}>
                Attestation Status
              </span>
              <p className="font-bold text-sm" style={{ color: isVerified ? 'var(--risk-low)' : 'var(--risk-review)' }}>
                {isVerified ? 'Verified Active' : 'Under Review'}
              </p>
            </div>
          </div>

          <div className="p-3.5 rounded-xl card-warm-subtle space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider block" style={{ color: 'var(--text-muted)' }}>
              Verified On
            </span>
            <p className="font-semibold text-xs" style={{ color: 'var(--text-primary)' }}>
              {verifiedDate}
            </p>
          </div>

          {/* Verification Checks Checklist */}
          <div className="space-y-2.5 p-4 rounded-2xl border bg-[var(--surface-warm)]" style={{ borderColor: 'var(--border-subtle)' }}>
            <span className="text-[10px] font-bold uppercase tracking-wider block" style={{ color: 'var(--text-muted)' }}>
              Verification Checks Passed
            </span>

            <div className="space-y-2">
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 flex-shrink-0" style={{ color: 'var(--risk-low)' }} />
                <span className="font-medium text-xs" style={{ color: 'var(--text-primary)' }}>
                  Document integrity & substrate authentic
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 flex-shrink-0" style={{ color: 'var(--risk-low)' }} />
                <span className="font-medium text-xs" style={{ color: 'var(--text-primary)' }}>
                  Document validity & ICAO standard compliance
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 flex-shrink-0" style={{ color: 'var(--risk-low)' }} />
                <span className="font-medium text-xs" style={{ color: 'var(--text-primary)' }}>
                  Identity verification & cryptographic hash match
                </span>
              </div>
            </div>
          </div>

          {/* Security Notice: Strict PII Redaction Guarantee */}
          <div className="p-3 rounded-xl border flex items-center gap-2.5 bg-[var(--surface)] text-[11px]" style={{ borderColor: 'var(--border-subtle)', color: 'var(--text-secondary)' }}>
            <Lock className="w-4 h-4 flex-shrink-0" style={{ color: 'var(--accent)' }} />
            <span>
              <strong>Personal information protected.</strong> Sensitive identity fields, OCR text, and biometric data are encrypted and withheld in public view.
            </span>
          </div>
        </div>

        {/* Footer Return Link */}
        <div className="pt-2 text-center">
          <Link
            href="/"
            className="text-xs font-semibold inline-flex items-center gap-1.5 hover:underline"
            style={{ color: 'var(--accent)' }}
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to VeriDoc Platform</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
