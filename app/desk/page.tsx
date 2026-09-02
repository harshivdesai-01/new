'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import TopNav from '@/components/layout/TopNav';
import ReviewDesk from '@/components/forensics/ReviewDesk';
import { api } from '@/services/api';
import type { VerificationResult } from '@/types';
import { useLanguage } from '@/context/LanguageContext';
import { Layers } from 'lucide-react';

function ReviewDeskContent() {
  const { t } = useLanguage();
  const searchParams = useSearchParams();
  const idParam = searchParams.get('id') || 'vrf-002';
  const [result, setResult] = useState<VerificationResult | null>(null);
  const [selectedId, setSelectedId] = useState(idParam);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api
      .getVerification(selectedId)
      .then(setResult)
      .finally(() => setLoading(false));
  }, [selectedId]);

  return (
    <>
      <TopNav
        title={t('nav.reviewDesk', 'Forensic Review Desk')}
        breadcrumbs={[{ label: 'Dashboard', href: '/' }, { label: 'Review Desk' }]}
      />

      <div className="flex-1 p-6 md:p-8 max-w-7xl mx-auto w-full space-y-6">
        {/* Sample Audit Switcher */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl border card-warm-subtle">
          <div className="flex items-center gap-2.5">
            <Layers className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span className="text-xs font-bold" style={{ color: 'var(--text-primary)' }}>
              Open Audit Case:
            </span>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {[
              { id: 'vrf-001', name: 'vrf-001 (US Passport - Cleared)' },
              { id: 'vrf-002', name: 'vrf-002 (UK ID - Tampered Name & DOB)' },
              { id: 'vrf-003', name: 'vrf-003 (Ontario DL - Biometric Imposter)' },
            ].map((p) => (
              <button
                key={p.id}
                onClick={() => setSelectedId(p.id)}
                className={`text-xs font-semibold px-3 py-1.5 rounded-xl transition-all ${
                  selectedId === p.id
                    ? 'bg-emerald-600 text-white font-bold shadow-xs'
                    : 'bg-white dark:bg-[#101E17] text-stone-600 dark:text-stone-300 border border-stone-200 dark:border-stone-800'
                }`}
              >
                {p.name}
              </button>
            ))}
          </div>
        </div>

        {loading || !result ? (
          <div className="flex items-center justify-center py-24">
            <div
              className="w-10 h-10 rounded-full border-3 border-t-transparent animate-spin"
              style={{ borderColor: 'var(--accent)', borderTopColor: 'transparent' }}
            />
          </div>
        ) : (
          <ReviewDesk result={result} />
        )}
      </div>
    </>
  );
}

export default function ReviewDeskPage() {
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
      <ReviewDeskContent />
    </Suspense>
  );
}
