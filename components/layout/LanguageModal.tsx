'use client';

import { useState } from 'react';
import { Globe, Search, Check, X } from 'lucide-react';
import { useLanguage, type Language, supportedLanguages } from '@/context/LanguageContext';

interface LanguageModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LanguageModal({ isOpen, onClose }: LanguageModalProps) {
  const { language, setLanguage, t } = useLanguage();
  const [search, setSearch] = useState('');

  if (!isOpen) return null;

  const filtered = supportedLanguages.filter(
    (l) =>
      l.name.toLowerCase().includes(search.toLowerCase()) ||
      l.nativeName.toLowerCase().includes(search.toLowerCase()) ||
      l.region.toLowerCase().includes(search.toLowerCase()) ||
      l.code.toLowerCase().includes(search.toLowerCase())
  );

  const handleSelect = (code: Language) => {
    setLanguage(code);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="w-full max-w-xl rounded-2xl border shadow-2xl overflow-hidden flex flex-col max-h-[85vh] animate-in zoom-in-95 duration-200"
        style={{
          background: 'var(--surface)',
          borderColor: 'var(--border-color)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          className="p-5 border-b flex items-center justify-between"
          style={{ borderColor: 'var(--border-subtle)', background: 'var(--surface-warm)' }}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{ background: 'var(--accent-light)', color: 'var(--accent)' }}
            >
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold" style={{ color: 'var(--text-primary)' }}>
                Select System Language
              </h3>
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                17 official border & document inspection locales supported
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="btn-ghost p-2 rounded-lg"
            aria-label="Close language selector"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Search */}
        <div className="p-4 border-b" style={{ borderColor: 'var(--border-subtle)' }}>
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4"
              style={{ color: 'var(--text-muted)' }}
            />
            <input
              type="text"
              placeholder="Search language, script, or region..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input pl-9 text-xs"
              autoFocus
            />
          </div>
        </div>

        {/* Language Grid */}
        <div className="p-4 overflow-y-auto grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {filtered.map((item) => {
            const isSelected = language === item.code;
            return (
              <button
                key={item.code}
                onClick={() => handleSelect(item.code)}
                className="flex items-center justify-between p-3 rounded-xl border text-left transition-all group"
                style={{
                  background: isSelected ? 'var(--accent-light)' : 'var(--surface)',
                  borderColor: isSelected ? 'var(--accent)' : 'var(--border-subtle)',
                  boxShadow: isSelected ? '0 2px 8px var(--accent-glow)' : 'none',
                }}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className="w-7 h-7 rounded-lg flex items-center justify-center text-[11px] font-mono font-bold flex-shrink-0 uppercase"
                    style={{
                      background: isSelected ? 'var(--accent)' : 'var(--surface-warm)',
                      color: isSelected ? '#FFFFFF' : 'var(--text-secondary)',
                    }}
                  >
                    {item.code}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold truncate" style={{ color: 'var(--text-primary)' }}>
                      {item.nativeName}
                    </p>
                    <p className="text-[10px] truncate" style={{ color: 'var(--text-muted)' }}>
                      {item.name} • {item.region}
                    </p>
                  </div>
                </div>
                {isSelected && (
                  <Check className="w-4 h-4 flex-shrink-0 ml-2" style={{ color: 'var(--accent)' }} />
                )}
              </button>
            );
          })}
        </div>

        {/* Footer */}
        <div
          className="p-3.5 border-t text-center text-[11px] flex items-center justify-between"
          style={{ borderColor: 'var(--border-subtle)', background: 'var(--surface-warm)', color: 'var(--text-muted)' }}
        >
          <span>Current: <strong>{supportedLanguages.find((l) => l.code === language)?.nativeName}</strong></span>
          <button
            onClick={onClose}
            className="btn-secondary text-xs py-1.5 px-3 font-semibold"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
