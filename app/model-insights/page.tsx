'use client';

import { useEffect, useState } from 'react';
import { Brain, Activity, BarChart3, Target, Sparkles, Cpu, Layers, CheckCircle2 } from 'lucide-react';
import TopNav from '@/components/layout/TopNav';
import ProgressBar from '@/components/ui/ProgressBar';
import { api } from '@/services/api';
import type { ModelMetrics } from '@/types';
import { useLanguage } from '@/context/LanguageContext';

const modelIcons: Record<string, React.ElementType> = {
  'Tampering Detection': Activity,
  'Face Verification': Target,
  'OCR Engine': BarChart3,
  'Risk Fusion': Brain,
};

const modelColors: Record<string, string> = {
  'Tampering Detection': 'var(--accent)',
  'Face Verification': 'var(--amber-accent)',
  'OCR Engine': 'var(--status-info)',
  'Risk Fusion': 'var(--risk-low)',
};

export default function ModelInsightsPage() {
  const { t } = useLanguage();
  const [metrics, setMetrics] = useState<ModelMetrics[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedModel, setSelectedModel] = useState<string | null>(null);

  useEffect(() => {
    api
      .getModelMetrics()
      .then((data) => {
        setMetrics(data);
        if (data.length > 0) setSelectedModel(data[0].modelName);
      })
      .finally(() => setLoading(false));
  }, []);

  const selected = metrics.find((m) => m.modelName === selectedModel);

  if (loading) {
    return (
      <>
        <TopNav title={t('nav.modelInsights', 'Model Insights')} />
        <div className="flex-1 flex items-center justify-center min-h-[60vh]">
          <div
            className="w-10 h-10 rounded-full border-3 border-t-transparent animate-spin"
            style={{ borderColor: 'var(--accent)', borderTopColor: 'transparent' }}
          />
        </div>
      </>
    );
  }

  return (
    <>
      <TopNav
        title={t('nav.modelInsights', 'Model Insights')}
        breadcrumbs={[{ label: 'Dashboard', href: '/' }, { label: 'Model Intelligence' }]}
      />

      <div className="flex-1 p-6 md:p-8 max-w-6xl mx-auto w-full space-y-6">
        {/* Prototype Metrics Transparency Banner */}
        <div
          className="p-4 rounded-2xl border flex items-center gap-3 card-warm-subtle"
          style={{ borderColor: 'rgba(201, 122, 30, 0.3)' }}
        >
          <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'var(--risk-review-bg)', color: 'var(--risk-review)' }}>
            <Sparkles className="w-4 h-4" />
          </div>
          <div className="flex-1">
            <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded mr-2" style={{ background: 'var(--risk-review-bg)', color: 'var(--risk-review)' }}>
              DEMO METRICS
            </span>
            <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>
              These benchmarks illustrate simulated evaluation performance on test datasets. The architecture is ready to stream real validation metrics from ML training runs.
            </span>
          </div>
        </div>

        {/* Model Selection Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {metrics.map((model) => {
            const Icon = modelIcons[model.modelName] || Brain;
            const color = modelColors[model.modelName] || 'var(--accent)';
            const isSelected = selectedModel === model.modelName;

            return (
              <button
                key={model.modelName}
                type="button"
                onClick={() => setSelectedModel(model.modelName)}
                className="glass-card p-5 text-left transition-all relative overflow-hidden group"
                style={{
                  borderColor: isSelected ? color : undefined,
                  background: isSelected ? 'var(--accent-light)' : undefined,
                  boxShadow: isSelected ? '0 4px 16px var(--accent-glow)' : undefined,
                }}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center transition-transform group-hover:scale-105"
                    style={{ background: `${color}20`, color }}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold" style={{ color: 'var(--text-primary)' }}>
                      {model.modelName}
                    </p>
                    <p className="text-[10px] font-mono font-medium" style={{ color: 'var(--text-muted)' }}>
                      {model.version}
                    </p>
                  </div>
                </div>

                <div className="flex items-end justify-between pt-2 border-t" style={{ borderColor: 'var(--border-subtle)' }}>
                  <div>
                    <p className="text-2xl font-extrabold font-mono" style={{ color }}>
                      {(model.accuracy * 100).toFixed(1)}%
                    </p>
                    <p className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
                      Accuracy
                    </p>
                  </div>
                  <p className="text-[10px] font-mono" style={{ color: 'var(--text-muted)' }}>
                    {model.totalSamples.toLocaleString()} samples
                  </p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected Model Deep Dive */}
        {selected && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Evaluation Metrics (6 cols) */}
            <div
              className="lg:col-span-6 p-6 rounded-2xl border shadow-xs space-y-5"
              style={{
                background: 'var(--surface)',
                borderColor: 'var(--border-color)',
              }}
            >
              <div>
                <span className="editorial-label">Performance Breakdown</span>
                <h3 className="text-base font-bold mt-0.5" style={{ color: 'var(--text-primary)' }}>
                  Evaluation Metrics — {selected.modelName}
                </h3>
              </div>

              <div className="space-y-4">
                {[
                  { label: 'Accuracy', value: selected.accuracy },
                  { label: 'Precision', value: selected.precision },
                  { label: 'Recall (Sensitivity)', value: selected.recall },
                  { label: 'F1 Score', value: selected.f1Score },
                ].map((metric) => (
                  <ProgressBar
                    key={metric.label}
                    value={metric.value * 100}
                    label={metric.label}
                    showValue
                    color={modelColors[selected.modelName] || 'var(--accent)'}
                  />
                ))}
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="p-3 rounded-xl border text-center card-warm-subtle">
                  <p className="text-lg font-extrabold font-mono" style={{ color: 'var(--text-primary)' }}>
                    {selected.totalSamples.toLocaleString()}
                  </p>
                  <p className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
                    Validation Samples
                  </p>
                </div>
                <div className="p-3 rounded-xl border text-center card-warm-subtle">
                  <p className="text-lg font-extrabold font-mono" style={{ color: 'var(--text-primary)' }}>
                    {selected.lastUpdated}
                  </p>
                  <p className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
                    Last Trained
                  </p>
                </div>
              </div>
            </div>

            {/* Confusion Matrix (6 cols) */}
            <div
              className="lg:col-span-6 p-6 rounded-2xl border shadow-xs space-y-5"
              style={{
                background: 'var(--surface)',
                borderColor: 'var(--border-color)',
              }}
            >
              <div>
                <span className="editorial-label">Confusion Matrix</span>
                <h3 className="text-base font-bold mt-0.5" style={{ color: 'var(--text-primary)' }}>
                  Classification Matrix
                </h3>
              </div>

              <div className="grid grid-cols-2 gap-2 max-w-sm mx-auto">
                <div className="col-span-2 grid grid-cols-3 gap-2 mb-1">
                  <div />
                  <div className="text-center text-[10px] font-bold uppercase tracking-wider text-stone-500">
                    Pred +
                  </div>
                  <div className="text-center text-[10px] font-bold uppercase tracking-wider text-stone-500">
                    Pred −
                  </div>
                </div>

                {/* Actual Positive row */}
                <div className="col-span-2 grid grid-cols-3 gap-2">
                  <div className="flex items-center text-[10px] font-bold uppercase tracking-wider text-stone-500">
                    Act +
                  </div>
                  <div className="p-3.5 rounded-xl border text-center bg-emerald-500/10 border-emerald-600/30">
                    <p className="text-base font-extrabold font-mono text-emerald-700 dark:text-emerald-400">
                      {selected.confusionMatrix.truePositive.toLocaleString()}
                    </p>
                    <p className="text-[9px] font-bold uppercase text-stone-500">True Pos (TP)</p>
                  </div>
                  <div className="p-3.5 rounded-xl border text-center bg-red-500/10 border-red-600/30">
                    <p className="text-base font-extrabold font-mono text-red-700 dark:text-red-400">
                      {selected.confusionMatrix.falseNegative.toLocaleString()}
                    </p>
                    <p className="text-[9px] font-bold uppercase text-stone-500">False Neg (FN)</p>
                  </div>
                </div>

                {/* Actual Negative row */}
                <div className="col-span-2 grid grid-cols-3 gap-2">
                  <div className="flex items-center text-[10px] font-bold uppercase tracking-wider text-stone-500">
                    Act −
                  </div>
                  <div className="p-3.5 rounded-xl border text-center bg-amber-500/10 border-amber-600/30">
                    <p className="text-base font-extrabold font-mono text-amber-700 dark:text-amber-400">
                      {selected.confusionMatrix.falsePositive.toLocaleString()}
                    </p>
                    <p className="text-[9px] font-bold uppercase text-stone-500">False Pos (FP)</p>
                  </div>
                  <div className="p-3.5 rounded-xl border text-center bg-emerald-500/10 border-emerald-600/30">
                    <p className="text-base font-extrabold font-mono text-emerald-700 dark:text-emerald-400">
                      {selected.confusionMatrix.trueNegative.toLocaleString()}
                    </p>
                    <p className="text-[9px] font-bold uppercase text-stone-500">True Neg (TN)</p>
                  </div>
                </div>
              </div>

              {/* Derived Rates */}
              <div className="grid grid-cols-3 gap-2 pt-2 border-t" style={{ borderColor: 'var(--border-subtle)' }}>
                {[
                  {
                    label: 'Sensitivity (TPR)',
                    value:
                      (
                        (selected.confusionMatrix.truePositive /
                          (selected.confusionMatrix.truePositive +
                            selected.confusionMatrix.falseNegative)) *
                        100
                      ).toFixed(1) + '%',
                  },
                  {
                    label: 'Specificity (TNR)',
                    value:
                      (
                        (selected.confusionMatrix.trueNegative /
                          (selected.confusionMatrix.trueNegative +
                            selected.confusionMatrix.falsePositive)) *
                        100
                      ).toFixed(1) + '%',
                  },
                  {
                    label: 'False Alarm (FPR)',
                    value:
                      (
                        (selected.confusionMatrix.falsePositive /
                          (selected.confusionMatrix.falsePositive +
                            selected.confusionMatrix.trueNegative)) *
                        100
                      ).toFixed(1) + '%',
                  },
                ].map((m) => (
                  <div key={m.label} className="text-center p-2.5 rounded-xl card-warm-subtle">
                    <p className="text-xs font-bold font-mono" style={{ color: 'var(--text-primary)' }}>
                      {m.value}
                    </p>
                    <p className="text-[9px] font-medium" style={{ color: 'var(--text-muted)' }}>
                      {m.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
