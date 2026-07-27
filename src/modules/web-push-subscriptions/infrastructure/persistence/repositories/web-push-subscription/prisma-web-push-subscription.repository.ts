import { Injectable } from '@nestjs/common';
import type { TransactionScope } from '@shared/domain/transactions';
import { PrismaService } from '@shared/infrastructure/persistence/prisma/prisma.service';
import { unwrapPrismaTxFromScope } from '@shared/infrastructure/persistence/transactions';
import {
  WebPushDeviceType,
  WebPushSubscriptionStatus,
  type ICreateWebPushSubscriptionInput,
  type IUpdateWebPushSubscriptionInput,
  type IWebPushSubscriptionEntity,
} from 'src/modules/web-push-subscriptions/domain/entities/web-push-subscription';
import type { IWebPushSubscriptionRepository } from 'src/modules/web-push-subscriptions/domain/repositories/web-push-subscription';
import {
  mapWebPushSubscriptionRow,
  type WebPushSubscriptionRow,
} from '../../row-mappers/web-push-subscription';

@Injectable()
export class PrismaWebPushSubscriptionRepository
  implements IWebPushSubscriptionRepository
{
  constructor(private readonly prismaService: PrismaService) {}

  private getDelegate(scope?: TransactionScope) {
    return scope
      ? unwrapPrismaTxFromScope(scope).webPushSubscription
      : this.prismaService.webPushSubscription;
  }

  async findEntityById(
    id: string,
    scope?: TransactionScope,
  ): Promise<IWebPushSubscriptionEntity | null> {
    const row = await this.getDelegate(scope).findUnique({ where: { id } });
    return row ? mapWebPushSubscriptionRow(row as WebPushSubscriptionRow) : null;
  }

  async findEntityByEndpoint(
    endpoint: string,
    scope?: TransactionScope,
  ): Promise<IWebPushSubscriptionEntity | null> {
    const row = await this.getDelegate(scope).findUnique({
      where: { endpoint },
    });
    return row ? mapWebPushSubscriptionRow(row as WebPushSubscriptionRow) : null;
  }

  async findActiveByUserId(
    userId: string,
    scope?: TransactionScope,
  ): Promise<IWebPushSubscriptionEntity[]> {
    const rows = await this.getDelegate(scope).findMany({
      where: {
        userId,
        deletedAt: null,
        status: WebPushSubscriptionStatus.ACTIVE,
      },
      orderBy: { subscribedAt: 'desc' },
    });

    return rows.map((row) =>
      mapWebPushSubscriptionRow(row as WebPushSubscriptionRow),
    );
  }

  async findManyByUserId(
    userId: string,
    scope?: TransactionScope,
  ): Promise<IWebPushSubscriptionEntity[]> {
    const rows = await this.getDelegate(scope).findMany({
      where: {
        userId,
        deletedAt: null,
      },
      orderBy: { subscribedAt: 'desc' },
    });

    return rows.map((row) =>
      mapWebPushSubscriptionRow(row as WebPushSubscriptionRow),
    );
  }

  async create(
    input: ICreateWebPushSubscriptionInput,
    scope: TransactionScope,
  ): Promise<IWebPushSubscriptionEntity> {
    const tx = unwrapPrismaTxFromScope(scope);

    const row = await tx.webPushSubscription.create({
      data: {
        userId: input.userId,
        endpoint: input.endpoint,
        p256dh: input.p256dh,
        auth: input.auth,
        expirationTime: input.expirationTime ?? null,
        contentEncoding: input.contentEncoding ?? 'aes128gcm',
        userAgent: input.userAgent ?? null,
        deviceType: input.deviceType ?? WebPushDeviceType.UNKNOWN,
        browser: input.browser ?? null,
        platform: input.platform ?? null,
        status: WebPushSubscriptionStatus.ACTIVE,
        subscribedAt: new Date(),
      },
    });

    return mapWebPushSubscriptionRow(row as WebPushSubscriptionRow);
  }

  async update(
    id: string,
    input: IUpdateWebPushSubscriptionInput,
    scope: TransactionScope,
  ): Promise<IWebPushSubscriptionEntity> {
    const tx = unwrapPrismaTxFromScope(scope);
    const now = new Date();

    const row = await tx.webPushSubscription.update({
      where: { id },
      data: {
        userId: input.userId,
        p256dh: input.p256dh,
        auth: input.auth,
        expirationTime: input.expirationTime ?? null,
        ...(input.contentEncoding != null
          ? { contentEncoding: input.contentEncoding }
          : {}),
        userAgent: input.userAgent ?? null,
        ...(input.deviceType != null ? { deviceType: input.deviceType } : {}),
        browser: input.browser ?? null,
        platform: input.platform ?? null,
        ...(input.status != null ? { status: input.status } : {}),
        subscribedAt: now,
        ...(input.clearDeletedAt ? { deletedAt: null } : {}),
        ...(input.resetDeliveryState
          ? {
              failureCount: 0,
              lastFailureAt: null,
              lastFailureCode: null,
            }
          : {}),
      },
    });

    return mapWebPushSubscriptionRow(row as WebPushSubscriptionRow);
  }

  async softDelete(
    id: string,
    scope: TransactionScope,
  ): Promise<IWebPushSubscriptionEntity> {
    const tx = unwrapPrismaTxFromScope(scope);

    const row = await tx.webPushSubscription.update({
      where: { id },
      data: {
        deletedAt: new Date(),
        status: WebPushSubscriptionStatus.DISABLED,
      },
    });

    return mapWebPushSubscriptionRow(row as WebPushSubscriptionRow);
  }

  async recordDeliverySuccess(
    id: string,
    scope?: TransactionScope,
  ): Promise<IWebPushSubscriptionEntity> {
    const row = await this.getDelegate(scope).update({
      where: { id },
      data: {
        lastSuccessAt: new Date(),
        failureCount: 0,
        lastFailureAt: null,
        lastFailureCode: null,
      },
    });

    return mapWebPushSubscriptionRow(row as WebPushSubscriptionRow);
  }

  async recordDeliveryFailure(
    id: string,
    failureCode: number | null,
    scope?: TransactionScope,
  ): Promise<IWebPushSubscriptionEntity> {
    const row = await this.getDelegate(scope).update({
      where: { id },
      data: {
        lastFailureAt: new Date(),
        lastFailureCode: failureCode,
        failureCount: { increment: 1 },
      },
    });

    return mapWebPushSubscriptionRow(row as WebPushSubscriptionRow);
  }

  async markExpired(
    id: string,
    failureCode: number | null,
    scope?: TransactionScope,
  ): Promise<IWebPushSubscriptionEntity> {
    const row = await this.getDelegate(scope).update({
      where: { id },
      data: {
        status: WebPushSubscriptionStatus.EXPIRED,
        deletedAt: new Date(),
        lastFailureAt: new Date(),
        lastFailureCode: failureCode,
        failureCount: { increment: 1 },
      },
    });

    return mapWebPushSubscriptionRow(row as WebPushSubscriptionRow);
  }
}
