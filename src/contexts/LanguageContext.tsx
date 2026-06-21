import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import type { LanguageOption, SupportedLanguage } from '../types';
import { getItem, setItem } from '../services/storage';

export const LANGUAGES = [
  { code: "en", label: "English", nativeLabel: "English" },
  { code: "hi", label: "Hindi", nativeLabel: "हिन्दी" },
  { code: "pa", label: "Punjabi", nativeLabel: "ਪੰਜਾਬੀ" },
  { code: "ta", label: "Tamil", nativeLabel: "தமிழ்" },
];

interface LanguageContextValue {
  language: SupportedLanguage;
  setLanguage: (lang: SupportedLanguage) => void;
  languages: LanguageOption[];
  isTranslating: boolean;
  setIsTranslating: (v: boolean) => void;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);
const LANG_KEY = 'selected_language';

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<SupportedLanguage>(() =>
    getItem<SupportedLanguage>(LANG_KEY, 'en')
  );
  const [isTranslating, setIsTranslating] = useState(false);

  const setLanguage = useCallback((lang: SupportedLanguage) => {
    setLanguageState(lang);
    setItem(LANG_KEY, lang);
  }, []);

  const value = useMemo(
    () => ({
      language,
      setLanguage,
      languages: LANGUAGES,
      isTranslating,
      setIsTranslating,
    }),
    [language, setLanguage, isTranslating]
  );

  return (
    <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
  );
}

export function useLanguage(): LanguageContextValue {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider');
  return ctx;
}
