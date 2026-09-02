'use client';

import { BookOpen, CreditCard, Car, FileText, CheckCircle2 } from 'lucide-react';
import type { DocumentType } from '@/types';

interface DocumentTypeSelectorProps {
  selected: DocumentType | null;
  onSelect: (type: DocumentType) => void;
}

const documentTypes: {
  type: DocumentType;
  label: string;
  description: string;
  countrySupport: string;
  icon: React.ElementType;
}[] = [
  {
    type: 'passport',
    label: 'International Passport',
    description: 'Machine Readable Passport (MRP) & e-Passports with MRZ extraction',
    countrySupport: 'Global (190+ Countries)',
    icon: BookOpen,
  },
  {
    type: 'gov_id',
    label: 'National Identity Card',
    description: 'Government-issued national ID cards with tamper & font verification',
    countrySupport: 'Aadhaar, SSN, Emirates ID, DNI',
    icon: CreditCard,
  },
  {
    type: 'driving_license',
    label: 'Driver’s License',
    description: 'State & national driving licenses with barcode and layout parsing',
    countrySupport: 'US, EU, UK, IN, GCC Licenses',
    icon: Car,
  },
  {
    type: 'other',
    label: 'Other Identity Document',
    description: 'Residence permits, voter IDs, or secondary government credentials',
    countrySupport: 'Custom Formats',
    icon: FileText,
  },
];

export default function DocumentTypeSelector({ selected, onSelect }: DocumentTypeSelectorProps) {
  return (
    <div className="space-y-4">
      <div>
        <span className="editorial-label">Step 01</span>
        <h3 className="text-xl font-bold mt-1" style={{ color: 'var(--text-primary)' }}>
          Select Document Type
        </h3>
        <p className="text-xs md:text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
          Select the document format to load the appropriate OCR template and tamper detection pipeline.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
        {documentTypes.map(({ type, label, description, countrySupport, icon: Icon }) => {
          const isSelected = selected === type;
          return (
            <button
              key={type}
              type="button"
              onClick={() => onSelect(type)}
              className="glass-card p-5 text-left flex items-start gap-4 transition-all relative overflow-hidden group"
              style={{
                borderColor: isSelected ? 'var(--accent)' : undefined,
                background: isSelected ? 'var(--accent-light)' : undefined,
                boxShadow: isSelected ? '0 4px 20px var(--accent-glow)' : undefined,
              }}
            >
              {isSelected && (
                <div className="absolute top-3 right-3 text-emerald-600 dark:text-emerald-400">
                  <CheckCircle2 className="w-4 h-4 fill-emerald-600 dark:fill-emerald-400 text-white" />
                </div>
              )}

              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-105"
                style={{
                  background: isSelected ? 'var(--accent)' : 'rgba(15, 91, 64, 0.12)',
                  color: isSelected ? '#FFFFFF' : 'var(--accent)',
                }}
              >
                <Icon className="w-5 h-5" />
              </div>

              <div className="flex-1 min-w-0 pr-4">
                <p className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>
                  {label}
                </p>
                <p className="text-xs mt-1 leading-snug" style={{ color: 'var(--text-secondary)' }}>
                  {description}
                </p>
                <span className="inline-block text-[10px] font-semibold mt-2 px-2 py-0.5 rounded bg-stone-200/50 dark:bg-stone-800/50" style={{ color: 'var(--text-muted)' }}>
                  {countrySupport}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
