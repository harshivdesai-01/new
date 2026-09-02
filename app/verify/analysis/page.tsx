'use client';

import { useEffect, useState, useCallback, useRef, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ShieldCheck, Cpu, CheckCircle2 } from 'lucide-react';
import TopNav from '@/components/layout/TopNav';
import PipelineStepComponent from '@/components/analysis/PipelineStep';
import type { PipelineStep, PipelineStepStatus } from '@/types';
import { mockPipelineSteps } from '@/services/mock-data';

function AnalysisContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const verificationId = searchParams.get('id') || 'vrf-001';
  const [steps, setSteps] = useState<PipelineStep[]>(
    mockPipelineSteps.map((s) => ({ ...s }))
  );
  const [isComplete, setIsComplete] = useState(false);
  const hasStarted = useRef(false);

  const simulatePipeline = useCallback(async () => {
    const durations = [500, 700, 1100, 900, 1400, 1200, 1000, 800];
    const statuses: PipelineStepStatus[] = [
      'completed',
      'completed',
      'completed',
      'completed',
      'completed',
      'completed',
      'completed',
      'completed',
    ];

    for (let i = 0; i < durations.length; i++) {
      // Set to processing
      setSteps((prev) =>
        prev.map((s, idx) =>
          idx === i ? { ...s, status: 'processing' as PipelineStepStatus, progress: 0 } : s
        )
      );

      // Simulate progress ticks
      const duration = durations[i];
      const ticks = 15;
      const interval = duration / ticks;

      for (let p = 1; p <= ticks; p++) {
        await new Promise((r) => setTimeout(r, interval));
        setSteps((prev) =>
          prev.map((s, idx) =>
            idx === i ? { ...s, progress: (p / ticks) * 100 } : s
          )
        );
      }

      // Set final status
      setSteps((prev) =>
        prev.map((s, idx) =>
          idx === i
            ? { ...s, status: statuses[i], progress: 100, duration: duration }
            : s
        )
      );
    }

    setIsComplete(true);
  }, []);

  useEffect(() => {
    if (!hasStarted.current) {
      hasStarted.current = true;
      simulatePipeline();
    }
  }, [simulatePipeline]);

  useEffect(() => {
    if (isComplete) {
      const timer = setTimeout(() => {
        router.push(`/results/${verificationId}`);
      }, 1200);
      return () => clearTimeout(timer);
    }
  }, [isComplete, verificationId, router]);

  const completedCount = steps.filter(
    (s) => s.status === 'completed' || s.status === 'warning'
  ).length;

  return (
    <>
      <TopNav
        title="ML Pipeline Analysis"
        breadcrumbs={[
          { label: 'Dashboard', href: '/' },
          { label: 'Verify', href: '/verify' },
          { label: 'Live Analysis' },
        ]}
      />

      <div className="flex-1 p-6 md:p-8 max-w-3xl mx-auto w-full space-y-6">
        {/* Header Hero Area */}
        <div
          className="text-center p-6 md:p-8 rounded-2xl border shadow-md space-y-4"
          style={{
            background: 'var(--gradient-warm-hero)',
            borderColor: 'rgba(200, 90, 50, 0.25)',
          }}
        >
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto shadow-md transition-transform hover:scale-105"
            style={{
              background: isComplete ? 'var(--risk-low)' : 'var(--gradient-accent)',
              color: '#FFFFFF',
              boxShadow: '0 4px 20px var(--accent-glow)',
            }}
          >
            {isComplete ? <CheckCircle2 className="w-7 h-7" /> : <Cpu className="w-7 h-7 animate-pulse" />}
          </div>

          <div>
            <span className="editorial-label">Inference Stream</span>
            <h2 className="text-xl md:text-2xl font-extrabold mt-1" style={{ color: 'var(--text-primary)' }}>
              {isComplete ? 'Verification Completed' : 'Running Forensic Analysis...'}
            </h2>
            <p className="text-xs md:text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
              {isComplete
                ? 'Synthesizing evidence score. Redirecting to forensic report...'
                : `Executing multi-modal stage ${completedCount + 1} of ${steps.length}`}
            </p>
          </div>

          {/* Overall progress bar */}
          <div className="max-w-md mx-auto space-y-1.5 pt-2">
            <div
              className="w-full h-2 rounded-full overflow-hidden"
              style={{ background: 'var(--border-subtle)' }}
            >
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${(completedCount / steps.length) * 100}%`,
                  background: isComplete ? 'var(--risk-low)' : 'var(--gradient-accent)',
                }}
              />
            </div>
            <div className="flex justify-between text-[11px] font-mono" style={{ color: 'var(--text-muted)' }}>
              <span>Pipeline Progress</span>
              <span>
                {completedCount} / {steps.length} stages complete
              </span>
            </div>
          </div>
        </div>

        {/* Pipeline Steps Container */}
        <div
          className="glass-card-static p-6 md:p-8 shadow-sm"
          style={{ background: 'var(--surface)' }}
        >
          {steps.map((step, index) => (
            <PipelineStepComponent
              key={step.id}
              name={step.name}
              description={step.description}
              status={step.status}
              progress={step.progress}
              duration={step.duration}
              index={index}
              isLast={index === steps.length - 1}
            />
          ))}
        </div>

        <p className="text-[11px] text-center" style={{ color: 'var(--text-muted)' }}>
          VeriDoc AI multi-modal pipeline evaluates physical integrity, digital font coherence, OCR confidence, and biometric similarity.
        </p>
      </div>
    </>
  );
}

export default function AnalysisPage() {
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
      <AnalysisContent />
    </Suspense>
  );
}
