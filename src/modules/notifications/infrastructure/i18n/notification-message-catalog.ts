import { Inject, Injectable } from '@nestjs/common';
import { formatDateForLanguage } from '@shared/domain/i18n/user-language.helpers';
import {
  TEMPLATE_RENDERER_TOKEN,
  type ITemplateRenderer,
} from '@shared/domain/templating';
import { resolveCatalogMessages } from '@shared/infrastructure/i18n/load-catalog-messages';
import type { EAppointmentReminderJobType } from 'src/modules/appointments/domain/entities/appointment-reminder-job';
import { NotificationType } from 'src/modules/notifications/domain/entities/notification';
import { EUserLanguage } from 'src/modules/users/domain/entities/user';
import { NOTIFICATION_MESSAGE_CATALOGS } from './notifications';

export type NotificationCopy = {
  title: string;
  body: string;
};

type ResolveParams =
  | {
      type: NotificationType.APPOINTMENT_CREATED;
      date: Date;
    }
  | {
      type: NotificationType.APPOINTMENT_CONFIRMED;
      serviceName: string;
    }
  | {
      type: NotificationType.APPOINTMENT_CANCELLED;
      serviceName: string;
    }
  | {
      type: NotificationType.APPOINTMENT_COMPLETED;
      serviceName: string;
    }
  | {
      type: NotificationType.APPOINTMENT_NO_SHOW;
      serviceName: string;
    }
  | {
      type: NotificationType.APPOINTMENT_RESCHEDULED;
      serviceName: string;
    }
  | {
      type: NotificationType.APPOINTMENT_REMINDER;
      serviceName: string;
      reminderType: EAppointmentReminderJobType;
    }
  | {
      type: NotificationType.CHAT_MESSAGE;
      body: string;
    };

@Injectable()
export class NotificationMessageCatalog {
  constructor(
    @Inject(TEMPLATE_RENDERER_TOKEN)
    private readonly templateRenderer: ITemplateRenderer,
  ) {}

  resolve(language: EUserLanguage, params: ResolveParams): NotificationCopy {
    const messages = resolveCatalogMessages(
      NOTIFICATION_MESSAGE_CATALOGS,
      language,
    );

    switch (params.type) {
      case NotificationType.APPOINTMENT_CREATED: {
        const entry = messages.APPOINTMENT_CREATED;
        return {
          title: entry.title,
          body: this.templateRenderer.renderString(entry.body, {
            date: formatDateForLanguage(params.date, language),
          }),
        };
      }
      case NotificationType.APPOINTMENT_CONFIRMED: {
        const entry = messages.APPOINTMENT_CONFIRMED;
        return {
          title: entry.title,
          body: this.templateRenderer.renderString(entry.body, {
            serviceName: params.serviceName,
          }),
        };
      }
      case NotificationType.APPOINTMENT_CANCELLED: {
        const entry = messages.APPOINTMENT_CANCELLED;
        return {
          title: entry.title,
          body: this.templateRenderer.renderString(entry.body, {
            serviceName: params.serviceName,
          }),
        };
      }
      case NotificationType.APPOINTMENT_COMPLETED: {
        const entry = messages.APPOINTMENT_COMPLETED;
        return {
          title: entry.title,
          body: this.templateRenderer.renderString(entry.body, {
            serviceName: params.serviceName,
          }),
        };
      }
      case NotificationType.APPOINTMENT_NO_SHOW: {
        const entry = messages.APPOINTMENT_NO_SHOW;
        return {
          title: entry.title,
          body: this.templateRenderer.renderString(entry.body, {
            serviceName: params.serviceName,
          }),
        };
      }
      case NotificationType.APPOINTMENT_RESCHEDULED: {
        const entry = messages.APPOINTMENT_RESCHEDULED;
        return {
          title: entry.title,
          body: this.templateRenderer.renderString(entry.body, {
            serviceName: params.serviceName,
          }),
        };
      }
      case NotificationType.APPOINTMENT_REMINDER: {
        const entry = messages.APPOINTMENT_REMINDER;
        const reminderLabel =
          messages.reminderLabels[params.reminderType] ?? params.reminderType;
        return {
          title: entry.title,
          body: this.templateRenderer.renderString(entry.body, {
            serviceName: params.serviceName,
            reminderLabel,
          }),
        };
      }
      case NotificationType.CHAT_MESSAGE:
        return {
          title: messages.CHAT_MESSAGE.title,
          body: params.body,
        };
      default: {
        const exhaustive: never = params;
        return exhaustive;
      }
    }
  }
}
