'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Play, ChevronDown, ChevronUp, Sparkles, FileSearch } from 'lucide-react';
import { demoScenarios } from '@/services/mock-data';
import StatusBadge from '@/components/ui/StatusBadge';
import type { DemoScenario } from '@/types';

export default function DemoModeSelector() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [loadingScenario, setLoadingScenario] = useState<DemoScenario | null>(null);

  const handleScenario = async (scenarioId: DemoScenario) => {
    setLoadingScenario(scenarioId);

    const scenarioMap: Record<DemoScenario, string> = {
      genuine: 'vrf-001',
      tampered: 'vrf-002',
      face_mismatch: 'vrf-003',
      expired: 'vrf-004',
      high_risk: 'vrf-005',
    };

    setTimeout(() => {
      router.push(`/verify/analysis?id=${scenarioMap[scenarioId]}`);
      setIsOpen(false);
      setLoadingScenario(null);
    }, 400);
  };

  return (
    <div className="fixed bottom-5 left-5 z-40">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2.5 px-4 py-2.5 rounded-full text-xs font-bold shadow-lg transition-all hover:scale-105"
        style={{
          background: 'var(--gradient-accent)',
          color: '#FFFFFF',
          boxShadow: '0 4px 20px var(--accent-glow)',
        }}
      >
        <Sparkles className="w-3.5 h-3.5" />
        <span>Demo Scenarios</span>
        {isOpen ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
      </button>

      {isOpen && (
        <div
          className="absolute bottom-full left-0 mb-3 w-[360px] max-w-[90vw] glass-card-static p-4 fade-in-up shadow-2xl"
          style={{
            background: 'var(--surface)',
            borderColor: 'rgba(200, 90, 50, 0.3)',
          }}
        >
          <div className="flex items-center gap-2 mb-2 pb-2 border-b" style={{ borderColor: 'var(--border-subtle)' }}>
            <FileSearch className="w-4 h-4" style={{ color: 'var(--accent)' }} />
            <h4 className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--text-primary)' }}>
              Interactive ML Scenarios
            </h4>
          </div>
          <p className="text-[11px] mb-3 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            Test VeriDoc AI with simulated verification profiles:
          </p>
          <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
            {demoScenarios.map((scenario) => (
              <button
                key={scenario.id}
                onClick={() => handleScenario(scenario.id)}
                disabled={loadingScenario !== null}
                className="w-full glass-card p-3 flex items-start gap-3 text-left transition-all hover:border-amber-600/30"
              >
                <span className="text-xl flex-shrink-0 mt-0.5">{scenario.icon}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-xs font-bold" style={{ color: 'var(--text-primary)' }}>
                      {scenario.name}
                    </p>
                    <StatusBadge level={scenario.riskLevel} size="sm" />
                  </div>
                  <p className="text-[11px] mt-0.5 line-clamp-1" style={{ color: 'var(--text-muted)' }}>
                    {scenario.description}
                  </p>
                </div>
                {loadingScenario === scenario.id ? (
                  <div
                    className="w-4 h-4 rounded-full border-2 border-t-transparent animate-spin flex-shrink-0 mt-1"
                    style={{ borderColor: 'var(--accent)', borderTopColor: 'transparent' }}
                  />
                ) : (
                  <Play className="w-3.5 h-3.5 flex-shrink-0 mt-1" style={{ color: 'var(--accent)' }} />
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
