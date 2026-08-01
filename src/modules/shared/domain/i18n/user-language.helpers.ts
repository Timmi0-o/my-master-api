import { EUserLanguage } from 'src/modules/users/domain/entities/user';

const BCP47_BY_LANGUAGE: Record<EUserLanguage, string> = {
  [EUserLanguage.RU]: 'ru-RU',
  [EUserLanguage.EN]: 'en-US',
  [EUserLanguage.ES]: 'es-ES',
  [EUserLanguage.ZH]: 'zh-CN',
  [EUserLanguage.AR]: 'ar-SA',
  [EUserLanguage.FR]: 'fr-FR',
  [EUserLanguage.DE]: 'de-DE',
  [EUserLanguage.PT]: 'pt-PT',
  [EUserLanguage.JA]: 'ja-JP',
  [EUserLanguage.HI]: 'hi-IN',
};

export const CATALOG_LOCALES = [
  'ru',
  'en',
  'es',
  'zh',
  'ar',
  'fr',
  'de',
  'pt',
  'ja',
  'hi',
] as const;

export type CatalogLocale = (typeof CATALOG_LOCALES)[number];

export function languageToCatalogLocale(language: EUserLanguage): CatalogLocale {
  const locale = language.toLowerCase() as CatalogLocale;
  return CATALOG_LOCALES.includes(locale) ? locale : 'en';
}

export function toBcp47Locale(language: EUserLanguage): string {
  return BCP47_BY_LANGUAGE[language] ?? 'en-US';
}

const USER_LANGUAGES = new Set<string>(Object.values(EUserLanguage));

export function resolveLanguageWithFallback(
  language: EUserLanguage | null | undefined,
): EUserLanguage {
  if (language && USER_LANGUAGES.has(language)) {
    return language;
  }
  return EUserLanguage.RU;
}

export function formatDateForLanguage(
  date: Date,
  language: EUserLanguage,
): string {
  return date.toLocaleDateString(toBcp47Locale(language), {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}
