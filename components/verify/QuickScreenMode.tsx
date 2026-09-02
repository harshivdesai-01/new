'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Zap,
  ShieldCheck,
  AlertTriangle,
  FileCheck2,
  Upload,
  ArrowRight,
  RefreshCw,
  Sparkles,
  Layers,
  Cpu,
} from 'lucide-react';
import { demoScenarios } from '@/services/mock-data';
import { api } from '@/services/api';
import type { VerificationResult, DemoScenario } from '@/types';

export default function QuickScreenMode() {
  const router = useRouter();
  const [isScreening, setIsScreening] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [screenResult, setScreenResult] = useState<VerificationResult | null>(null);

  const handleQuickScreen = async (scenario: DemoScenario) => {
    setIsScreening(true);
    setScreenResult(null);
    setActiveStep(1);

    // Fast 1.5-second accelerated triage pipeline
    setTimeout(() => setActiveStep(2), 350);
    setTimeout(() => setActiveStep(3), 700);
    setTimeout(() => setActiveStep(4), 1100);

    try {
      const res = await api.loadDemoScenario(scenario);
      setTimeout(() => {
        setScreenResult(res);
        setIsScreening(false);
      }, 1400);
    } catch {
      setIsScreening(false);
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-4" style={{ borderColor: 'var(--border-subtle)' }}>
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-white shadow-md"
            style={{ background: 'var(--gradient-accent)' }}
          >
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="editorial-label">High-Throughput E-Gate Lane</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 font-bold">
                1.4s INFERENCE
              </span>
            </div>
            <h3 className="text-base font-bold mt-0.5" style={{ color: 'var(--text-primary)' }}>
              Quick Screening Mode (Rapid Border Triage)
            </h3>
          </div>
        </div>

        <span className="text-xs font-mono text-stone-500">
          Target throughput: 45 pax/min
        </span>
      </div>

      {/* Preset Quick Triage Scenarios */}
      {!screenResult && !isScreening && (
        <div className="space-y-3">
          <span className="editorial-label">Select Traveler Preset for Instant 1-Click Triage</span>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { id: 'genuine' as const, label: 'Legitimate Traveler (Sarah J.)', sub: 'Clean US Passport + Live Selfie', risk: 'low' },
              { id: 'tampered' as const, label: 'Tampered ID (John S.)', sub: 'Inpainted Name & Modified DOB', risk: 'high' },
              { id: 'face_mismatch' as const, label: 'Imposter Selfie (Michael C.)', sub: 'Genuine License + Stolen Presenter', risk: 'review' },
            ].map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => handleQuickScreen(p.id)}
                className="p-4 rounded-2xl border text-left transition-all hover:scale-[1.02] cursor-pointer card-warm-subtle group"
                style={{
                  borderColor:
                    p.risk === 'low'
                      ? 'rgba(5, 150, 105, 0.25)'
                      : p.risk === 'review'
                      ? 'rgba(217, 119, 6, 0.25)'
                      : 'rgba(220, 38, 38, 0.25)',
                }}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                    PASSENGER #{p.id.toUpperCase()}
                  </span>
                  <Zap className="w-3.5 h-3.5 text-stone-400 group-hover:text-emerald-600 transition-colors" />
                </div>
                <h4 className="text-xs font-bold" style={{ color: 'var(--text-primary)' }}>
                  {p.label}
                </h4>
                <p className="text-[11px] mt-1" style={{ color: 'var(--text-muted)' }}>
                  {p.sub}
                </p>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Live Accelerated Screening Progress */}
      {isScreening && (
        <div className="p-8 rounded-2xl border text-center space-y-4 card-warm-subtle">
          <div
            className="w-12 h-12 rounded-2xl mx-auto flex items-center justify-center animate-spin"
            style={{ background: 'var(--accent-light)', color: 'var(--accent)' }}
          >
            <Cpu className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>
              Executing High-Speed Inspection...
            </h4>
            <p className="text-xs font-mono text-emerald-600 dark:text-emerald-400 mt-1">
              {activeStep === 1 && 'Ingesting & Multi-Modal OCR...'}
              {activeStep === 2 && 'Validating MRZ Checksum & Fonts...'}
              {activeStep === 3 && 'Running ELA Tampering & Biometrics...'}
              {activeStep === 4 && 'Computing Risk Fusion Verdict...'}
            </p>
          </div>
        </div>
      )}

      {/* Instant Screening Result Verdict */}
      {screenResult && !isScreening && (
        <div className="p-6 md:p-8 rounded-2xl border space-y-6 fade-in-up" style={{ background: 'var(--surface-warm)', borderColor: 'var(--border-subtle)' }}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-white shadow-md"
                style={{
                  background:
                    screenResult.risk.overallScore <= 30
                      ? 'var(--risk-low)'
                      : screenResult.risk.overallScore <= 60
                      ? 'var(--risk-review)'
                      : 'var(--risk-high)',
                }}
              >
                {screenResult.risk.overallScore <= 30 ? (
                  <ShieldCheck className="w-7 h-7" />
                ) : (
                  <AlertTriangle className="w-7 h-7" />
                )}
              </div>
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest font-bold text-stone-500">
                  RAPID SCREENING VERDICT
                </span>
                <h3
                  className="text-lg md:text-xl font-extrabold"
                  style={{
                    color:
                      screenResult.risk.overallScore <= 30
                        ? 'var(--risk-low)'
                        : screenResult.risk.overallScore <= 60
                        ? 'var(--risk-review)'
                        : 'var(--risk-high)',
                  }}
                >
                  {screenResult.risk.overallScore <= 30
                    ? '🟢 CLEAR — PASSENGER CLEARED'
                    : screenResult.risk.overallScore <= 60
                    ? '🟡 REVIEW — REFER TO MANUAL COUNTER'
                    : '🔴 HIGH RISK — SECONDARY INTERCEPT REQUIRED'}
                </h3>
              </div>
            </div>

            <div className="text-right">
              <span className="text-2xl font-extrabold font-mono" style={{ color: 'var(--text-primary)' }}>
                {screenResult.risk.overallScore} / 100
              </span>
              <p className="text-[10px] uppercase font-bold text-stone-400">Risk Score</p>
            </div>
          </div>

          <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            {screenResult.risk.aiExplanation}
          </p>

          {/* Action Row */}
          <div className="flex items-center justify-between pt-2 border-t" style={{ borderColor: 'var(--border-subtle)' }}>
            <button
              onClick={() => setScreenResult(null)}
              className="btn-secondary text-xs py-2 px-3.5"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Next Passenger</span>
            </button>

            <button
              onClick={() => router.push(`/results/${screenResult.id}`)}
              className="btn-primary text-xs py-2 px-4 font-bold shadow-xs"
            >
              <span>Open in Full Review Desk</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
