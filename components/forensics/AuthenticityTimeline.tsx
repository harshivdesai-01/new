'use client';

import { useState } from 'react';
import {
  Clock,
  CheckCircle2,
  AlertTriangle,
  FileCheck2,
  ChevronDown,
  ChevronUp,
  Cpu,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import type { TimelineEvent } from '@/types';

interface AuthenticityTimelineProps {
  events?: TimelineEvent[];
}

export default function AuthenticityTimeline({ events = [] }: AuthenticityTimelineProps) {
  const [expandedId, setExpandedId] = useState<string | null>(events[0]?.id || null);

  const toggleExpand = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  return (
    <div
      className="p-6 md:p-8 rounded-3xl border shadow-xs space-y-6"
      style={{
        background: 'var(--surface)',
        borderColor: 'var(--border-color)',
      }}
    >
      <div className="flex items-center justify-between border-b pb-4" style={{ borderColor: 'var(--border-subtle)' }}>
        <div>
          <span className="editorial-label">Audit Trail & Chain of Custody</span>
          <h3 className="text-base font-bold mt-0.5" style={{ color: 'var(--text-primary)' }}>
            Document Authenticity Timeline & Execution Logs
          </h3>
        </div>
        <span className="text-[10px] font-mono px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 font-bold">
          {events.length} STAGES LOGGED
        </span>
      </div>

      {/* Timeline List */}
      <div className="relative pl-6 space-y-4 before:absolute before:left-2.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-emerald-500/30">
        {events.map((event, idx) => {
          const isExpanded = expandedId === event.id;
          const isFlagged = event.status === 'flagged';
          const isWarning = event.status === 'warning';

          return (
            <div key={event.id} className="relative group">
              {/* Bullet Node */}
              <div
                className="absolute -left-6 top-1.5 w-5 h-5 rounded-full border-2 flex items-center justify-center bg-white dark:bg-[#101E17] transition-transform group-hover:scale-110"
                style={{
                  borderColor: isFlagged
                    ? 'var(--risk-high)'
                    : isWarning
                    ? 'var(--risk-review)'
                    : 'var(--risk-low)',
                  color: isFlagged
                    ? 'var(--risk-high)'
                    : isWarning
                    ? 'var(--risk-review)'
                    : 'var(--risk-low)',
                }}
              >
                {isFlagged ? (
                  <AlertTriangle className="w-2.5 h-2.5" />
                ) : (
                  <CheckCircle2 className="w-2.5 h-2.5" />
                )}
              </div>

              {/* Event Card */}
              <div
                onClick={() => toggleExpand(event.id)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                  isExpanded ? 'bg-white dark:bg-[#101E17] shadow-md' : 'card-warm-subtle hover:bg-white/60 dark:hover:bg-white/5'
                }`}
                style={{
                  borderColor: isExpanded ? 'var(--accent)' : 'var(--border-subtle)',
                }}
              >
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                        {event.stage}
                      </span>
                      <span className="text-[10px] font-mono text-stone-400">• {event.timestamp}</span>
                    </div>
                    <h4 className="text-xs font-bold mt-0.5" style={{ color: 'var(--text-primary)' }}>
                      {event.title}
                    </h4>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-[10px] font-mono font-bold text-stone-500">
                      {event.durationMs}ms
                    </span>
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4 text-stone-400" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-stone-400" />
                    )}
                  </div>
                </div>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="mt-3 pt-3 border-t border-dashed space-y-2 text-xs" style={{ borderColor: 'var(--border-subtle)' }}>
                    <p className="leading-relaxed font-mono text-[11px]" style={{ color: 'var(--text-secondary)' }}>
                      {event.details}
                    </p>
                    <div className="flex items-center justify-between text-[10px] font-mono text-stone-400 pt-1">
                      <span>Engine Core: <strong>{event.engineVersion}</strong></span>
                      <span className="text-emerald-600 dark:text-emerald-400 font-semibold">✓ Cryptographically Logged</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
