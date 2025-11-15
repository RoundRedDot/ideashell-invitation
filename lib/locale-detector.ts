/**
 * Locale Detection Utility
 *
 * Provides unified language detection from multiple sources:
 * 1. User-Agent string (ideaShell app)
 * 2. Browser navigator.language API (fallback)
 *
 * Maps detected languages to supported locales.
 */

import { UAParser } from './ua-parser';
import { Locale, locales, defaultLocale } from '@/i18n/config';

/**
 * Language code mapping to supported locales
 * Maps various language codes to our supported locales
 */
const LANGUAGE_MAPPING: Record<string, Locale> = {
  // Chinese variants
  'zh_CN': 'zh-CN',
  'zh-CN': 'zh-CN',
  'zh': 'zh-CN',
  'zh_Hans': 'zh-CN',
  'zh_SG': 'zh-CN',  // Singapore Chinese -> Simplified

  'zh_TW': 'zh-TW',
  'zh-TW': 'zh-TW',
  'zh_HK': 'zh-TW',  // Hong Kong -> Traditional
  'zh_MO': 'zh-TW',  // Macau -> Traditional
  'zh_Hant': 'zh-TW',

  // Japanese
  'ja': 'ja',
  'ja_JP': 'ja',

  // Spanish
  'es': 'es',
  'es_ES': 'es',
  'es_MX': 'es',
  'es_AR': 'es',
  'es_CO': 'es',
  'es_CL': 'es',
  'es_PE': 'es',
  'es_VE': 'es',
  'es_EC': 'es',
  'es_GT': 'es',
  'es_CU': 'es',
  'es_BO': 'es',
  'es_DO': 'es',
  'es_HN': 'es',
  'es_PY': 'es',
  'es_SV': 'es',
  'es_NI': 'es',
  'es_CR': 'es',
  'es_PA': 'es',
  'es_UY': 'es',
  'es_PR': 'es',

  // Portuguese
  'pt': 'pt-BR',
  'pt_BR': 'pt-BR',
  'pt-BR': 'pt-BR',
  'pt_PT': 'pt-BR',  // Portugal Portuguese -> Brazilian Portuguese

  // French
  'fr': 'fr',
  'fr_FR': 'fr',
  'fr_BE': 'fr',
  'fr_CA': 'fr',
  'fr_CH': 'fr',
  'fr_LU': 'fr',
  'fr_MC': 'fr',

  // German
  'de': 'de',
  'de_DE': 'de',
  'de_AT': 'de',
  'de_CH': 'de',
  'de_LU': 'de',
  'de_LI': 'de',

  // English (default for any unmapped language)
  'en': 'en',
  'en_US': 'en',
  'en_GB': 'en',
  'en_CA': 'en',
  'en_AU': 'en',
  'en_NZ': 'en',
  'en_IE': 'en',
  'en_ZA': 'en',
  'en_IN': 'en',
  'en_SG': 'en',
  'en_HK': 'en',
};

export interface LocaleDetectionResult {
  /**
   * The detected locale that matches our supported locales
   */
  locale: Locale;

  /**
   * The original language code detected
   */
  originalLanguage?: string;

  /**
   * The source of the detection
   */
  source: 'user-agent' | 'navigator' | 'default';

  /**
   * Whether the device is ideaShell
   */
  isIdeaShell: boolean;
}

/**
 * Normalize language code to match our mapping keys
 * Converts various formats to underscore format
 */
function normalizeLanguageCode(lang: string): string {
  // Replace hyphens with underscores
  let normalized = lang.replace(/-/g, '_');

  // Handle special cases for Chinese
  if (normalized === 'zh_Hans_CN') normalized = 'zh_CN';
  if (normalized === 'zh_Hant_TW') normalized = 'zh_TW';
  if (normalized === 'zh_Hant_HK') normalized = 'zh_HK';

  return normalized;
}

/**
 * Map language code to supported locale
 */
function mapLanguageToLocale(language: string): Locale | null {
  // Normalize the language code
  const normalized = normalizeLanguageCode(language);

  // Try exact match
  if (normalized in LANGUAGE_MAPPING) {
    return LANGUAGE_MAPPING[normalized];
  }

  // Try language part only (e.g., 'en' from 'en_US')
  const langPart = normalized.split('_')[0];
  if (langPart in LANGUAGE_MAPPING) {
    return LANGUAGE_MAPPING[langPart];
  }

  // Special handling for Chinese detection
  if (langPart === 'zh') {
    // Check for traditional Chinese indicators
    if (normalized.includes('TW') || normalized.includes('HK') ||
        normalized.includes('MO') || normalized.includes('Hant')) {
      return 'zh-TW';
    }
    // Default to simplified
    return 'zh-CN';
  }

  return null;
}

/**
 * Detect locale from User-Agent string
 */
export function detectLocaleFromUA(userAgent?: string): LocaleDetectionResult {
  const ua = userAgent || (typeof navigator !== 'undefined' ? navigator.userAgent : '');
  const parser = new UAParser();
  const uaInfo = parser.parse(ua);

  // Check if it's ideaShell
  const isIdeaShell = uaInfo.isIdeaShell;

  // Try to get language from User-Agent
  if (uaInfo.language) {
    const locale = mapLanguageToLocale(uaInfo.language);
    if (locale) {
      return {
        locale,
        originalLanguage: uaInfo.language,
        source: 'user-agent',
        isIdeaShell,
      };
    }
  }

  // Fall back to navigator.language if available
  if (typeof navigator !== 'undefined') {
    const langs = navigator.languages || [navigator.language];

    for (const lang of langs) {
      if (lang) {
        const locale = mapLanguageToLocale(lang);
        if (locale) {
          return {
            locale,
            originalLanguage: lang,
            source: 'navigator',
            isIdeaShell,
          };
        }
      }
    }
  }

  // Default to English
  return {
    locale: defaultLocale,
    source: 'default',
    isIdeaShell,
  };
}

/**
 * Hook for locale detection (client-side only)
 */
export function useLocaleDetection(): LocaleDetectionResult | undefined {
  if (typeof window === 'undefined') {
    return undefined;
  }

  return detectLocaleFromUA();
}

/**
 * Get preferred locale based on User-Agent
 * This is the main function to use for locale detection
 */
export function getPreferredLocale(userAgent?: string): Locale {
  const result = detectLocaleFromUA(userAgent);
  return result.locale;
}

/**
 * Check if a locale preference is from ideaShell app
 */
export function isLocaleFromIdeaShell(userAgent?: string): boolean {
  const result = detectLocaleFromUA(userAgent);
  return result.isIdeaShell && result.source === 'user-agent';
}

/**
 * Validate if a locale is supported
 */
export function isValidLocale(locale: string): locale is Locale {
  return locales.includes(locale as Locale);
}

/**
 * Get locale with fallback
 */
export function getLocaleWithFallback(preferredLocale?: string): Locale {
  if (preferredLocale && isValidLocale(preferredLocale)) {
    return preferredLocale;
  }

  // Try to detect from UA
  return getPreferredLocale();
}