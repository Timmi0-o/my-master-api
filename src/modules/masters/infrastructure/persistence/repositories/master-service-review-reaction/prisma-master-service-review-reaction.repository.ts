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
  ICreateMasterServiceReviewReactionInput,
  IMasterServiceReviewReactionEntity,
  IMasterServiceReviewReactionPublicEntity,
  IMasterServiceReviewReactionRelations,
  IUpdateMasterServiceReviewReactionInput,
} from 'src/modules/masters/domain/entities/master-service-review-reaction';
import type {
  IMasterServiceReviewReactionRepository,
  MasterServiceReviewReactionStats,
} from 'src/modules/masters/domain/repositories/master-service-review-reaction/i-master-service-review-reaction.repository';
import {
  mapMasterServiceReviewReactionRow,
  type MasterServiceReviewReactionRow,
} from '../../row-mappers/master-service-review-reaction';
import { mapMasterServiceReviewReactionWriteError } from './master-service-review-reaction-write-error.mapper';
import {
  MASTER_SERVICE_REVIEW_REACTION_RELATIONS,
  MASTER_SERVICE_REVIEW_REACTION_VALIDATION_CONFIG,
} from './master-service-review-reaction.relations';

@Injectable()
export class PrismaMasterServiceReviewReactionRepository
  extends PrismaReadRepository<
    IMasterServiceReviewReactionPublicEntity,
    string,
    IMasterServiceReviewReactionRelations,
    MasterServiceReviewReactionRow
  >
  implements IMasterServiceReviewReactionRepository
{
  protected readonly validationConfig =
    MASTER_SERVICE_REVIEW_REACTION_VALIDATION_CONFIG;
  protected readonly relationConfig = MASTER_SERVICE_REVIEW_REACTION_RELATIONS;

  constructor(
    private readonly prismaService: PrismaService,
    @Inject(LOGGER_TOKEN) logger: ILogger,
  ) {
    super(logger);
  }

  protected getDelegate(scope?: TransactionScope) {
    return scope
      ? unwrapPrismaTxFromScope(scope).masterServiceReviewReaction
      : this.prismaService.masterServiceReviewReaction;
  }

  protected mapRow(
    row: MasterServiceReviewReactionRow,
  ): ReadResult<
    IMasterServiceReviewReactionPublicEntity,
    IMasterServiceReviewReactionRelations
  > {
    return mapMasterServiceReviewReactionRow(row);
  }

  protected toPrismaWhereUnique(id: string): Record<string, unknown> {
    return { id };
  }

  async findEntityById(
    id: string,
    scope?: TransactionScope,
  ): Promise<IMasterServiceReviewReactionEntity | null> {
    const row = await this.getDelegate(scope).findUnique({
      where: { id },
    });
    return row
      ? mapMasterServiceReviewReactionRow(
          row as MasterServiceReviewReactionRow,
        )
      : null;
  }

  async findEntityByUserAndReviewId(
    userId: string,
    masterServiceReviewId: string,
    scope?: TransactionScope,
  ): Promise<IMasterServiceReviewReactionEntity | null> {
    const row = await this.getDelegate(scope).findUnique({
      where: {
        userId_masterServiceReviewId: { userId, masterServiceReviewId },
      },
    });
    return row
      ? mapMasterServiceReviewReactionRow(
          row as MasterServiceReviewReactionRow,
        )
      : null;
  }

  async create(
    input: ICreateMasterServiceReviewReactionInput,
    scope: TransactionScope,
  ): Promise<IMasterServiceReviewReactionEntity> {
    const tx = unwrapPrismaTxFromScope(scope);

    try {
      const row = await tx.masterServiceReviewReaction.create({
        data: input,
      });
      return mapMasterServiceReviewReactionRow(
        row as MasterServiceReviewReactionRow,
      );
    } catch (error) {
      throw mapMasterServiceReviewReactionWriteError(error, {
        userId: input.userId,
        masterServiceReviewId: input.masterServiceReviewId,
      });
    }
  }

  async createMany(
    inputs: readonly ICreateMasterServiceReviewReactionInput[],
    scope: TransactionScope,
  ): Promise<IMasterServiceReviewReactionEntity[]> {
    if (inputs.length === 0) {
      return [];
    }

    const tx = unwrapPrismaTxFromScope(scope);

    try {
      const rows = await tx.masterServiceReviewReaction.createManyAndReturn({
        data: [...inputs],
      });
      return rows.map((row) =>
        mapMasterServiceReviewReactionRow(
          row as MasterServiceReviewReactionRow,
        ),
      );
    } catch (error) {
      const first = inputs[0];
      throw mapMasterServiceReviewReactionWriteError(error, {
        userId: first.userId,
        masterServiceReviewId: first.masterServiceReviewId,
      });
    }
  }

  async update(
    id: string,
    patch: IUpdateMasterServiceReviewReactionInput,
    scope: TransactionScope,
  ): Promise<IMasterServiceReviewReactionEntity> {
    const tx = unwrapPrismaTxFromScope(scope);

    try {
      const row = await tx.masterServiceReviewReaction.update({
        where: { id },
        data: patch,
      });
      return mapMasterServiceReviewReactionRow(
        row as MasterServiceReviewReactionRow,
      );
    } catch (error) {
      throw mapMasterServiceReviewReactionWriteError(error, { id });
    }
  }

  async softDelete(
    id: string,
    scope: TransactionScope,
  ): Promise<IMasterServiceReviewReactionEntity> {
    const tx = unwrapPrismaTxFromScope(scope);

    try {
      const row = await tx.masterServiceReviewReaction.update({
        where: { id },
        data: { deletedAt: new Date() },
      });
      return mapMasterServiceReviewReactionRow(
        row as MasterServiceReviewReactionRow,
      );
    } catch (error) {
      throw mapMasterServiceReviewReactionWriteError(error, { id });
    }
  }

  async restore(
    id: string,
    scope: TransactionScope,
  ): Promise<IMasterServiceReviewReactionEntity> {
    const tx = unwrapPrismaTxFromScope(scope);

    try {
      const row = await tx.masterServiceReviewReaction.update({
        where: { id },
        data: { deletedAt: null },
      });
      return mapMasterServiceReviewReactionRow(
        row as MasterServiceReviewReactionRow,
      );
    } catch (error) {
      throw mapMasterServiceReviewReactionWriteError(error, { id });
    }
  }

  async getStatsByReviewIds(
    reviewIds: readonly string[],
    scope?: TransactionScope,
  ): Promise<Map<string, MasterServiceReviewReactionStats>> {
    const stats = new Map<string, MasterServiceReviewReactionStats>();

    if (reviewIds.length === 0) {
      return stats;
    }

    const delegate = scope
      ? unwrapPrismaTxFromScope(scope).masterServiceReviewReaction
      : this.prismaService.masterServiceReviewReaction;

    const groups = await delegate.groupBy({
      by: ['masterServiceReviewId', 'type'],
      where: {
        masterServiceReviewId: { in: [...reviewIds] },
        deletedAt: null,
      },
      _count: { _all: true },
    });

    for (const group of groups) {
      const current = stats.get(group.masterServiceReviewId) ?? {
        likesCount: 0,
        dislikesCount: 0,
      };

      if (group.type === 'LIKE') {
        current.likesCount = group._count._all;
      } else if (group.type === 'DISLIKE') {
        current.dislikesCount = group._count._all;
      }

      stats.set(group.masterServiceReviewId, current);
    }

    return stats;
  }
}
