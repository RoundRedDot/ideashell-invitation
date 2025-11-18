import { Locale } from "@/i18n/config";

/**
 * Common locale variants that should redirect to supported locales
 * Maps variant paths to their canonical supported locale
 */
export const LOCALE_VARIANTS: Record<string, Locale> = {
  // Chinese variants
  'zh': 'zh-CN',           // Generic Chinese -> Simplified
  'zh-Hans': 'zh-CN',       // Simplified Chinese script
  'zh-Hans-CN': 'zh-CN',    // Simplified Chinese with region
  'zh-Hant': 'zh-TW',       // Traditional Chinese script
  'zh-Hant-TW': 'zh-TW',    // Traditional Chinese Taiwan
  'zh-Hant-HK': 'zh-TW',    // Traditional Chinese Hong Kong
  'zh-HK': 'zh-TW',         // Hong Kong -> Traditional
  'zh-MO': 'zh-TW',         // Macau -> Traditional
  'zh-SG': 'zh-CN',         // Singapore -> Simplified
  'chi': 'zh-CN',           // ISO 639-2/T
  'zho': 'zh-CN',           // ISO 639-2/B

  // Japanese variants
  'ja-JP': 'ja',
  'jpn': 'ja',              // ISO 639-2

  // English variants
  'en-US': 'en',
  'en-GB': 'en',
  'en-CA': 'en',
  'en-AU': 'en',
  'en-NZ': 'en',
  'en-IN': 'en',
  'en-SG': 'en',
  'eng': 'en',              // ISO 639-2

  // Spanish variants
  'es-ES': 'es',
  'es-MX': 'es',
  'es-AR': 'es',
  'es-CO': 'es',
  'es-CL': 'es',
  'es-PE': 'es',
  'spa': 'es',              // ISO 639-2

  // Portuguese variants
  'pt': 'pt-BR',
  'pt-PT': 'pt-BR',         // Portugal Portuguese -> Brazilian
  'por': 'pt-BR',           // ISO 639-2

  // French variants
  'fr-FR': 'fr',
  'fr-CA': 'fr',
  'fr-BE': 'fr',
  'fr-CH': 'fr',
  'fra': 'fr',              // ISO 639-2/T
  'fre': 'fr',              // ISO 639-2/B

  // German variants
  'de-DE': 'de',
  'de-AT': 'de',
  'de-CH': 'de',
  'ger': 'de',              // ISO 639-2/T
  'deu': 'de',              // ISO 639-2/B
};

/**
 * Get all locale paths that should be statically generated
 * Includes both supported locales and common variants
 */
export function getAllStaticLocalePaths(): string[] {
  // Get all variant keys
  const variants = Object.keys(LOCALE_VARIANTS);

  // Return all variants (supported locales are already in generateStaticParams)
  return variants;
}

/**
 * Check if a locale is a variant that needs redirection
 */
export function isLocaleVariant(locale: string): boolean {
  return locale in LOCALE_VARIANTS;
}

/**
 * Get the canonical locale for a variant
 */
export function getCanonicalLocale(variant: string): Locale | null {
  return LOCALE_VARIANTS[variant] || null;
}