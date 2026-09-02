'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, ArrowRight, ShieldCheck, Zap, Layers } from 'lucide-react';
import TopNav from '@/components/layout/TopNav';
import StepIndicator from '@/components/verify/StepIndicator';
import DocumentTypeSelector from '@/components/verify/DocumentTypeSelector';
import DocumentUpload from '@/components/verify/DocumentUpload';
import SelfieUpload from '@/components/verify/SelfieUpload';
import ReferenceSearch from '@/components/verify/ReferenceSearch';
import ReviewStep from '@/components/verify/ReviewStep';
import QuickScreenMode from '@/components/verify/QuickScreenMode';
import type { DocumentType, ReferenceRecord } from '@/types';
import { api } from '@/services/api';
import { useLanguage } from '@/context/LanguageContext';

const steps = [
  'Document Type',
  'Upload Document',
  'Upload Selfie',
  'Reference Check',
  'Review & Analyze',
];

export default function VerifyPage() {
  const router = useRouter();
  const { t } = useLanguage();
  const [mode, setMode] = useState<'comprehensive' | 'quick'>('comprehensive');
  const [currentStep, setCurrentStep] = useState(0);
  const [documentType, setDocumentType] = useState<DocumentType | null>(null);
  const [documentFile, setDocumentFile] = useState<File | null>(null);
  const [selfieFile, setSelfieFile] = useState<File | null>(null);
  const [referenceRecord, setReferenceRecord] = useState<ReferenceRecord | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const canProceed = () => {
    switch (currentStep) {
      case 0:
        return !!documentType;
      case 1:
        return !!documentFile;
      case 2:
        return !!selfieFile;
      case 3:
        return true; // Reference check is optional
      case 4:
        return !!documentType && !!documentFile && !!selfieFile;
      default:
        return false;
    }
  };

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    try {
      const { verificationId } = await api.analyzeDocument(new FormData());
      router.push(`/verify/analysis?id=${verificationId}`);
    } catch {
      setIsAnalyzing(false);
    }
  };

  return (
    <>
      <TopNav
        title={t('nav.verify', 'Verify Document')}
        breadcrumbs={[{ label: 'Dashboard', href: '/' }, { label: 'Verify Document' }]}
      />

      <div className="flex-1 p-6 md:p-8 max-w-4xl mx-auto w-full space-y-6">
        {/* Verification Mode Switcher */}
        <div className="flex items-center justify-between p-1.5 rounded-2xl card-warm-subtle">
          <button
            type="button"
            onClick={() => setMode('comprehensive')}
            className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
              mode === 'comprehensive'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-stone-600 dark:text-stone-300 hover:bg-white/60 dark:hover:bg-white/5'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Comprehensive Verification (5-Stage Forensic)</span>
          </button>
          <button
            type="button"
            onClick={() => setMode('quick')}
            className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
              mode === 'quick'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-stone-600 dark:text-stone-300 hover:bg-white/60 dark:hover:bg-white/5'
            }`}
          >
            <Zap className="w-4 h-4" />
            <span>Quick Screening Mode (1.4s High-Throughput)</span>
          </button>
        </div>

        {mode === 'quick' ? (
          <QuickScreenMode />
        ) : (
          <>
            {/* Step Indicator */}
            <div
              className="p-5 md:p-6 rounded-2xl border shadow-xs"
              style={{
                background: 'var(--surface)',
                borderColor: 'var(--border-color)',
              }}
            >
              <StepIndicator
                steps={steps}
                currentStep={currentStep}
                onStepClick={(index) => setCurrentStep(index)}
              />
            </div>

            {/* Step Content Container */}
            <div
              className="p-6 md:p-8 rounded-2xl border shadow-md fade-in-up"
              key={currentStep}
              style={{
                background: 'var(--surface)',
                borderColor: 'var(--border-color)',
              }}
            >
              {currentStep === 0 && (
                <DocumentTypeSelector selected={documentType} onSelect={setDocumentType} />
              )}
              {currentStep === 1 && (
                <DocumentUpload
                  file={documentFile}
                  onFileSelect={setDocumentFile}
                  onRemove={() => setDocumentFile(null)}
                />
              )}
              {currentStep === 2 && (
                <SelfieUpload
                  file={selfieFile}
                  onFileSelect={setSelfieFile}
                  onRemove={() => setSelfieFile(null)}
                />
              )}
              {currentStep === 3 && (
                <ReferenceSearch
                  onRecordFound={setReferenceRecord}
                  foundRecord={referenceRecord}
                />
              )}
              {currentStep === 4 && (
                <ReviewStep
                  documentType={documentType}
                  documentFile={documentFile}
                  selfieFile={selfieFile}
                  referenceRecord={referenceRecord}
                  onAnalyze={handleAnalyze}
                  isAnalyzing={isAnalyzing}
                />
              )}
            </div>

            {/* Navigation Step Buttons */}
            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={() => setCurrentStep((prev) => Math.max(0, prev - 1))}
                disabled={currentStep === 0}
                className="btn-secondary text-xs py-2.5 px-4"
                style={{ opacity: currentStep === 0 ? 0.3 : 1 }}
              >
                <ArrowLeft className="w-4 h-4" />
                <span>{t('btn.back', 'Back')}</span>
              </button>

              {currentStep < 4 && (
                <button
                  type="button"
                  onClick={() => setCurrentStep((prev) => Math.min(4, prev + 1))}
                  disabled={!canProceed()}
                  className="btn-primary text-xs py-2.5 px-5 font-bold"
                  style={{ opacity: canProceed() ? 1 : 0.5 }}
                >
                  <span>{currentStep === 3 ? t('btn.skip', 'Skip / Continue') : t('btn.continue', 'Continue')}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </>
  );
}
