import type { CatalogLocale } from '@shared/domain/i18n/user-language.helpers';
import type { EmailMessages } from './email-messages.types';
import { emailMessagesEn } from './en';
import { emailMessagesRu } from './ru';

/** Non-RU/EN locales use EN placeholders until proper translations exist. */
export const EMAIL_MESSAGE_CATALOGS: Record<CatalogLocale, EmailMessages> = {
  ru: emailMessagesRu,
  en: emailMessagesEn,
  es: emailMessagesEn,
  zh: emailMessagesEn,
  ar: emailMessagesEn,
  fr: emailMessagesEn,
  de: emailMessagesEn,
  pt: emailMessagesEn,
  ja: emailMessagesEn,
  hi: emailMessagesEn,
};

export type {
  EmailActionMessages,
  EmailMessages,
} from './email-messages.types';
