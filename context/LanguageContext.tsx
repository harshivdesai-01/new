'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

export type Language = 'en' | 'hi';

interface Translations {
  [key: string]: {
    en: string;
    hi: string;
  };
}

export const dictionary: Translations = {
  // Navigation
  'nav.dashboard': { en: 'Dashboard', hi: 'डैशबोर्ड' },
  'nav.verify': { en: 'Verify Document', hi: 'दस्तावेज़ सत्यापन' },
  'nav.history': { en: 'Verification History', hi: 'सत्यापन इतिहास' },
  'nav.reports': { en: 'Reports', hi: 'रिपोर्ट्स' },
  'nav.modelInsights': { en: 'Model Insights', hi: 'मॉडल इनसाइट्स' },
  'nav.settings': { en: 'Settings', hi: 'सेटिंग्स' },
  'nav.login': { en: 'Sign In / Account', hi: 'साइन इन / खाता' },
  'nav.systemOnline': { en: 'Verification Engine Online', hi: 'सत्यापन इंजन सक्रिय है' },

  // Dashboard Hero & Headlines
  'hero.tagline': { en: 'IDENTITY INTELLIGENCE & FORENSICS', hi: 'पहचान विश्लेषण और फोरेंसिक' },
  'hero.headline': { en: 'Know before you approve.', hi: 'स्वीकृति से पहले सत्य जानें।' },
  'hero.subtitle': { en: 'Verify identity documents, detect tampering, and cross-reference records with multi-modal AI models in seconds.', hi: 'दस्तावेज़ों का सत्यापन करें, छेड़छाड़ का पता लगाएं और रिकॉर्ड्स की जांच करें।' },
  'hero.startVerification': { en: 'Start Verification', hi: 'सत्यापन शुरू करें' },
  'hero.viewHistory': { en: 'View History', hi: 'इतिहास देखें' },

  // Stats
  'stat.totalVerifications': { en: 'Documents Verified', hi: 'सत्यापित दस्तावेज़' },
  'stat.highRisk': { en: 'High Risk Detected', hi: 'उच्च जोखिम पाए गए' },
  'stat.authentic': { en: 'Likely Authentic', hi: 'प्रमाणिक दस्तावेज़' },
  'stat.review': { en: 'Manual Review Needed', hi: 'समीक्षा आवश्यक' },
  'stat.vsLastWeek': { en: 'vs. last week', hi: 'पिछले सप्ताह की तुलना में' },

  // Verification Steps
  'step.docType': { en: 'Document Type', hi: 'दस्तावेज़ प्रकार' },
  'step.uploadDoc': { en: 'Upload Document', hi: 'दस्तावेज़ अपलोड' },
  'step.uploadSelfie': { en: 'Upload Selfie', hi: 'सेल्फ़ी अपलोड' },
  'step.reference': { en: 'Reference Check', hi: 'रेफरेंस जांच' },
  'step.review': { en: 'Review & Analyze', hi: 'समीक्षा और विश्लेषण' },

  // Actions & Buttons
  'btn.continue': { en: 'Continue', hi: 'आगे बढ़ें' },
  'btn.back': { en: 'Back', hi: 'पीछे जाएं' },
  'btn.skip': { en: 'Skip / Continue', hi: 'छोड़ें / आगे बढ़ें' },
  'btn.analyze': { en: 'Analyze Document', hi: 'दस्तावेज़ का विश्लेषण करें' },
  'btn.analyzing': { en: 'Starting Analysis...', hi: 'विश्लेषण शुरू हो रहा है...' },
  'btn.save': { en: 'Save Settings', hi: 'सेटिंग्स सहेजें' },
  'btn.export': { en: 'Export Report', hi: 'रिपोर्ट निर्यात करें' },
  'btn.downloadPdf': { en: 'Download PDF', hi: 'पीडीएफ डाउनलोड करें' },
  'btn.print': { en: 'Print', hi: 'प्रिंट करें' },
  'btn.share': { en: 'Share', hi: 'साझा करें' },
  'btn.signIn': { en: 'Sign In', hi: 'साइन इन करें' },
  'btn.demoMode': { en: 'Demo Mode', hi: 'डेमो मोड' },
  'btn.whyFlagged': { en: 'Why was this flagged?', hi: 'यह ध्वजांकित क्यों किया गया?' },
  'btn.unlock': { en: 'Unlock Session', hi: 'सत्र अनलॉक करें' },
  'btn.continueSession': { en: 'Continue Session', hi: 'सत्र जारी रखें' },
  'btn.lockNow': { en: 'Lock Now', hi: 'अभी लॉक करें' },

  // Risk Levels
  'risk.low': { en: 'Low Risk — Likely Authentic', hi: 'कम जोखिम — प्रमाणिक' },
  'risk.review': { en: 'Review Required — Suspicious Indicators', hi: 'समीक्षा आवश्यक — संदिग्ध संकेत' },
  'risk.high': { en: 'High Risk — Possible Fraud Detected', hi: 'उच्च जोखिम — संभावित धोखाधड़ी' },
  'risk.score': { en: 'Risk Score', hi: 'जोखिम स्कोर' },

  // Auto-Lock
  'lock.warningTitle': { en: 'Inactivity Warning', hi: 'निष्क्रियता चेतावनी' },
  'lock.warningMessage': { en: 'Your verification session will lock in 30 seconds to protect sensitive document information.', hi: 'संवेदनशील दस्तावेज़ जानकारी की सुरक्षा के लिए आपका सत्र 30 सेकंड में लॉक हो जाएगा।' },
  'lock.lockedTitle': { en: 'Verification Session Locked', hi: 'सत्यापन सत्र लॉक है' },
  'lock.lockedMessage': { en: 'Document data is hidden for security. Click unlock to resume your session.', hi: 'सुरक्षा के लिए दस्तावेज़ डेटा छुपाया गया है। पुनः आरंभ करने के लिए अनलॉक करें।' },

  // Settings
  'settings.appearance': { en: 'Appearance & Localization', hi: 'दिखावट और भाषा' },
  'settings.theme': { en: 'Theme Mode', hi: 'थीम मोड' },
  'settings.language': { en: 'System Language', hi: 'सिस्टम भाषा' },
  'settings.security': { en: 'Security & Auto-Lock', hi: 'सुरक्षा और ऑटो-लॉक' },
  'settings.autoLock': { en: 'Auto-Lock Sensitive Documents', hi: 'संवेदनशील दस्तावेज़ स्वतः लॉक करें' },
  'settings.lockDuration': { en: 'Lock after inactivity', hi: 'निष्क्रियता के बाद लॉक करें' },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, defaultText?: string) => string;
}

const LanguageContext = createContext<LanguageContextType>({
  language: 'en',
  setLanguage: () => {},
  t: (key: string, defaultText?: string) => defaultText || key,
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>('en');

  useEffect(() => {
    const stored = localStorage.getItem('veridoc-lang') as Language | null;
    if (stored === 'en' || stored === 'hi') {
      setLanguageState(stored);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('veridoc-lang', lang);
  };

  const t = (key: string, defaultText?: string): string => {
    const entry = dictionary[key];
    if (entry && entry[language]) {
      return entry[language];
    }
    return defaultText || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
