'use client';

import FileUpload from '@/components/ui/FileUpload';
import { SunMedium, ShieldAlert, Sparkles } from 'lucide-react';

interface DocumentUploadProps {
  file: File | null;
  onFileSelect: (file: File) => void;
  onRemove: () => void;
}

export default function DocumentUpload({ file, onFileSelect, onRemove }: DocumentUploadProps) {
  return (
    <div className="space-y-4">
      <div>
        <span className="editorial-label">Step 02</span>
        <h3 className="text-xl font-bold mt-1" style={{ color: 'var(--text-primary)' }}>
          Upload Document Credentials
        </h3>
        <p className="text-xs md:text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
          Upload a high-resolution color scan or photo of the document. Ensure all 4 borders and security holograms are visible.
        </p>
      </div>

      <div className="pt-2">
        <FileUpload
          label="Upload Identity Document"
          description="Drag and drop your document scan or click to browse files"
          onFileSelect={onFileSelect}
          currentFile={file}
          onRemove={onRemove}
        />
      </div>

      {/* Verification Guidelines */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
        <div className="p-3 rounded-xl border card-warm-subtle">
          <div className="flex items-center gap-2 mb-1 text-xs font-bold" style={{ color: 'var(--text-primary)' }}>
            <SunMedium className="w-4 h-4 text-amber-600" />
            <span>Optimal Lighting</span>
          </div>
          <p className="text-[11px] leading-snug" style={{ color: 'var(--text-muted)' }}>
            Avoid direct flash glare over text fields and photo regions.
          </p>
        </div>

        <div className="p-3 rounded-xl border card-warm-subtle">
          <div className="flex items-center gap-2 mb-1 text-xs font-bold" style={{ color: 'var(--text-primary)' }}>
            <ShieldAlert className="w-4 h-4 text-amber-600" />
            <span>Complete Frame</span>
          </div>
          <p className="text-[11px] leading-snug" style={{ color: 'var(--text-muted)' }}>
            All edges, MRZ code lines, and corners must be uncropped.
          </p>
        </div>

        <div className="p-3 rounded-xl border card-warm-subtle">
          <div className="flex items-center gap-2 mb-1 text-xs font-bold" style={{ color: 'var(--text-primary)' }}>
            <Sparkles className="w-4 h-4 text-amber-600" />
            <span>Original Quality</span>
          </div>
          <p className="text-[11px] leading-snug" style={{ color: 'var(--text-muted)' }}>
            Avoid screenshots or black-and-white photocopies.
          </p>
        </div>
      </div>
    </div>
  );
}
