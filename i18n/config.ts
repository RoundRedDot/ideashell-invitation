/**
 * i18n Configuration
 * Defines supported locales and default locale
 */

export const locales = [
  'en',      // English
  'zh-CN',   // Simplified Chinese
  'zh-TW',   // Traditional Chinese
  'ja',      // Japanese
  'es',      // Spanish
  'pt-BR',   // Portuguese (Brazil)
  'fr',      // French
  'de'       // German
] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = 'en';

export const localeLabels: Record<Locale, string> = {
  en: 'English',
  'zh-CN': '简体中文',
  'zh-TW': '繁體中文',
  ja: '日本語',
  es: 'Español',
  'pt-BR': 'Português (Brasil)',
  fr: 'Français',
  de: 'Deutsch'
};
