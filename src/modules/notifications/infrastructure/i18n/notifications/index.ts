import type { CatalogLocale } from '@shared/domain/i18n/user-language.helpers';
import type { NotificationMessages } from './notification-messages.types';
import { notificationMessagesEn } from './en';
import { notificationMessagesRu } from './ru';

/** Non-RU/EN locales use EN placeholders until proper translations exist. */
export const NOTIFICATION_MESSAGE_CATALOGS: Record<
  CatalogLocale,
  NotificationMessages
> = {
  ru: notificationMessagesRu,
  en: notificationMessagesEn,
  es: notificationMessagesEn,
  zh: notificationMessagesEn,
  ar: notificationMessagesEn,
  fr: notificationMessagesEn,
  de: notificationMessagesEn,
  pt: notificationMessagesEn,
  ja: notificationMessagesEn,
  hi: notificationMessagesEn,
};

export type { NotificationMessages } from './notification-messages.types';
