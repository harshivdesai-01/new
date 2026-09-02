'use client';

import FileUpload from '@/components/ui/FileUpload';
import { Camera, UserCheck, Sparkles, ScanFace } from 'lucide-react';

interface SelfieUploadProps {
  file: File | null;
  onFileSelect: (file: File) => void;
  onRemove: () => void;
}

export default function SelfieUpload({ file, onFileSelect, onRemove }: SelfieUploadProps) {
  return (
    <div className="space-y-4">
      <div>
        <span className="editorial-label">Step 03</span>
        <h3 className="text-xl font-bold mt-1" style={{ color: 'var(--text-primary)' }}>
          Biometric Selfie Verification
        </h3>
        <p className="text-xs md:text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
          Upload a clear portrait photo of the document holder to extract facial embeddings and verify 1:1 biometric similarity.
        </p>
      </div>

      <div className="pt-2">
        <FileUpload
          label="Upload Portrait / Selfie"
          description="Drag and drop or click to upload applicant selfie photo"
          onFileSelect={onFileSelect}
          currentFile={file}
          onRemove={onRemove}
          isSelfie={true}
        />
      </div>

      {/* Camera capture prototype status */}
      <div
        className="glass-card-static p-4 flex items-center gap-3.5 border"
        style={{
          background: 'var(--surface-warm)',
          borderColor: 'rgba(200, 90, 50, 0.2)',
        }}
      >
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: 'var(--accent-light)', color: 'var(--accent)' }}
        >
          <ScanFace className="w-5 h-5" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-bold" style={{ color: 'var(--text-primary)' }}>
            Biometric Liveness & Facial Embeddings
          </p>
          <p className="text-[11px] leading-snug" style={{ color: 'var(--text-muted)' }}>
            Evaluates facial landmark geometry against document portrait. (Demo Mode active)
          </p>
        </div>
        <span
          className="text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider flex-shrink-0"
          style={{ background: 'var(--accent-light)', color: 'var(--accent)' }}
        >
          AI Liveness
        </span>
      </div>
    </div>
  );
}
