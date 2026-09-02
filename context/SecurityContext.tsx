'use client';

import React, { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { Lock, ShieldAlert, ShieldCheck, Clock, KeyRound } from 'lucide-react';

interface SecurityContextType {
  autoLockEnabled: boolean;
  setAutoLockEnabled: (enabled: boolean) => void;
  lockDurationMinutes: number;
  setLockDurationMinutes: (minutes: number) => void;
  isLocked: boolean;
  showWarning: boolean;
  secondsRemaining: number;
  unlockSession: () => void;
  lockNow: () => void;
  dismissWarning: () => void;
}

const SecurityContext = createContext<SecurityContextType>({
  autoLockEnabled: true,
  setAutoLockEnabled: () => {},
  lockDurationMinutes: 5,
  setLockDurationMinutes: () => {},
  isLocked: false,
  showWarning: false,
  secondsRemaining: 30,
  unlockSession: () => {},
  lockNow: () => {},
  dismissWarning: () => {},
});

// Paths containing sensitive identity & forensic documents
const SENSITIVE_PATHS = ['/verify', '/results', '/reports'];

export function SecurityProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [autoLockEnabled, setAutoLockEnabledState] = useState<boolean>(true);
  const [lockDurationMinutes, setLockDurationMinutesState] = useState<number>(5);
  const [isLocked, setIsLocked] = useState<boolean>(false);
  const [showWarning, setShowWarning] = useState<boolean>(false);
  const [secondsRemaining, setSecondsRemaining] = useState<number>(30);

  const lastActivityRef = useRef<number>(Date.now());
  const warningTimerRef = useRef<NodeJS.Timeout | null>(null);
  const countdownIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Load preferences from localStorage
  useEffect(() => {
    const storedAutoLock = localStorage.getItem('veridoc-autolock');
    if (storedAutoLock !== null) {
      setAutoLockEnabledState(storedAutoLock === 'true');
    }
    const storedDuration = localStorage.getItem('veridoc-lock-duration');
    if (storedDuration !== null) {
      setLockDurationMinutesState(parseInt(storedDuration, 10));
    }
  }, []);

  const setAutoLockEnabled = (enabled: boolean) => {
    setAutoLockEnabledState(enabled);
    localStorage.setItem('veridoc-autolock', String(enabled));
    if (!enabled) {
      setIsLocked(false);
      setShowWarning(false);
    }
  };

  const setLockDurationMinutes = (minutes: number) => {
    setLockDurationMinutesState(minutes);
    localStorage.setItem('veridoc-lock-duration', String(minutes));
  };

  const resetActivity = useCallback(() => {
    lastActivityRef.current = Date.now();
    if (showWarning) {
      setShowWarning(false);
      setSecondsRemaining(30);
      if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
    }
  }, [showWarning]);

  const lockNow = useCallback(() => {
    setIsLocked(true);
    setShowWarning(false);
    if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
  }, []);

  const unlockSession = () => {
    setIsLocked(false);
    setShowWarning(false);
    resetActivity();
  };

  const dismissWarning = () => {
    setShowWarning(false);
    resetActivity();
  };

  // Activity listeners
  useEffect(() => {
    if (!autoLockEnabled || isLocked) return;

    const handleActivity = () => {
      resetActivity();
    };

    window.addEventListener('mousemove', handleActivity, { passive: true });
    window.addEventListener('keydown', handleActivity, { passive: true });
    window.addEventListener('click', handleActivity, { passive: true });
    window.addEventListener('touchstart', handleActivity, { passive: true });

    return () => {
      window.removeEventListener('mousemove', handleActivity);
      window.removeEventListener('keydown', handleActivity);
      window.removeEventListener('click', handleActivity);
      window.removeEventListener('touchstart', handleActivity);
    };
  }, [autoLockEnabled, isLocked, resetActivity]);

  // Periodic inactivity check
  useEffect(() => {
    if (!autoLockEnabled || isLocked) return;

    const interval = setInterval(() => {
      const elapsedMs = Date.now() - lastActivityRef.current;
      const totalTimeoutMs = lockDurationMinutes * 60 * 1000;
      const warningStartMs = Math.max(0, totalTimeoutMs - 30 * 1000);

      if (elapsedMs >= totalTimeoutMs) {
        lockNow();
      } else if (elapsedMs >= warningStartMs && !showWarning) {
        setShowWarning(true);
        const remaining = Math.ceil((totalTimeoutMs - elapsedMs) / 1000);
        setSecondsRemaining(remaining > 0 ? remaining : 30);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [autoLockEnabled, isLocked, lockDurationMinutes, showWarning, lockNow]);

  // Countdown timer when warning is active
  useEffect(() => {
    if (showWarning && !isLocked) {
      countdownIntervalRef.current = setInterval(() => {
        setSecondsRemaining((prev) => {
          if (prev <= 1) {
            lockNow();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
    }

    return () => {
      if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
    };
  }, [showWarning, isLocked, lockNow]);

  const isSensitivePage = SENSITIVE_PATHS.some((path) => pathname?.startsWith(path));

  return (
    <SecurityContext.Provider
      value={{
        autoLockEnabled,
        setAutoLockEnabled,
        lockDurationMinutes,
        setLockDurationMinutes,
        isLocked,
        showWarning,
        secondsRemaining,
        unlockSession,
        lockNow,
        dismissWarning,
      }}
    >
      {children}

      {/* Warning Modal */}
      {showWarning && !isLocked && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm fade-in-up">
          <div
            className="w-full max-w-md p-6 rounded-2xl border shadow-2xl space-y-4"
            style={{
              background: 'var(--surface)',
              borderColor: 'var(--risk-review)',
            }}
          >
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: 'var(--risk-review-bg)', color: 'var(--risk-review)' }}
              >
                <Clock className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <h3 className="text-base font-bold" style={{ color: 'var(--text-primary)' }}>
                  Inactivity Warning
                </h3>
                <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                  Locking in <span className="font-bold text-amber-500">{secondsRemaining}s</span>
                </p>
              </div>
            </div>

            <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              Your verification session will be locked automatically to protect sensitive document credentials and biometric data.
            </p>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button onClick={lockNow} className="btn-secondary text-xs py-2 px-3">
                <Lock className="w-3.5 h-3.5" />
                Lock Now
              </button>
              <button onClick={dismissWarning} className="btn-primary text-xs py-2 px-4">
                <ShieldCheck className="w-3.5 h-3.5" />
                Continue Session
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Locked Full-Screen Overlay for Sensitive Pages */}
      {isLocked && isSensitivePage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md fade-in-up">
          <div
            className="w-full max-w-md p-8 rounded-2xl border text-center space-y-5 shadow-2xl"
            style={{
              background: 'var(--surface)',
              borderColor: 'rgba(200, 90, 50, 0.3)',
            }}
          >
            <div
              className="w-16 h-16 rounded-2xl mx-auto flex items-center justify-center"
              style={{ background: 'var(--accent-light)', color: 'var(--accent)' }}
            >
              <Lock className="w-8 h-8" />
            </div>

            <div>
              <span className="editorial-label">Protected Session</span>
              <h2 className="text-xl font-bold mt-1" style={{ color: 'var(--text-primary)' }}>
                Verification Session Locked
              </h2>
              <p className="text-xs mt-2 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                Sensitive document and biometric information is protected. Click below to resume your verification session.
              </p>
            </div>

            <div className="pt-2">
              <button
                onClick={unlockSession}
                className="btn-primary w-full justify-center py-3 text-sm"
              >
                <KeyRound className="w-4 h-4" />
                Unlock Verification Session
              </button>
            </div>

            <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>
              Auto-lock preferences can be customized in Settings.
            </p>
          </div>
        </div>
      )}
    </SecurityContext.Provider>
  );
}

export function useSecurity() {
  return useContext(SecurityContext);
}
