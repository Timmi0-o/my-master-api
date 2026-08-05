import { Inject, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import {
  LOGGER_TOKEN,
  type ILogger,
} from '@shared/domain/logging/logger.token';
import type { ReadResult } from '@shared/domain/query';
import type { TransactionScope } from '@shared/domain/transactions';
import { PrismaService } from '@shared/infrastructure/persistence/prisma/prisma.service';
import { PrismaReadRepository } from '@shared/infrastructure/persistence/repositories/base/prisma-read.repository';
import { unwrapPrismaTxFromScope } from '@shared/infrastructure/persistence/transactions';
import type {
  IAppointmentChatMessageEntity,
  IAppointmentChatMessagePublicEntity,
  IAppointmentChatMessageRelations,
  ICreateAppointmentChatMessageInput,
  IUpdateAppointmentChatMessageInput,
} from 'src/modules/appointments/domain/entities/appointment-chat-message';
import type { IAppointmentChatMessageRepository } from 'src/modules/appointments/domain/repositories/appointment-chat-message/i-appointment-chat-message.repository';
import {
  mapAppointmentChatMessageRow,
  type AppointmentChatMessageRow,
} from '../../row-mappers/appointment-chat-message';
import { mapAppointmentChatMessageWriteError } from './appointment-chat-message-write-error.mapper';
import {
  APPOINTMENT_CHAT_MESSAGE_RELATIONS,
  APPOINTMENT_CHAT_MESSAGE_VALIDATION_CONFIG,
} from './appointment-chat-message.relations';

function toPrismaCreateData(input: ICreateAppointmentChatMessageInput) {
  return {
    chatId: input.chatId,
    senderUserId: input.senderUserId,
    actor: input.actor,
    body: input.body,
    systemAction: input.systemAction,
    payload:
      input.payload === undefined || input.payload === null
        ? undefined
        : (input.payload as Prisma.InputJsonValue),
  };
}

@Injectable()
export class PrismaAppointmentChatMessageRepository
  extends PrismaReadRepository<
    IAppointmentChatMessagePublicEntity,
    string,
    IAppointmentChatMessageRelations,
    AppointmentChatMessageRow
  >
  implements IAppointmentChatMessageRepository
{
  protected readonly validationConfig =
    APPOINTMENT_CHAT_MESSAGE_VALIDATION_CONFIG;
  protected readonly relationConfig = APPOINTMENT_CHAT_MESSAGE_RELATIONS;

  constructor(
    private readonly prismaService: PrismaService,
    @Inject(LOGGER_TOKEN) logger: ILogger,
  ) {
    super(logger);
  }

  protected getDelegate(scope?: TransactionScope) {
    return scope
      ? unwrapPrismaTxFromScope(scope).appointmentChatMessage
      : this.prismaService.appointmentChatMessage;
  }

  protected mapRow(
    row: AppointmentChatMessageRow,
  ): ReadResult<
    IAppointmentChatMessagePublicEntity,
    IAppointmentChatMessageRelations
  > {
    return mapAppointmentChatMessageRow(row);
  }

  protected toPrismaWhereUnique(id: string): Record<string, unknown> {
    return { id };
  }

  async findEntityById(
    id: string,
    scope?: TransactionScope,
  ): Promise<IAppointmentChatMessageEntity | null> {
    const row = await this.getDelegate(scope).findUnique({
      where: { id },
    });
    return row
      ? mapAppointmentChatMessageRow(row as AppointmentChatMessageRow)
      : null;
  }

  async create(
    input: ICreateAppointmentChatMessageInput,
    scope: TransactionScope,
  ): Promise<IAppointmentChatMessageEntity> {
    const tx = unwrapPrismaTxFromScope(scope);

    try {
      const row = await tx.appointmentChatMessage.create({
        data: toPrismaCreateData(input),
      });
      return mapAppointmentChatMessageRow(row as AppointmentChatMessageRow);
    } catch (error) {
      throw mapAppointmentChatMessageWriteError(error, {
        chatId: input.chatId,
      });
    }
  }

  async createMany(
    inputs: readonly ICreateAppointmentChatMessageInput[],
    scope: TransactionScope,
  ): Promise<IAppointmentChatMessageEntity[]> {
    if (inputs.length === 0) {
      return [];
    }

    const tx = unwrapPrismaTxFromScope(scope);

    try {
      const rows = await tx.appointmentChatMessage.createManyAndReturn({
        data: inputs.map(toPrismaCreateData),
      });
      return rows.map((row) =>
        mapAppointmentChatMessageRow(row as AppointmentChatMessageRow),
      );
    } catch (error) {
      const first = inputs[0];
      throw mapAppointmentChatMessageWriteError(error, {
        chatId: first.chatId,
      });
    }
  }

  async update(
    id: string,
    patch: IUpdateAppointmentChatMessageInput,
    scope: TransactionScope,
  ): Promise<IAppointmentChatMessageEntity> {
    const tx = unwrapPrismaTxFromScope(scope);

    try {
      const row = await tx.appointmentChatMessage.update({
        where: { id },
        data: {
          ...patch,
          payload:
            patch.payload === undefined
              ? undefined
              : patch.payload === null
                ? Prisma.JsonNull
                : (patch.payload as Prisma.InputJsonValue),
        },
      });
      return mapAppointmentChatMessageRow(row as AppointmentChatMessageRow);
    } catch (error) {
      throw mapAppointmentChatMessageWriteError(error, { id });
    }
  }

  async softDelete(
    id: string,
    scope: TransactionScope,
  ): Promise<IAppointmentChatMessageEntity> {
    const tx = unwrapPrismaTxFromScope(scope);

    try {
      const row = await tx.appointmentChatMessage.update({
        where: { id },
        data: { deletedAt: new Date() },
      });
      return mapAppointmentChatMessageRow(row as AppointmentChatMessageRow);
    } catch (error) {
      throw mapAppointmentChatMessageWriteError(error, { id });
    }
  }

  async countUnreadForChat(input: {
    chatId: string;
    viewerUserId: string;
    myLastReadAt: Date | null;
  }): Promise<number> {
    return this.getDelegate().count({
      where: this.buildUnreadWhere(input),
    });
  }

  async countUnreadForChats(
    viewerUserId: string,
    chats: ReadonlyArray<{
      chatId: string;
      myLastReadAt: Date | null;
    }>,
  ): Promise<Map<string, number>> {
    const result = new Map<string, number>();

    if (chats.length === 0) {
      return result;
    }

    await Promise.all(
      chats.map(async (chat) => {
        const count = await this.countUnreadForChat({
          chatId: chat.chatId,
          viewerUserId,
          myLastReadAt: chat.myLastReadAt,
        });
        result.set(chat.chatId, count);
      }),
    );

    return result;
  }

  async findLatestByChatIds(
    chatIds: readonly string[],
    viewerUserId?: string,
  ): Promise<Map<string, IAppointmentChatMessagePublicEntity>> {
    const result = new Map<string, IAppointmentChatMessagePublicEntity>();
    const uniqueIds = [...new Set(chatIds.filter(Boolean))];

    if (uniqueIds.length === 0) {
      return result;
    }

    await Promise.all(
      uniqueIds.map(async (chatId) => {
        const row = await this.getDelegate().findFirst({
          where: this.buildVisibleWhere({ chatId, viewerUserId }),
          orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
        });

        if (row) {
          result.set(
            chatId,
            mapAppointmentChatMessageRow(row as AppointmentChatMessageRow),
          );
        }
      }),
    );

    return result;
  }

  async findMessageWindow(input: {
    chatId: string;
    limit: number;
    viewerUserId?: string;
    before?: { createdAt: Date; id?: string };
    after?: { createdAt: Date; id?: string };
  }): Promise<{
    items: IAppointmentChatMessagePublicEntity[];
    hasMoreBefore: boolean;
    hasMoreAfter: boolean;
  }> {
    const take = input.limit + 1;
    const baseWhere = this.buildVisibleWhere({
      chatId: input.chatId,
      viewerUserId: input.viewerUserId,
    });

    if (input.before && input.after) {
      throw new Error('before and after cursors are mutually exclusive');
    }

    if (input.before) {
      const beforeCreatedAtFilter: Prisma.AppointmentChatMessageWhereInput =
        input.before.id
          ? {
              OR: [
                { createdAt: { lt: input.before.createdAt } },
                {
                  createdAt: input.before.createdAt,
                  id: { lt: input.before.id },
                },
              ],
            }
          : { createdAt: { lt: input.before.createdAt } };

      const rows = await this.getDelegate().findMany({
        where: {
          ...baseWhere,
          ...beforeCreatedAtFilter,
        },
        orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
        take,
      });

      const hasMoreBefore = rows.length > input.limit;
      const slice = hasMoreBefore ? rows.slice(0, input.limit) : rows;
      const items = slice
        .reverse()
        .map((row) =>
          mapAppointmentChatMessageRow(row as AppointmentChatMessageRow),
        );

      return {
        items,
        hasMoreBefore,
        hasMoreAfter: true,
      };
    }

    if (input.after) {
      const afterCreatedAtFilter: Prisma.AppointmentChatMessageWhereInput =
        input.after.id
          ? {
              OR: [
                { createdAt: { gt: input.after.createdAt } },
                {
                  createdAt: input.after.createdAt,
                  id: { gt: input.after.id },
                },
              ],
            }
          : { createdAt: { gt: input.after.createdAt } };

      const rows = await this.getDelegate().findMany({
        where: {
          ...baseWhere,
          ...afterCreatedAtFilter,
        },
        orderBy: [{ createdAt: 'asc' }, { id: 'asc' }],
        take,
      });

      const hasMoreAfter = rows.length > input.limit;
      const slice = hasMoreAfter ? rows.slice(0, input.limit) : rows;
      const items = slice.map((row) =>
        mapAppointmentChatMessageRow(row as AppointmentChatMessageRow),
      );

      return {
        items,
        hasMoreBefore: true,
        hasMoreAfter,
      };
    }

    const rows = await this.getDelegate().findMany({
      where: baseWhere,
      orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
      take,
    });

    const hasMoreBefore = rows.length > input.limit;
    const slice = hasMoreBefore ? rows.slice(0, input.limit) : rows;
    const items = slice
      .reverse()
      .map((row) =>
        mapAppointmentChatMessageRow(row as AppointmentChatMessageRow),
      );

    return {
      items,
      hasMoreBefore,
      hasMoreAfter: false,
    };
  }

  private buildVisibleWhere(input: {
    chatId: string;
    viewerUserId?: string;
  }): Prisma.AppointmentChatMessageWhereInput {
    return {
      chatId: input.chatId,
      deletedAt: null,
      ...(input.viewerUserId
        ? { NOT: { deletedForUserIds: { has: input.viewerUserId } } }
        : {}),
    };
  }

  private buildUnreadWhere(input: {
    chatId: string;
    viewerUserId: string;
    myLastReadAt: Date | null;
  }): Prisma.AppointmentChatMessageWhereInput {
    return {
      ...this.buildVisibleWhere({
        chatId: input.chatId,
        viewerUserId: input.viewerUserId,
      }),
      actor: 'USER',
      AND: [
        { senderUserId: { not: null } },
        { senderUserId: { not: input.viewerUserId } },
      ],
      ...(input.myLastReadAt ? { createdAt: { gt: input.myLastReadAt } } : {}),
    };
  }
}
