'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Shield,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  KeyRound,
  FileCheck2,
  ScanFace,
  UserCheck,
} from 'lucide-react';
import TopNav from '@/components/layout/TopNav';
import { useLanguage } from '@/context/LanguageContext';

export default function LoginPage() {
  const router = useRouter();
  const { t } = useLanguage();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please enter both your work email and security password.');
      return;
    }
    setError(null);
    setIsLoading(true);

    // Mock authentication transition
    setTimeout(() => {
      setIsLoading(false);
      setSuccess(true);
      setTimeout(() => {
        router.push('/');
      }, 700);
    }, 900);
  };

  const handleDemoLogin = () => {
    setEmail('analyst@veridoc.ai');
    setPassword('demopassword123');
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setSuccess(true);
      setTimeout(() => {
        router.push('/');
      }, 500);
    }, 600);
  };

  return (
    <>
      <TopNav title="Sign In & Security Access" />

      <div className="flex-1 flex items-center justify-center p-6 md:p-12 max-w-6xl mx-auto w-full">
        <div
          className="grid grid-cols-1 lg:grid-cols-12 rounded-3xl border shadow-2xl overflow-hidden w-full max-w-5xl fade-in-up"
          style={{
            background: 'var(--surface)',
            borderColor: 'var(--border-color)',
          }}
        >
          {/* Left Column: Brand Story & Security Visual (5 cols) */}
          <div
            className="lg:col-span-5 p-8 md:p-10 flex flex-col justify-between border-b lg:border-b-0 lg:border-r relative overflow-hidden"
            style={{
              background: 'var(--gradient-warm-hero)',
              borderColor: 'var(--border-color)',
            }}
          >
            {/* Ambient Background Glows */}
            <div
              className="absolute -top-20 -left-20 w-64 h-64 rounded-full blur-3xl opacity-20 pointer-events-none"
              style={{ background: 'var(--accent)' }}
            />

            <div className="space-y-6 relative z-10">
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center shadow-md"
                  style={{
                    background: 'var(--gradient-accent)',
                    color: '#FFFFFF',
                  }}
                >
                  <Shield className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-extrabold tracking-tight" style={{ color: 'var(--text-primary)' }}>
                    VERIDOC <span style={{ color: 'var(--accent)' }}>AI</span>
                  </h2>
                  <p className="text-[10px] uppercase font-bold tracking-widest" style={{ color: 'var(--text-muted)' }}>
                    Identity Intelligence Platform
                  </p>
                </div>
              </div>

              <div className="space-y-2 pt-4">
                <span className="editorial-label">Evidence-Driven Trust</span>
                <h3 className="text-2xl md:text-3xl font-extrabold tracking-tight leading-snug" style={{ color: 'var(--text-primary)' }}>
                  Intelligence built around verifiable evidence.
                </h3>
                <p className="text-xs md:text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                  Protect your organization from counterfeit credentials, synthetic identities, and biometric spoofing with real-time multi-modal forensics.
                </p>
              </div>

              {/* Security feature list */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center gap-3 p-3 rounded-xl card-warm-subtle">
                  <FileCheck2 className="w-4 h-4 text-[#C85A32]" />
                  <div>
                    <p className="text-xs font-bold" style={{ color: 'var(--text-primary)' }}>Multi-Modal OCR & MRZ</p>
                    <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>Cross-format structural parsing</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-xl card-warm-subtle">
                  <ScanFace className="w-4 h-4 text-[#C85A32]" />
                  <div>
                    <p className="text-xs font-bold" style={{ color: 'var(--text-primary)' }}>1:1 Facial Geometry Match</p>
                    <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>Anti-spoofing liveness verification</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-8 relative z-10 text-[11px] flex items-center justify-between" style={{ color: 'var(--text-muted)' }}>
              <span>Enterprise Grade Security</span>
              <span>v2.4.0 (API Ready)</span>
            </div>
          </div>

          {/* Right Column: Authentication Form (7 cols) */}
          <div className="lg:col-span-7 p-8 md:p-12 flex flex-col justify-center space-y-6">
            <div>
              <span className="editorial-label">Authentication</span>
              <h2 className="text-2xl font-extrabold tracking-tight mt-1" style={{ color: 'var(--text-primary)' }}>
                Welcome back.
              </h2>
              <p className="text-xs md:text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
                Secure verification starts here. Enter your security credentials.
              </p>
            </div>

            {error && (
              <div
                className="p-3.5 rounded-xl border text-xs font-medium fade-in-up"
                style={{
                  background: 'var(--risk-high-bg)',
                  borderColor: 'rgba(166, 44, 44, 0.3)',
                  color: 'var(--risk-high)',
                }}
              >
                {error}
              </div>
            )}

            {success && (
              <div
                className="p-3.5 rounded-xl border text-xs font-bold flex items-center gap-2 fade-in-up"
                style={{
                  background: 'var(--risk-low-bg)',
                  borderColor: 'rgba(45, 122, 77, 0.3)',
                  color: 'var(--risk-low)',
                }}
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Authentication successful. Redirecting to workspace...</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Work Email */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider block" style={{ color: 'var(--text-secondary)' }}>
                  Work Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="analyst@enterprise.com"
                  className="input text-sm"
                  required
                />
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold uppercase tracking-wider block" style={{ color: 'var(--text-secondary)' }}>
                    Password
                  </label>
                  <a href="#" className="text-xs font-semibold hover:underline" style={{ color: 'var(--accent)' }}>
                    Forgot password?
                  </a>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="input text-sm pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Remember Me */}
              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 cursor-pointer text-xs" style={{ color: 'var(--text-secondary)' }}>
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded text-amber-600 focus:ring-amber-500"
                  />
                  <span>Remember this terminal session</span>
                </label>
              </div>

              {/* Submit Buttons */}
              <div className="pt-3 space-y-3">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="btn-primary w-full justify-center py-3.5 text-sm font-bold shadow-lg"
                >
                  <KeyRound className="w-4 h-4" />
                  <span>{isLoading ? 'Verifying Credentials...' : 'Sign In to Workspace'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleDemoLogin}
                  disabled={isLoading}
                  className="btn-secondary w-full justify-center py-3 text-xs font-bold"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                  <span>Quick Access with Demo Account</span>
                </button>
              </div>
            </form>

            <p className="text-[11px] text-center" style={{ color: 'var(--text-muted)' }}>
              Protected by VeriDoc AI session tokens & end-to-end encryption.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
