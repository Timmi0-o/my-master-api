import { Inject, Injectable } from '@nestjs/common';
import type { Prisma } from '@prisma/client';
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
  ICreateNotificationInput,
  INotificationEntity,
  INotificationPublicEntity,
  INotificationRelations,
  IUpdateNotificationInput,
} from 'src/modules/notifications/domain/entities/notification';
import type { INotificationRepository } from 'src/modules/notifications/domain/repositories/notification/i-notification.repository';
import {
  mapNotificationRow,
  type NotificationRow,
} from '../../row-mappers/notification';
import { mapNotificationWriteError } from './notification-write-error.mapper';
import {
  NOTIFICATION_RELATIONS,
  NOTIFICATION_VALIDATION_CONFIG,
} from './notification.relations';

@Injectable()
export class PrismaNotificationRepository
  extends PrismaReadRepository<
    INotificationPublicEntity,
    string,
    INotificationRelations,
    NotificationRow
  >
  implements INotificationRepository
{
  protected readonly validationConfig = NOTIFICATION_VALIDATION_CONFIG;
  protected readonly relationConfig = NOTIFICATION_RELATIONS;

  constructor(
    private readonly prismaService: PrismaService,
    @Inject(LOGGER_TOKEN) logger: ILogger,
  ) {
    super(logger);
  }

  protected getDelegate(scope?: TransactionScope) {
    return scope
      ? unwrapPrismaTxFromScope(scope).notification
      : this.prismaService.notification;
  }

  protected mapRow(
    row: NotificationRow,
  ): ReadResult<INotificationPublicEntity, INotificationRelations> {
    return mapNotificationRow(row);
  }

  protected toPrismaWhereUnique(id: string): Record<string, unknown> {
    return { id };
  }

  async findEntityById(
    id: string,
    scope?: TransactionScope,
  ): Promise<INotificationEntity | null> {
    const row = await this.getDelegate(scope).findUnique({
      where: { id },
    });
    return row ? mapNotificationRow(row as NotificationRow) : null;
  }

  async findEntityByUserAndIdempotencyKey(
    userId: string,
    idempotencyKey: string,
    scope?: TransactionScope,
  ): Promise<INotificationEntity | null> {
    const row = await this.getDelegate(scope).findUnique({
      where: {
        userId_idempotencyKey: { userId, idempotencyKey },
      },
    });
    return row ? mapNotificationRow(row as NotificationRow) : null;
  }

  async countUnreadByUserId(
    userId: string,
    scope?: TransactionScope,
  ): Promise<number> {
    return this.getDelegate(scope).count({
      where: {
        userId,
        deletedAt: null,
        archivedAt: null,
        readAt: null,
      },
    });
  }

  async markAllReadByUserId(
    userId: string,
    scope: TransactionScope,
  ): Promise<number> {
    const tx = unwrapPrismaTxFromScope(scope);
    const result = await tx.notification.updateMany({
      where: {
        userId,
        deletedAt: null,
        readAt: null,
      },
      data: {
        readAt: new Date(),
      },
    });
    return result.count;
  }

  async create(
    input: ICreateNotificationInput,
    scope: TransactionScope,
  ): Promise<INotificationEntity> {
    const tx = unwrapPrismaTxFromScope(scope);

    try {
      const row = await tx.notification.create({
        data: {
          userId: input.userId,
          actorUserId: input.actorUserId ?? null,
          category: input.category,
          type: input.type,
          title: input.title,
          body: input.body,
          actionUrl: input.actionUrl ?? null,
          relatedEntityType: input.relatedEntityType ?? null,
          relatedEntityId: input.relatedEntityId ?? null,
          payload:
            input.payload === undefined || input.payload === null
              ? undefined
              : (input.payload as Prisma.InputJsonValue),
          idempotencyKey: input.idempotencyKey ?? null,
        },
      });
      return mapNotificationRow(row as NotificationRow);
    } catch (error) {
      throw mapNotificationWriteError(error, {
        userId: input.userId,
        idempotencyKey: input.idempotencyKey,
      });
    }
  }

  async createMany(
    inputs: readonly ICreateNotificationInput[],
    scope: TransactionScope,
  ): Promise<INotificationEntity[]> {
    if (inputs.length === 0) {
      return [];
    }

    const results: INotificationEntity[] = [];
    for (const input of inputs) {
      results.push(await this.create(input, scope));
    }
    return results;
  }

  async update(
    id: string,
    patch: IUpdateNotificationInput,
    scope: TransactionScope,
  ): Promise<INotificationEntity> {
    const tx = unwrapPrismaTxFromScope(scope);

    try {
      const row = await tx.notification.update({
        where: { id },
        data: {
          ...(patch.readAt !== undefined ? { readAt: patch.readAt } : {}),
          ...(patch.archivedAt !== undefined
            ? { archivedAt: patch.archivedAt }
            : {}),
        },
      });
      return mapNotificationRow(row as NotificationRow);
    } catch (error) {
      throw mapNotificationWriteError(error, { id });
    }
  }

  async softDelete(
    id: string,
    scope: TransactionScope,
  ): Promise<INotificationEntity> {
    const tx = unwrapPrismaTxFromScope(scope);

    try {
      const row = await tx.notification.update({
        where: { id },
        data: { deletedAt: new Date() },
      });
      return mapNotificationRow(row as NotificationRow);
    } catch (error) {
      throw mapNotificationWriteError(error, { id });
    }
  }
}
