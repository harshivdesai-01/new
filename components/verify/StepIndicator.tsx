'use client';

import { Check } from 'lucide-react';

interface StepIndicatorProps {
  steps: string[];
  currentStep: number;
  onStepClick?: (stepIndex: number) => void;
}

export default function StepIndicator({ steps, currentStep, onStepClick }: StepIndicatorProps) {
  return (
    <div className="w-full">
      <div className="flex items-center justify-between gap-1 w-full">
        {steps.map((step, index) => {
          const isCompleted = index < currentStep;
          const isCurrent = index === currentStep;
          const isLast = index === steps.length - 1;
          const isClickable = index <= currentStep && onStepClick;

          return (
            <div key={index} className={`flex items-center ${isLast ? '' : 'flex-1'}`}>
              {/* Step Circle & Label Button */}
              <button
                type="button"
                onClick={() => isClickable && onStepClick?.(index)}
                disabled={!isClickable}
                className={`flex items-center gap-2.5 group transition-all text-left ${
                  isClickable ? 'cursor-pointer' : 'cursor-default'
                }`}
              >
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center text-xs font-extrabold flex-shrink-0 transition-all duration-300 shadow-xs ${
                    isCurrent ? 'scale-105' : ''
                  }`}
                  style={{
                    background: isCompleted
                      ? 'var(--risk-low)'
                      : isCurrent
                      ? 'var(--accent)'
                      : 'var(--surface-warm)',
                    color: isCompleted || isCurrent ? '#FFFFFF' : 'var(--text-muted)',
                    border: isCurrent
                      ? '2px solid var(--accent)'
                      : isCompleted
                      ? '2px solid var(--risk-low)'
                      : '1px solid var(--border-color)',
                    boxShadow: isCurrent ? '0 0 14px var(--accent-glow)' : 'none',
                  }}
                >
                  {isCompleted ? <Check className="w-4 h-4" /> : index + 1}
                </div>

                <div className="hidden lg:flex flex-col">
                  <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
                    Step 0{index + 1}
                  </span>
                  <span
                    className={`text-xs font-bold whitespace-nowrap transition-colors ${
                      isCurrent
                        ? 'text-emerald-700 dark:text-emerald-400'
                        : isCompleted
                        ? 'text-stone-800 dark:text-stone-200'
                        : 'text-stone-400 dark:text-stone-500'
                    }`}
                  >
                    {step}
                  </span>
                </div>
              </button>

              {/* Connector line */}
              {!isLast && (
                <div
                  className="flex-1 mx-3 h-[2px] rounded-full transition-all duration-500"
                  style={{
                    background: isCompleted
                      ? 'var(--risk-low)'
                      : 'var(--border-subtle)',
                  }}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
