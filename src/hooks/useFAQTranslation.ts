import { useEffect, useState } from 'react';
import type { FAQ, SupportedLanguage } from '../types';
import { translateBatch } from '../services/translation';

interface TranslatedFAQ {
  question: string;
  answer: string;
}

export function useFAQTranslation(
  faqs: FAQ[],
  language: SupportedLanguage,
  setIsTranslating: (v: boolean) => void
): Record<string, TranslatedFAQ> {
  const [translations, setTranslations] = useState<Record<string, TranslatedFAQ>>({});

  useEffect(() => {
    if (language === 'en') {
      setTranslations({});
      setIsTranslating(false);
      return;
    }

    let cancelled = false;

    async function translate() {
      setIsTranslating(true);
      const questions = faqs.map((f) => f.question);
      const answers = faqs.map((f) => f.answer);

      try {
        const [translatedQuestions, translatedAnswers] = await Promise.all([
          translateBatch(questions, language),
          translateBatch(answers, language),
        ]);

        if (cancelled) return;

        const result: Record<string, TranslatedFAQ> = {};
        faqs.forEach((faq, i) => {
          result[faq.id] = {
            question: translatedQuestions[i] ?? faq.question,
            answer: translatedAnswers[i] ?? faq.answer,
          };
        });
        setTranslations(result);
      } catch {
        if (!cancelled) setTranslations({});
      } finally {
        if (!cancelled) setIsTranslating(false);
      }
    }

    translate();
    return () => {
      cancelled = true;
    };
  }, [faqs, language, setIsTranslating]);

  return translations;
}
