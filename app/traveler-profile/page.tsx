'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import TopNav from '@/components/layout/TopNav';
import TravelerProfileComponent from '@/components/forensics/TravelerProfile';
import { api } from '@/services/api';
import type { TravelerProfile as TravelerProfileType } from '@/types';
import { useLanguage } from '@/context/LanguageContext';
import { Users, Search } from 'lucide-react';

function TravelerProfileContent() {
  const { t } = useLanguage();
  const searchParams = useSearchParams();
  const idParam = searchParams.get('id') || 'TRV-88210';
  const [profile, setProfile] = useState<TravelerProfileType | null>(null);
  const [selectedId, setSelectedId] = useState(idParam);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api
      .getTravelerProfile(selectedId)
      .then(setProfile)
      .finally(() => setLoading(false));
  }, [selectedId]);

  return (
    <>
      <TopNav
        title={t('nav.travelerProfile', 'Traveler Profile')}
        breadcrumbs={[{ label: 'Dashboard', href: '/' }, { label: 'Traveler Profile' }]}
      />

      <div className="flex-1 p-6 md:p-8 max-w-6xl mx-auto w-full space-y-6">
        {/* Profile Switcher Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl border card-warm-subtle">
          <div className="flex items-center gap-2.5">
            <Users className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span className="text-xs font-bold" style={{ color: 'var(--text-primary)' }}>
              Sample Traveler Dossiers:
            </span>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {[
              { id: 'TRV-88210', name: 'Harshiv Desai (Consistent - 98%)' },
              { id: 'TRV-44109', name: 'John Smith / Jane Smith (Conflict - 42%)' },
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

        {loading || !profile ? (
          <div className="flex items-center justify-center py-24">
            <div
              className="w-10 h-10 rounded-full border-3 border-t-transparent animate-spin"
              style={{ borderColor: 'var(--accent)', borderTopColor: 'transparent' }}
            />
          </div>
        ) : (
          <TravelerProfileComponent profile={profile} />
        )}
      </div>
    </>
  );
}

export default function TravelerProfilePage() {
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
      <TravelerProfileContent />
    </Suspense>
  );
}
