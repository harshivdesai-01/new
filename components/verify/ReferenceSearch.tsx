'use client';

import { useState } from 'react';
import { Search, CheckCircle2, AlertTriangle, Loader2, Database, ShieldCheck } from 'lucide-react';
import { api } from '@/services/api';
import type { ReferenceRecord } from '@/types';

interface ReferenceSearchProps {
  onRecordFound: (record: ReferenceRecord | null) => void;
  foundRecord: ReferenceRecord | null;
}

export default function ReferenceSearch({ onRecordFound, foundRecord }: ReferenceSearchProps) {
  const [docNumber, setDocNumber] = useState('');
  const [name, setName] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleSearch = async () => {
    if (!docNumber && !name) return;
    setIsSearching(true);
    setSearched(false);
    try {
      const record = await api.searchReference({
        documentNumber: docNumber || undefined,
        name: name || undefined,
      });
      onRecordFound(record);
      setSearched(true);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <div className="flex items-center justify-between">
          <span className="editorial-label">Step 04</span>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-stone-200/50 dark:bg-stone-800/50" style={{ color: 'var(--text-muted)' }}>
            OPTIONAL STEP
          </span>
        </div>
        <h3 className="text-xl font-bold mt-1" style={{ color: 'var(--text-primary)' }}>
          Authority Reference Verification
        </h3>
        <p className="text-xs md:text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
          Cross-reference document attributes against government authority registers to verify status and issuing validity.
        </p>
      </div>

      <div className="glass-card-static p-5 space-y-4" style={{ background: 'var(--surface-warm)' }}>
        <div className="flex items-center gap-2 pb-2 border-b" style={{ borderColor: 'var(--border-subtle)' }}>
          <Database className="w-4 h-4" style={{ color: 'var(--accent)' }} />
          <h4 className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--text-primary)' }}>
            Search Prototype Register
          </h4>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-semibold mb-1.5 block" style={{ color: 'var(--text-secondary)' }}>
              Document Number
            </label>
            <input
              type="text"
              value={docNumber}
              onChange={(e) => setDocNumber(e.target.value)}
              placeholder="e.g. P12345678 or ID-9988"
              className="input text-xs"
            />
          </div>
          <div>
            <label className="text-xs font-semibold mb-1.5 block" style={{ color: 'var(--text-secondary)' }}>
              Applicant Full Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Sarah Johnson or Rahul Patel"
              className="input text-xs"
            />
          </div>
        </div>

        <div className="flex items-center justify-between pt-1">
          <button
            onClick={handleSearch}
            disabled={isSearching || (!docNumber && !name)}
            className="btn-primary text-xs py-2.5 px-4"
            style={{ opacity: !docNumber && !name ? 0.5 : 1 }}
          >
            {isSearching ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Search className="w-4 h-4" />
            )}
            <span>{isSearching ? 'Querying Authority Database...' : 'Query Authority Register'}</span>
          </button>

          {/* Quick autofill for demo */}
          <button
            type="button"
            onClick={() => {
              setDocNumber('P12345678');
              setName('Sarah Johnson');
            }}
            className="text-xs hover:underline font-semibold"
            style={{ color: 'var(--accent)' }}
          >
            Load Demo Record
          </button>
        </div>
      </div>

      {/* Record Match Found */}
      {searched && foundRecord && (
        <div
          className="glass-card-static p-5 fade-in-up border"
          style={{ borderColor: 'rgba(45, 122, 77, 0.3)' }}
        >
          <div className="flex items-center gap-2 mb-3 pb-2 border-b" style={{ borderColor: 'var(--border-subtle)' }}>
            <CheckCircle2 className="w-4.5 h-4.5 text-emerald-600 dark:text-emerald-400" />
            <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">
              Authority Record Found & Verified
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
            {[
              ['Full Name', foundRecord.fullName],
              ['Document Number', foundRecord.documentNumber],
              ['Date of Birth', foundRecord.dateOfBirth],
              ['Issuing Authority', foundRecord.issuingAuthority],
              ['Issue Date', foundRecord.issueDate],
              ['Expiry Date', foundRecord.expiryDate],
              ['Status', foundRecord.status.toUpperCase()],
            ].map(([label, value]) => (
              <div key={label} className="p-2.5 rounded-lg" style={{ background: 'var(--surface-warm)' }}>
                <span className="text-[10px] font-medium" style={{ color: 'var(--text-muted)' }}>{label}</span>
                <p className="font-bold mt-0.5 truncate" style={{ color: 'var(--text-primary)' }}>{value}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* No Record Found */}
      {searched && !foundRecord && (
        <div
          className="glass-card-static p-4 fade-in-up flex items-start gap-3 border"
          style={{ borderColor: 'rgba(201, 122, 30, 0.3)' }}
        >
          <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-xs font-bold text-amber-700 dark:text-amber-400">
              No Matching Record Found
            </p>
            <p className="text-[11px] mt-0.5 leading-snug" style={{ color: 'var(--text-secondary)' }}>
              The query returned no exact matches in the test register. You may still proceed with AI forensic verification.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
