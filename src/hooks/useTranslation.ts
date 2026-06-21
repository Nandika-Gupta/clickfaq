import { useLanguage } from "../contexts/LanguageContext";
import { UI_TRANSLATIONS } from "../data/translations";

export function useTranslation() {
  const { language } = useLanguage();

  return (
    UI_TRANSLATIONS[language as keyof typeof UI_TRANSLATIONS] ??
    UI_TRANSLATIONS.en
  );
}