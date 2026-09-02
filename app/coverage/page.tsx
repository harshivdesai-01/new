'use client';

import TopNav from '@/components/layout/TopNav';
import CoverageMap from '@/components/forensics/CoverageMap';

export default function CoveragePage() {
  return (
    <>
      <TopNav
        title="Live Coverage Map"
        breadcrumbs={[
          { label: 'Dashboard', href: '/' },
          { label: 'Intelligence', href: '/model-insights' },
          { label: 'Operational Coverage' },
        ]}
      />

      <div className="flex-1 p-6 md:p-8 max-w-7xl mx-auto w-full space-y-6">
        <CoverageMap />
      </div>
    </>
  );
}
