import type { SupportedLanguage, TranslationCache } from '../types';
import { getItem, setItem } from './storage';

const CACHE_KEY = 'translation_cache';
const API_URL = 'https://translation.googleapis.com/language/translate/v2';

function getCache(): TranslationCache {
  return getItem<TranslationCache>(CACHE_KEY, {});
}

function setCacheEntry(key: string, value: string): void {
  const cache = getCache();
  cache[key] = value;
  setItem(CACHE_KEY, cache);
}

function cacheKey(text: string, target: SupportedLanguage): string {
  return `${target}:${text.slice(0, 100)}:${text.length}`;
}

export async function translateText(
  text: string,
  targetLang: SupportedLanguage,
  sourceLang: SupportedLanguage = 'en'
): Promise<string> {
  if (targetLang === sourceLang || !text.trim()) return text;

  const key = cacheKey(text, targetLang);
  const cache = getCache();
  if (cache[key]) return cache[key];

  const apiKey = import.meta.env.VITE_GOOGLE_TRANSLATE_API_KEY as string | undefined;

  if (!apiKey) {
    console.warn('VITE_GOOGLE_TRANSLATE_API_KEY not set — returning original text');
    return text;
  }

  try {
    const params = new URLSearchParams({
      key: apiKey,
      q: text,
      target: targetLang,
      source: sourceLang,
      format: 'text',
    });

    const response = await fetch(`${API_URL}?${params}`, { method: 'POST' });

    if (!response.ok) {
      throw new Error(`Translation API error: ${response.status}`);
    }

    const data = await response.json();
    const translated: string =
      data?.data?.translations?.[0]?.translatedText ?? text;

    setCacheEntry(key, translated);
    return translated;
  } catch (error) {
    console.error('Translation failed, falling back to English:', error);
    return text;
  }
}

export async function translateBatch(
  texts: string[],
  targetLang: SupportedLanguage,
  onProgress?: (completed: number, total: number) => void
): Promise<string[]> {
  if (targetLang === 'en') return texts;

  const results: string[] = [];
  const uncached: { index: number; text: string }[] = [];

  const cache = getCache();
  for (let i = 0; i < texts.length; i++) {
    const key = cacheKey(texts[i], targetLang);
    if (cache[key]) {
      results[i] = cache[key];
    } else {
      uncached.push({ index: i, text: texts[i] });
      results[i] = '';
    }
    onProgress?.(i + 1, texts.length);
  }

  if (uncached.length === 0) return results;

  const apiKey = import.meta.env.VITE_GOOGLE_TRANSLATE_API_KEY as string | undefined;

  if (!apiKey) {
    return texts;
  }

  const BATCH_SIZE = 10;
  for (let b = 0; b < uncached.length; b += BATCH_SIZE) {
    const batch = uncached.slice(b, b + BATCH_SIZE);
    try {
      const params = new URLSearchParams({
        key: apiKey,
        target: targetLang,
        source: 'en',
        format: 'text',
      });
      batch.forEach(({ text }) => params.append('q', text));

      const response = await fetch(`${API_URL}?${params}`, { method: 'POST' });
      if (!response.ok) throw new Error(`Batch translation error: ${response.status}`);

      const data = await response.json();
      const translations: { translatedText: string }[] =
        data?.data?.translations ?? [];

      batch.forEach(({ index, text }, i) => {
        const translated = translations[i]?.translatedText ?? text;
        results[index] = translated;
        setCacheEntry(cacheKey(text, targetLang), translated);
      });
    } catch {
      batch.forEach(({ index, text }) => {
        results[index] = text;
      });
    }
    onProgress?.(Math.min(b + BATCH_SIZE, uncached.length), uncached.length);
  }

  return results;
}

export function clearTranslationCache(): void {
  setItem(CACHE_KEY, {});
}
