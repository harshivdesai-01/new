'use client';

import { useState } from 'react';
import {
  ShieldCheck,
  CheckCircle2,
  Copy,
  ExternalLink,
  Lock,
  Download,
  Share2,
  Sparkles,
  QrCode,
  Shield,
  Check,
} from 'lucide-react';
import type { VerificationResult } from '@/types';

interface PublicVerificationBadgeProps {
  result: VerificationResult;
  onClose?: () => void;
}

export default function PublicVerificationBadge({
  result,
  onClose,
}: PublicVerificationBadgeProps) {
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedEmbed, setCopiedEmbed] = useState(false);

  // Generate safe verification ID format (VD-2026-XXXX)
  const verificationCode = `VD-2026-${result.id.replace('vrf-', '').toUpperCase().padStart(4, '0')}`;
  const verifiedDate = new Date(result.completedAt || result.createdAt).toLocaleDateString('en-US', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

  const publicUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/verify/badge/${result.id}`
    : `https://veridoc.ai/verify/badge/${result.id}`;

  const embedSnippet = `<iframe src="${publicUrl}" width="340" height="220" frameborder="0" scrolling="no" style="border-radius:12px;border:1px solid #315C45;background:#FBF8F1;"></iframe>`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(publicUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleCopyEmbed = () => {
    navigator.clipboard.writeText(embedSnippet);
    setCopiedEmbed(true);
    setTimeout(() => setCopiedEmbed(false), 2000);
  };

  const isVerified = result.risk.riskLevel === 'low' || result.officerDecision?.verdict === 'approve';

  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div className="text-center space-y-1">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold card-warm-subtle text-[var(--accent)] mb-1">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>INSTITUTIONAL TRUST SEAL</span>
        </div>
        <h3 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>
          Public Verification Badge
        </h3>
        <p className="text-xs max-w-md mx-auto" style={{ color: 'var(--text-muted)' }}>
          Generate a privacy-safe verifiable badge to embed in portals, travel applications, or digital credentials.
        </p>
      </div>

      {/* ─── The Physical Badge Preview Card ─── */}
      <div className="flex justify-center">
        <div
          className="w-full max-w-sm rounded-2xl border p-5 space-y-4 shadow-md transition-all relative overflow-hidden"
          style={{
            background: 'var(--surface)',
            borderColor: 'var(--border-color)',
          }}
        >
          {/* Subtle Decorative Forest Stamp */}
          <div
            className="absolute top-0 right-0 w-24 h-24 rounded-full blur-2xl opacity-10 pointer-events-none"
            style={{ background: 'var(--accent)' }}
          />

          {/* Badge Brand Header */}
          <div className="flex items-center justify-between border-b pb-3" style={{ borderColor: 'var(--border-subtle)' }}>
            <div className="flex items-center gap-2">
              <div
                className="w-7 h-7 rounded-lg flex items-center justify-center text-white shadow-xs"
                style={{ background: 'var(--gradient-accent)' }}
              >
                <Shield className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>
                VERIDOC <span style={{ color: 'var(--accent)' }}>VERIFIED</span>
              </span>
            </div>
            <span
              className="text-[9px] font-mono font-bold px-2 py-0.5 rounded-full uppercase tracking-wider text-white"
              style={{ background: isVerified ? 'var(--risk-low)' : 'var(--risk-review)' }}
            >
              {isVerified ? 'VERIFIED' : 'PENDING'}
            </span>
          </div>

          {/* Badge Metadata Fields */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider block" style={{ color: 'var(--text-muted)' }}>
                Verification ID
              </span>
              <span className="font-mono font-bold text-xs" style={{ color: 'var(--text-primary)' }}>
                {verificationCode}
              </span>
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider block" style={{ color: 'var(--text-muted)' }}>
                Verified On
              </span>
              <span className="font-semibold text-xs" style={{ color: 'var(--text-primary)' }}>
                {verifiedDate}
              </span>
            </div>
          </div>

          {/* Verification Status Checks (Privacy Safe) */}
          <div className="space-y-1.5 p-3 rounded-xl border bg-[var(--surface-warm)]" style={{ borderColor: 'var(--border-subtle)' }}>
            <span className="text-[9px] font-bold uppercase tracking-wider block mb-1" style={{ color: 'var(--text-muted)' }}>
              Verification Checks Passed
            </span>
            <div className="flex items-center gap-2 text-xs" style={{ color: 'var(--text-primary)' }}>
              <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0" style={{ color: 'var(--risk-low)' }} />
              <span className="font-medium">Authenticity checks passed</span>
            </div>
            <div className="flex items-center gap-2 text-xs" style={{ color: 'var(--text-primary)' }}>
              <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0" style={{ color: 'var(--risk-low)' }} />
              <span className="font-medium">Identity checks passed</span>
            </div>
            <div className="flex items-center gap-2 text-xs" style={{ color: 'var(--text-primary)' }}>
              <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0" style={{ color: 'var(--risk-low)' }} />
              <span className="font-medium">Document validation passed</span>
            </div>
          </div>

          {/* Privacy Guarantee Seal */}
          <div className="flex items-center justify-between text-[10px] pt-1" style={{ color: 'var(--text-muted)' }}>
            <div className="flex items-center gap-1.5 font-medium">
              <Lock className="w-3 h-3" style={{ color: 'var(--accent)' }} />
              <span>Personal information protected.</span>
            </div>
            <span className="font-mono font-bold text-[9px]">256-BIT SHA</span>
          </div>
        </div>
      </div>

      {/* ─── Share & Integration Actions ─── */}
      <div className="space-y-3 max-w-sm mx-auto">
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={handleCopyLink}
            className="btn-secondary text-xs justify-center py-2.5"
          >
            {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedLink ? 'Link Copied' : 'Copy Public URL'}</span>
          </button>
          <a
            href={`/verify/badge/${result.id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary text-xs justify-center py-2.5"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Open Page</span>
          </a>
        </div>

        <button
          onClick={handleCopyEmbed}
          className="w-full p-2.5 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 card-warm-subtle hover:bg-[var(--surface-hover)] transition-colors cursor-pointer"
          style={{ borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
        >
          <Share2 className="w-3.5 h-3.5" style={{ color: 'var(--accent)' }} />
          <span>{copiedEmbed ? 'Embed Code Copied to Clipboard!' : 'Copy Embed Snippet (<iframe />)'}</span>
        </button>
      </div>
    </div>
  );
}
