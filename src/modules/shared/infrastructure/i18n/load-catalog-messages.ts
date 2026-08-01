import type { CatalogLocale } from '@shared/domain/i18n/user-language.helpers';
import { languageToCatalogLocale } from '@shared/domain/i18n/user-language.helpers';
import { EUserLanguage } from 'src/modules/users/domain/entities/user';

type CatalogMap<T> = Record<CatalogLocale, T>;

export function resolveCatalogMessages<T>(
  catalogs: CatalogMap<T>,
  language: EUserLanguage,
): T {
  const primary = languageToCatalogLocale(language);
  if (catalogs[primary]) {
    return catalogs[primary];
  }
  if (catalogs.en) {
    return catalogs.en;
  }
  return catalogs.ru;
}

export function getNestedString(
  messages: Record<string, unknown>,
  path: string,
): string | null {
  const parts = path.split('.');
  let current: unknown = messages;
  for (const part of parts) {
    if (current == null || typeof current !== 'object') {
      return null;
    }
    current = (current as Record<string, unknown>)[part];
  }
  return typeof current === 'string' ? current : null;
}
