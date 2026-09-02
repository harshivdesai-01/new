'use client';

import { useState, useCallback } from 'react';
import { api } from '@/services/api';
import type { VerificationResult, DemoScenario, PipelineStep, PipelineStepStatus } from '@/types';
import { mockPipelineSteps } from '@/services/mock-data';

interface UseVerificationReturn {
  isAnalyzing: boolean;
  pipelineSteps: PipelineStep[];
  result: VerificationResult | null;
  error: string | null;
  startAnalysis: (scenario?: DemoScenario) => Promise<string>;
  loadResult: (id: string) => Promise<void>;
  reset: () => void;
}

export function useVerification(): UseVerificationReturn {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [pipelineSteps, setPipelineSteps] = useState<PipelineStep[]>(
    mockPipelineSteps.map(s => ({ ...s }))
  );
  const [result, setResult] = useState<VerificationResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const updateStep = useCallback((index: number, updates: Partial<PipelineStep>) => {
    setPipelineSteps(prev => prev.map((step, i) =>
      i === index ? { ...step, ...updates } : step
    ));
  }, []);

  const simulatePipeline = useCallback(async (): Promise<void> => {
    const stepDurations = [800, 1200, 2000, 1500, 2500, 2000, 1800, 1500];
    const stepStatuses: PipelineStepStatus[] = ['completed', 'completed', 'completed', 'completed', 'completed', 'completed', 'completed', 'completed'];

    for (let i = 0; i < stepDurations.length; i++) {
      updateStep(i, { status: 'processing', progress: 0 });

      // Simulate progress
      const duration = stepDurations[i];
      const steps = 10;
      const interval = duration / steps;

      for (let p = 1; p <= steps; p++) {
        await new Promise(r => setTimeout(r, interval));
        updateStep(i, { progress: (p / steps) * 100 });
      }

      updateStep(i, {
        status: stepStatuses[i],
        progress: 100,
        duration: duration,
      });
    }
  }, [updateStep]);

  const startAnalysis = useCallback(async (scenario?: DemoScenario): Promise<string> => {
    setIsAnalyzing(true);
    setError(null);
    setResult(null);
    setPipelineSteps(mockPipelineSteps.map(s => ({ ...s })));

    try {
      // Start the pipeline simulation
      simulatePipeline();

      let verificationId: string;

      if (scenario) {
        const res = await api.loadDemoScenario(scenario);
        verificationId = res.id;
      } else {
        const { verificationId: id } = await api.analyzeDocument(new FormData());
        verificationId = id;
      }

      return verificationId;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Analysis failed');
      throw err;
    }
  }, [simulatePipeline]);

  const loadResult = useCallback(async (id: string): Promise<void> => {
    try {
      const data = await api.getVerification(id);
      setResult(data);
      setIsAnalyzing(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load result');
    }
  }, []);

  const reset = useCallback(() => {
    setIsAnalyzing(false);
    setPipelineSteps(mockPipelineSteps.map(s => ({ ...s })));
    setResult(null);
    setError(null);
  }, []);

  return {
    isAnalyzing,
    pipelineSteps,
    result,
    error,
    startAnalysis,
    loadResult,
    reset,
  };
}
