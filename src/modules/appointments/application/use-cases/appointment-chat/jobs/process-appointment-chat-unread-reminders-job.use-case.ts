import { SendWebPushToUserUseCase } from '@modules/web-push-subscriptions/application/use-cases/web-push-subscription/send-web-push-to-user.use-case';
import {
  APPOINTMENT_CHAT_UNREAD_REMINDERS_MAX_PER_DAY,
  APPOINTMENT_CHAT_UNREAD_STALE_MS,
} from 'src/modules/appointments/domain/entities/appointment-chat-unread-reminder';
import type {
  IAppointmentChatUnreadReminderRepository,
  IStaleUnreadAppointmentChatPair,
} from 'src/modules/appointments/domain/repositories/appointment-chat-unread-reminder';
import type { IMasterProfileRepository } from 'src/modules/masters/domain/repositories/master-profile/i-master-profile.repository';
import { CreateNotificationUseCase } from 'src/modules/notifications/application/use-cases/notification/create-notification.use-case';
import {
  NotificationCategory,
  NotificationRelatedEntityType,
  NotificationType,
} from 'src/modules/notifications/domain/entities/notification';
import type { NotificationMessageCatalog } from 'src/modules/notifications/infrastructure/i18n/notification-message-catalog';
import { EUserLanguage } from 'src/modules/users/domain/entities/user';
import type { IUserProfileRepository } from 'src/modules/users/domain/repositories/user-profile/i-user-profile.repository';
import type { IUserRepository } from 'src/modules/users/domain/repositories/user/i-user.repository';

const DEFAULT_BATCH_SIZE = 500;

function startOfUtcDay(date: Date): Date {
  return new Date(
    Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()),
  );
}

function formatUtcDateKey(date: Date): string {
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, '0');
  const day = String(date.getUTCDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export class ProcessAppointmentChatUnreadRemindersJobUseCase {
  constructor(
    private readonly appointmentChatUnreadReminderRepository: IAppointmentChatUnreadReminderRepository,
    private readonly masterProfileRepository: IMasterProfileRepository,
    private readonly userProfileRepository: IUserProfileRepository,
    private readonly userRepository: IUserRepository,
    private readonly createNotificationUseCase: CreateNotificationUseCase,
    private readonly sendWebPushToUserUseCase: SendWebPushToUserUseCase,
    private readonly notificationMessageCatalog: NotificationMessageCatalog,
  ) {}

  async execute(input?: { limit?: number; now?: Date }): Promise<{
    processed: number;
    sent: number;
    skipped: number;
  }> {
    const now = input?.now ?? new Date();
    const staleBefore = new Date(
      now.getTime() - APPOINTMENT_CHAT_UNREAD_STALE_MS,
    );
    const todayStartUtc = startOfUtcDay(now);
    const dateKey = formatUtcDateKey(now);

    const pairs =
      await this.appointmentChatUnreadReminderRepository.findStaleUnreadAppointmentChatPairs(
        {
          staleBefore,
          limit: input?.limit ?? DEFAULT_BATCH_SIZE,
        },
      );

    let sent = 0;
    let skipped = 0;

    for (const pair of pairs) {
      const result = await this.processOne(pair, now, todayStartUtc, dateKey);
      if (result === 'sent') sent += 1;
      else skipped += 1;
    }

    return {
      processed: pairs.length,
      sent,
      skipped,
    };
  }

  private async processOne(
    pair: IStaleUnreadAppointmentChatPair,
    now: Date,
    todayStartUtc: Date,
    dateKey: string,
  ): Promise<'sent' | 'skipped'> {
    let existing =
      await this.appointmentChatUnreadReminderRepository.findByChatIdAndRecipientProfileUserId(
        pair.chatId,
        pair.recipientProfileUserId,
      );

    if (existing && existing.createdAt < todayStartUtc) {
      await this.appointmentChatUnreadReminderRepository.deleteByAppointmentChatUnreadReminderId(
        existing.id,
      );
      existing = null;
    }

    if (
      existing &&
      existing.remindersCount >= APPOINTMENT_CHAT_UNREAD_REMINDERS_MAX_PER_DAY
    ) {
      return 'skipped';
    }

    const nextCount = (existing?.remindersCount ?? 0) + 1;
    const senderName = await this.resolveSenderDisplayName(
      pair.senderUserId,
      pair.recipientIsClient,
    );

    const recipient = await this.userRepository.findEntityById(
      pair.recipientProfileUserId,
    );
    const { title, body } = this.notificationMessageCatalog.resolve(
      recipient?.language ?? EUserLanguage.RU,
      {
        type: NotificationType.CHAT_UNREAD_REMINDER,
        senderName,
      },
    );

    const actionUrl = `/chat/${pair.chatId}`;
    const payload = {
      type: 'appointment_chat_unread_reminder',
      chatId: pair.chatId,
      url: actionUrl,
    };

    await this.createNotificationUseCase.execute({
      userId: pair.recipientProfileUserId,
      actorUserId: pair.senderUserId,
      category: NotificationCategory.CHAT,
      type: NotificationType.CHAT_UNREAD_REMINDER,
      title,
      body,
      actionUrl,
      relatedEntityType: NotificationRelatedEntityType.APPOINTMENT_CHAT,
      relatedEntityId: pair.chatId,
      payload,
      idempotencyKey: `chat_unread_reminder:${pair.chatId}:${pair.recipientProfileUserId}:${dateKey}:${nextCount}`,
    });

    await this.sendWebPushToUserUseCase.execute({
      userId: pair.recipientProfileUserId,
      title,
      body,
      data: payload,
    });

    if (existing) {
      await this.appointmentChatUnreadReminderRepository.incrementRemindersCountById(
        existing.id,
        now,
      );
    } else {
      await this.appointmentChatUnreadReminderRepository.create({
        chatId: pair.chatId,
        recipientProfileUserId: pair.recipientProfileUserId,
        remindersCount: 1,
        lastRemindedAt: now,
      });
    }

    return 'sent';
  }

  private async resolveSenderDisplayName(
    senderUserId: string,
    recipientIsClient: boolean,
  ): Promise<string> {
    if (recipientIsClient) {
      const masterProfile =
        await this.masterProfileRepository.findEntityByUserId(senderUserId);
      if (masterProfile?.displayName?.trim()) {
        return masterProfile.displayName.trim();
      }
    } else {
      const userProfile =
        await this.userProfileRepository.findEntityByUserId(senderUserId);
      if (userProfile?.displayName?.trim()) {
        return userProfile.displayName.trim();
      }
    }

    const sender = await this.userRepository.findEntityById(senderUserId);
    return sender?.email ?? senderUserId;
  }
}
