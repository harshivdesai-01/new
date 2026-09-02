'use client';

import { useState } from 'react';
import {
  ShieldCheck,
  CheckCircle,
  XCircle,
  AlertOctagon,
  FileQuestion,
  UserCheck,
  Save,
  Clock,
  Sparkles,
} from 'lucide-react';
import type { OfficerDecision, OfficerVerdict, RiskLevel } from '@/types';
import { api } from '@/services/api';

interface OfficerDecisionCenterProps {
  verificationId: string;
  currentDecision?: OfficerDecision;
  aiRiskLevel: RiskLevel;
  onDecisionSaved?: (decision: OfficerDecision) => void;
}

export default function OfficerDecisionCenter({
  verificationId,
  currentDecision,
  aiRiskLevel,
  onDecisionSaved,
}: OfficerDecisionCenterProps) {
  const [verdict, setVerdict] = useState<OfficerVerdict>(
    currentDecision?.verdict || 'pending'
  );
  const [officerId, setOfficerId] = useState(
    currentDecision?.officerId || 'OFFICER-7741'
  );
  const [notes, setNotes] = useState(currentDecision?.notes || '');
  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const getAIRecommendation = (): 'CLEAR' | 'REVIEW REQUIRED' | 'HIGH RISK' => {
    if (aiRiskLevel === 'low') return 'CLEAR';
    if (aiRiskLevel === 'review') return 'REVIEW REQUIRED';
    return 'HIGH RISK';
  };

  const handleSaveDecision = async () => {
    setIsSaving(true);
    const decisionPayload: OfficerDecision = {
      verdict,
      officerId,
      officerName: 'Primary Duty Inspector',
      notes,
      decidedAt: new Date().toISOString(),
      aiRecommendation: getAIRecommendation(),
    };

    try {
      await api.submitOfficerDecision(verificationId, decisionPayload);
      setSavedSuccess(true);
      if (onDecisionSaved) onDecisionSaved(decisionPayload);
      setTimeout(() => setSavedSuccess(false), 2500);
    } catch {
      // fallback
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div
      className="p-6 md:p-8 rounded-3xl border shadow-xl space-y-6"
      style={{
        background: 'var(--surface)',
        borderColor: 'var(--border-color)',
      }}
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-5" style={{ borderColor: 'var(--border-subtle)' }}>
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center shadow-xs"
            style={{ background: 'var(--accent-light)', color: 'var(--accent)' }}
          >
            <UserCheck className="w-5 h-5" />
          </div>
          <div>
            <span className="editorial-label">Human-in-the-Loop Governance</span>
            <h3 className="text-base font-bold mt-0.5" style={{ color: 'var(--text-primary)' }}>
              Border Officer Decision & Adjudication Center
            </h3>
          </div>
        </div>

        {/* AI Recommendation Badge */}
        <div className="flex items-center gap-2 p-2.5 rounded-xl card-warm-subtle">
          <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500">
            AI Advisory:
          </span>
          <span
            className="text-xs font-mono font-extrabold px-2.5 py-1 rounded-md"
            style={{
              background:
                aiRiskLevel === 'low'
                  ? 'var(--risk-low-bg)'
                  : aiRiskLevel === 'review'
                  ? 'var(--risk-review-bg)'
                  : 'var(--risk-high-bg)',
              color:
                aiRiskLevel === 'low'
                  ? 'var(--risk-low)'
                  : aiRiskLevel === 'review'
                  ? 'var(--risk-review)'
                  : 'var(--risk-high)',
            }}
          >
            {getAIRecommendation()}
          </span>
        </div>
      </div>

      {/* Decision Choice Buttons */}
      <div className="space-y-2.5">
        <label className="text-xs font-bold" style={{ color: 'var(--text-primary)' }}>
          Official Inspector Adjudication
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            {
              id: 'approve' as const,
              label: 'Approve & Clear',
              icon: CheckCircle,
              color: 'var(--risk-low)',
              bgColor: 'var(--risk-low-bg)',
            },
            {
              id: 'secondary_review' as const,
              label: 'Manual Review',
              icon: FileQuestion,
              color: 'var(--risk-review)',
              bgColor: 'var(--risk-review-bg)',
            },
            {
              id: 'escalate' as const,
              label: 'Escalate Fraud',
              icon: AlertOctagon,
              color: 'var(--risk-high)',
              bgColor: 'var(--risk-high-bg)',
            },
            {
              id: 'reject' as const,
              label: 'Deny Entry / Reject',
              icon: XCircle,
              color: 'var(--risk-high)',
              bgColor: 'var(--risk-high-bg)',
            },
          ].map((opt) => {
            const Icon = opt.icon;
            const isSelected = verdict === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => setVerdict(opt.id)}
                className="p-3.5 rounded-2xl border text-center flex flex-col items-center justify-center gap-1.5 transition-all group cursor-pointer"
                style={{
                  background: isSelected ? opt.bgColor : 'var(--surface)',
                  borderColor: isSelected ? opt.color : 'var(--border-subtle)',
                  boxShadow: isSelected ? `0 2px 12px ${opt.color}25` : 'none',
                }}
              >
                <Icon
                  className="w-5 h-5 transition-transform group-hover:scale-110"
                  style={{ color: opt.color }}
                />
                <span className="text-xs font-bold" style={{ color: isSelected ? opt.color : 'var(--text-primary)' }}>
                  {opt.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Officer Notes & Badge Input */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="sm:col-span-1 space-y-1.5">
          <label className="text-xs font-bold" style={{ color: 'var(--text-primary)' }}>
            Officer Badge / Station ID
          </label>
          <input
            type="text"
            value={officerId}
            onChange={(e) => setOfficerId(e.target.value)}
            placeholder="e.g. OFFICER-7741"
            className="input text-xs font-mono font-bold"
          />
        </div>

        <div className="sm:col-span-2 space-y-1.5">
          <label className="text-xs font-bold" style={{ color: 'var(--text-primary)' }}>
            Adjudication Audit Notes & Findings
          </label>
          <input
            type="text"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Enter reason for clearance, secondary referral, or fraud escalation..."
            className="input text-xs"
          />
        </div>
      </div>

      {/* Action Submit Bar */}
      <div className="flex items-center justify-between pt-2 border-t" style={{ borderColor: 'var(--border-subtle)' }}>
        <span className="text-[11px] font-mono text-stone-400">
          Decisions are cryptographically signed and stored in the official border audit log.
        </span>

        <button
          type="button"
          onClick={handleSaveDecision}
          disabled={isSaving}
          className="btn-primary text-xs py-2.5 px-6 font-bold shadow-md"
        >
          <Save className="w-3.5 h-3.5" />
          <span>{isSaving ? 'Submitting...' : savedSuccess ? '✓ Adjudication Logged!' : 'Record Official Decision'}</span>
        </button>
      </div>
    </div>
  );
}
