import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import type { TransactionScope } from '@shared/domain/transactions';
import { PrismaService } from '@shared/infrastructure/persistence/prisma/prisma.service';
import { unwrapPrismaTxFromScope } from '@shared/infrastructure/persistence/transactions';
import type {
  IAppointmentChatUnreadReminderEntity,
  ICreateAppointmentChatUnreadReminderInput,
} from 'src/modules/appointments/domain/entities/appointment-chat-unread-reminder';
import type {
  IAppointmentChatUnreadReminderRepository,
  IStaleUnreadAppointmentChatPair,
} from 'src/modules/appointments/domain/repositories/appointment-chat-unread-reminder';

type AppointmentChatUnreadReminderRow = {
  id: string;
  chatId: string;
  recipientProfileUserId: string;
  remindersCount: number;
  lastRemindedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
};

type StaleUnreadAppointmentChatPairRow = {
  chat_id: string;
  recipient_profile_user_id: string;
  sender_user_id: string;
  recipient_is_client: boolean;
  oldest_unread_at: Date;
};

@Injectable()
export class PrismaAppointmentChatUnreadReminderRepository
  implements IAppointmentChatUnreadReminderRepository
{
  constructor(private readonly prisma: PrismaService) {}

  async findByChatIdAndRecipientProfileUserId(
    chatId: string,
    recipientProfileUserId: string,
    scope?: TransactionScope,
  ): Promise<IAppointmentChatUnreadReminderEntity | null> {
    const client = scope ? unwrapPrismaTxFromScope(scope) : this.prisma;
    const row = await client.appointmentChatUnreadReminder.findUnique({
      where: {
        chatId_recipientProfileUserId: {
          chatId,
          recipientProfileUserId,
        },
      },
    });
    return row ? this.mapRow(row) : null;
  }

  async create(
    input: ICreateAppointmentChatUnreadReminderInput,
    scope?: TransactionScope,
  ): Promise<IAppointmentChatUnreadReminderEntity> {
    const client = scope ? unwrapPrismaTxFromScope(scope) : this.prisma;
    const row = await client.appointmentChatUnreadReminder.create({
      data: {
        chatId: input.chatId,
        recipientProfileUserId: input.recipientProfileUserId,
        remindersCount: input.remindersCount,
        lastRemindedAt: input.lastRemindedAt,
      },
    });
    return this.mapRow(row);
  }

  async incrementRemindersCountById(
    id: string,
    lastRemindedAt: Date,
    scope?: TransactionScope,
  ): Promise<IAppointmentChatUnreadReminderEntity> {
    const client = scope ? unwrapPrismaTxFromScope(scope) : this.prisma;
    const row = await client.appointmentChatUnreadReminder.update({
      where: { id },
      data: {
        remindersCount: { increment: 1 },
        lastRemindedAt,
      },
    });
    return this.mapRow(row);
  }

  async deleteByAppointmentChatUnreadReminderId(
    id: string,
    scope?: TransactionScope,
  ): Promise<void> {
    const client = scope ? unwrapPrismaTxFromScope(scope) : this.prisma;
    await client.appointmentChatUnreadReminder.delete({
      where: { id },
    });
  }

  async deleteByChatIdAndRecipientProfileUserId(
    chatId: string,
    recipientProfileUserId: string,
    scope?: TransactionScope,
  ): Promise<void> {
    const client = scope ? unwrapPrismaTxFromScope(scope) : this.prisma;
    await client.appointmentChatUnreadReminder.deleteMany({
      where: {
        chatId,
        recipientProfileUserId,
      },
    });
  }

  async findStaleUnreadAppointmentChatPairs(input: {
    staleBefore: Date;
    limit: number;
  }): Promise<IStaleUnreadAppointmentChatPair[]> {
    const rows = await this.prisma.$queryRaw<
      StaleUnreadAppointmentChatPairRow[]
    >(Prisma.sql`
      (
        SELECT
          c.id AS chat_id,
          c.client_user_id AS recipient_profile_user_id,
          mp.user_id AS sender_user_id,
          TRUE AS recipient_is_client,
          MIN(m.created_at) AS oldest_unread_at
        FROM "AppointmentChats" c
        INNER JOIN "MasterProfiles" mp ON mp.id = c.master_profile_id
        INNER JOIN "AppointmentChatMessages" m ON m.chat_id = c.id
        WHERE c.deleted_at IS NULL
          AND m.deleted_at IS NULL
          AND m.actor = 'USER'
          AND m.sender_user_id IS NOT NULL
          AND m.sender_user_id <> c.client_user_id
          AND (c.client_last_read_at IS NULL OR m.created_at > c.client_last_read_at)
        GROUP BY c.id, c.client_user_id, mp.user_id
        HAVING MIN(m.created_at) <= ${input.staleBefore}
      )
      UNION ALL
      (
        SELECT
          c.id AS chat_id,
          mp.user_id AS recipient_profile_user_id,
          c.client_user_id AS sender_user_id,
          FALSE AS recipient_is_client,
          MIN(m.created_at) AS oldest_unread_at
        FROM "AppointmentChats" c
        INNER JOIN "MasterProfiles" mp ON mp.id = c.master_profile_id
        INNER JOIN "AppointmentChatMessages" m ON m.chat_id = c.id
        WHERE c.deleted_at IS NULL
          AND m.deleted_at IS NULL
          AND m.actor = 'USER'
          AND m.sender_user_id IS NOT NULL
          AND m.sender_user_id <> mp.user_id
          AND (c.master_last_read_at IS NULL OR m.created_at > c.master_last_read_at)
        GROUP BY c.id, mp.user_id, c.client_user_id
        HAVING MIN(m.created_at) <= ${input.staleBefore}
      )
      ORDER BY oldest_unread_at ASC
      LIMIT ${input.limit}
    `);

    return rows.map((row) => ({
      chatId: row.chat_id,
      recipientProfileUserId: row.recipient_profile_user_id,
      senderUserId: row.sender_user_id,
      recipientIsClient: row.recipient_is_client,
      oldestUnreadAt: row.oldest_unread_at,
    }));
  }

  private mapRow(
    row: AppointmentChatUnreadReminderRow,
  ): IAppointmentChatUnreadReminderEntity {
    return {
      id: row.id,
      chatId: row.chatId,
      recipientProfileUserId: row.recipientProfileUserId,
      remindersCount: row.remindersCount,
      lastRemindedAt: row.lastRemindedAt,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    };
  }
}
