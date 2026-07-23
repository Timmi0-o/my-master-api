import { Inject, Injectable } from '@nestjs/common';
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
  ICreateMasterSubscriptionInput,
  IMasterSubscriptionEntity,
  IMasterSubscriptionPublicEntity,
  IMasterSubscriptionRelations,
} from 'src/modules/masters/domain/entities/master-subscription';
import type { IMasterSubscriptionRepository } from 'src/modules/masters/domain/repositories/master-subscription/i-master-subscription.repository';
import {
  mapMasterSubscriptionRow,
  type MasterSubscriptionRow,
} from '../../row-mappers/master-subscription';
import { mapMasterSubscriptionWriteError } from './master-subscription-write-error.mapper';
import {
  MASTER_SUBSCRIPTION_RELATIONS,
  MASTER_SUBSCRIPTION_VALIDATION_CONFIG,
} from './master-subscription.relations';

@Injectable()
export class PrismaMasterSubscriptionRepository
  extends PrismaReadRepository<
    IMasterSubscriptionPublicEntity,
    string,
    IMasterSubscriptionRelations,
    MasterSubscriptionRow
  >
  implements IMasterSubscriptionRepository
{
  protected readonly validationConfig = MASTER_SUBSCRIPTION_VALIDATION_CONFIG;
  protected readonly relationConfig = MASTER_SUBSCRIPTION_RELATIONS;

  constructor(
    private readonly prismaService: PrismaService,
    @Inject(LOGGER_TOKEN) logger: ILogger,
  ) {
    super(logger);
  }

  protected getDelegate(scope?: TransactionScope) {
    return scope
      ? unwrapPrismaTxFromScope(scope).masterSubscription
      : this.prismaService.masterSubscription;
  }

  protected mapRow(
    row: MasterSubscriptionRow,
  ): ReadResult<
    IMasterSubscriptionPublicEntity,
    IMasterSubscriptionRelations
  > {
    return mapMasterSubscriptionRow(row);
  }

  protected toPrismaWhereUnique(id: string): Record<string, unknown> {
    return { id };
  }

  async findEntityById(
    id: string,
    scope?: TransactionScope,
  ): Promise<IMasterSubscriptionEntity | null> {
    const row = await this.getDelegate(scope).findUnique({
      where: { id },
    });
    return row
      ? mapMasterSubscriptionRow(row as MasterSubscriptionRow)
      : null;
  }

  async findEntityByUserAndMasterProfileId(
    userId: string,
    masterProfileId: string,
    scope?: TransactionScope,
  ): Promise<IMasterSubscriptionEntity | null> {
    const row = await this.getDelegate(scope).findUnique({
      where: { userId_masterProfileId: { userId, masterProfileId } },
    });
    return row
      ? mapMasterSubscriptionRow(row as MasterSubscriptionRow)
      : null;
  }

  async create(
    input: ICreateMasterSubscriptionInput,
    scope: TransactionScope,
  ): Promise<IMasterSubscriptionEntity> {
    const tx = unwrapPrismaTxFromScope(scope);

    try {
      const row = await tx.masterSubscription.create({ data: input });
      return mapMasterSubscriptionRow(row as MasterSubscriptionRow);
    } catch (error) {
      throw mapMasterSubscriptionWriteError(error, {
        userId: input.userId,
        masterProfileId: input.masterProfileId,
      });
    }
  }

  async createMany(
    inputs: readonly ICreateMasterSubscriptionInput[],
    scope: TransactionScope,
  ): Promise<IMasterSubscriptionEntity[]> {
    if (inputs.length === 0) {
      return [];
    }

    const tx = unwrapPrismaTxFromScope(scope);

    try {
      const rows = await tx.masterSubscription.createManyAndReturn({
        data: [...inputs],
      });
      return rows.map((row) =>
        mapMasterSubscriptionRow(row as MasterSubscriptionRow),
      );
    } catch (error) {
      const first = inputs[0];
      throw mapMasterSubscriptionWriteError(error, {
        userId: first.userId,
        masterProfileId: first.masterProfileId,
      });
    }
  }

  async softDelete(
    id: string,
    scope: TransactionScope,
  ): Promise<IMasterSubscriptionEntity> {
    const tx = unwrapPrismaTxFromScope(scope);

    try {
      const row = await tx.masterSubscription.update({
        where: { id },
        data: { deletedAt: new Date() },
      });
      return mapMasterSubscriptionRow(row as MasterSubscriptionRow);
    } catch (error) {
      throw mapMasterSubscriptionWriteError(error, { id });
    }
  }

  async restore(
    id: string,
    scope: TransactionScope,
  ): Promise<IMasterSubscriptionEntity> {
    const tx = unwrapPrismaTxFromScope(scope);

    try {
      const row = await tx.masterSubscription.update({
        where: { id },
        data: { deletedAt: null },
      });
      return mapMasterSubscriptionRow(row as MasterSubscriptionRow);
    } catch (error) {
      throw mapMasterSubscriptionWriteError(error, { id });
    }
  }
}
