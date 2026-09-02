'use client';

import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, X, FileImage, Check, RefreshCw, Eye } from 'lucide-react';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  accept?: Record<string, string[]>;
  label?: string;
  description?: string;
  maxSize?: number;
  currentFile?: File | null;
  onRemove?: () => void;
  isSelfie?: boolean;
}

export default function FileUpload({
  onFileSelect,
  accept = { 'image/*': ['.jpg', '.jpeg', '.png', '.webp'] },
  label = 'Upload Document',
  description = 'Drag and drop your file here or click to browse',
  maxSize = 10 * 1024 * 1024,
  currentFile,
  onRemove,
  isSelfie = false,
}: FileUploadProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [isHovered, setIsHovered] = useState(false);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (file) {
        onFileSelect(file);
        if (file.type.startsWith('image/')) {
          const reader = new FileReader();
          reader.onload = () => setPreview(reader.result as string);
          reader.readAsDataURL(file);
        }
      }
    },
    [onFileSelect]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept,
    maxSize,
    multiple: false,
  });

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPreview(null);
    onRemove?.();
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  // If a file is uploaded, show the rich preview card
  if (currentFile && preview) {
    return (
      <div
        className="glass-card-static p-5 fade-in-up relative overflow-hidden"
        style={{ borderColor: 'rgba(45, 122, 77, 0.3)' }}
      >
        <div className="flex items-center justify-between gap-4 mb-4 pb-3 border-b" style={{ borderColor: 'var(--border-subtle)' }}>
          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: 'var(--risk-low-bg)', color: 'var(--risk-low)' }}
            >
              <Check className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-bold truncate max-w-[220px]" style={{ color: 'var(--text-primary)' }}>
                {currentFile.name}
              </p>
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                {formatSize(currentFile.size)} • <span className="text-emerald-600 dark:text-emerald-400 font-medium">Ready for ML analysis</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={handleRemove}
              className="btn-ghost text-xs px-2.5 py-1.5 flex items-center gap-1 hover:text-red-500"
              title="Remove File"
            >
              <X className="w-3.5 h-3.5" />
              <span>Remove</span>
            </button>
          </div>
        </div>

        {/* Document or Selfie Image Frame */}
        <div
          className={`relative rounded-xl overflow-hidden border mx-auto flex items-center justify-center bg-stone-900/5 dark:bg-black/30 ${
            isSelfie ? 'w-48 h-48 rounded-full border-2' : 'w-full max-h-64'
          }`}
          style={{ borderColor: 'var(--border-color)' }}
        >
          <img
            src={preview}
            alt="Uploaded Preview"
            className={`${isSelfie ? 'w-full h-full object-cover' : 'w-full max-h-60 object-contain p-2'}`}
          />
        </div>
      </div>
    );
  }

  // Upload dropzone area
  return (
    <div
      {...getRootProps()}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`glass-card p-8 flex flex-col items-center justify-center cursor-pointer transition-all duration-300 relative overflow-hidden group ${
        isDragActive ? 'scale-[1.01]' : ''
      }`}
      style={{
        borderStyle: 'dashed',
        borderWidth: '2px',
        borderColor: isDragActive
          ? 'var(--accent)'
          : isHovered
          ? 'rgba(200, 90, 50, 0.4)'
          : 'var(--border-color)',
        background: isDragActive
          ? 'var(--accent-light)'
          : isHovered
          ? 'var(--surface-warm)'
          : 'var(--surface)',
        minHeight: '220px',
      }}
    >
      <input {...getInputProps()} />

      {/* Floating Document Sheet Visual Effect */}
      <div
        className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-4 transition-all duration-300 shadow-sm ${
          isDragActive || isHovered ? 'scale-110 -translate-y-1' : ''
        }`}
        style={{
          background: isDragActive ? 'var(--accent)' : 'var(--accent-light)',
          color: isDragActive ? '#FFFFFF' : 'var(--accent)',
          boxShadow: '0 4px 14px var(--accent-glow)',
        }}
      >
        {isDragActive ? (
          <FileImage className="w-7 h-7 animate-bounce" />
        ) : (
          <Upload className="w-7 h-7" />
        )}
      </div>

      <p className="text-sm font-bold mb-1" style={{ color: 'var(--text-primary)' }}>
        {isDragActive ? 'Drop document here to load' : label}
      </p>

      <p className="text-xs text-center max-w-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
        {description}
      </p>

      <div className="flex items-center gap-2 mt-3 text-[11px]" style={{ color: 'var(--text-muted)' }}>
        <span className="px-2 py-0.5 rounded bg-stone-200/50 dark:bg-stone-800/50 font-mono">JPG, PNG, WEBP</span>
        <span>•</span>
        <span>Up to {formatSize(maxSize)}</span>
      </div>
    </div>
  );
}
