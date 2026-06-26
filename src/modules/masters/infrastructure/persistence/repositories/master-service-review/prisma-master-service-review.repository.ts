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
  ICreateMasterServiceReviewInput,
  IMasterServiceReviewEntity,
  IMasterServiceReviewPublicEntity,
  IMasterServiceReviewRelations,
  IUpdateMasterServiceReviewInput,
} from 'src/modules/masters/domain/entities/master-service-review';
import type { IMasterServiceReviewRepository } from 'src/modules/masters/domain/repositories/master-service-review/i-master-service-review.repository';
import {
  mapMasterServiceReviewRow,
  type MasterServiceReviewRow,
} from '../../row-mappers/master-service-review';
import { mapMasterServiceReviewWriteError } from './master-service-review-write-error.mapper';
import {
  MASTER_SERVICE_REVIEW_RELATIONS,
  MASTER_SERVICE_REVIEW_VALIDATION_CONFIG,
} from './master-service-review.relations';

@Injectable()
export class PrismaMasterServiceReviewRepository
  extends PrismaReadRepository<
    IMasterServiceReviewPublicEntity,
    string,
    IMasterServiceReviewRelations,
    MasterServiceReviewRow
  >
  implements IMasterServiceReviewRepository
{
  protected readonly validationConfig = MASTER_SERVICE_REVIEW_VALIDATION_CONFIG;
  protected readonly relationConfig = MASTER_SERVICE_REVIEW_RELATIONS;

  constructor(
    private readonly prismaService: PrismaService,
    @Inject(LOGGER_TOKEN) logger: ILogger,
  ) {
    super(logger);
  }

  protected getDelegate(scope?: TransactionScope) {
    return scope
      ? unwrapPrismaTxFromScope(scope).masterServiceReview
      : this.prismaService.masterServiceReview;
  }

  protected mapRow(
    row: MasterServiceReviewRow,
  ): ReadResult<
    IMasterServiceReviewPublicEntity,
    IMasterServiceReviewRelations
  > {
    return mapMasterServiceReviewRow(row);
  }

  protected toPrismaWhereUnique(id: string): Record<string, unknown> {
    return { id };
  }

  async findEntityById(
    id: string,
    scope?: TransactionScope,
  ): Promise<IMasterServiceReviewEntity | null> {
    const row = await this.getDelegate(scope).findUnique({
      where: { id },
    });
    return row
      ? mapMasterServiceReviewRow(row as MasterServiceReviewRow)
      : null;
  }

  async findEntityByAppointmentId(
    appointmentId: string,
    scope?: TransactionScope,
  ): Promise<IMasterServiceReviewEntity | null> {
    const row = await this.getDelegate(scope).findUnique({
      where: { appointmentId },
    });
    return row
      ? mapMasterServiceReviewRow(row as MasterServiceReviewRow)
      : null;
  }

  async create(
    input: ICreateMasterServiceReviewInput,
    scope: TransactionScope,
  ): Promise<IMasterServiceReviewEntity> {
    const tx = unwrapPrismaTxFromScope(scope);

    try {
      const row = await tx.masterServiceReview.create({ data: input });
      return mapMasterServiceReviewRow(row as MasterServiceReviewRow);
    } catch (error) {
      throw mapMasterServiceReviewWriteError(error, {
        appointmentId: input.appointmentId,
      });
    }
  }

  async createMany(
    inputs: readonly ICreateMasterServiceReviewInput[],
    scope: TransactionScope,
  ): Promise<IMasterServiceReviewEntity[]> {
    if (inputs.length === 0) {
      return [];
    }

    const tx = unwrapPrismaTxFromScope(scope);

    try {
      const rows = await tx.masterServiceReview.createManyAndReturn({
        data: [...inputs],
      });
      return rows.map((row) =>
        mapMasterServiceReviewRow(row as MasterServiceReviewRow),
      );
    } catch (error) {
      const first = inputs[0];
      throw mapMasterServiceReviewWriteError(error, {
        appointmentId: first.appointmentId,
      });
    }
  }

  async update(
    id: string,
    patch: IUpdateMasterServiceReviewInput,
    scope: TransactionScope,
  ): Promise<IMasterServiceReviewEntity> {
    const tx = unwrapPrismaTxFromScope(scope);

    try {
      const row = await tx.masterServiceReview.update({
        where: { id },
        data: patch,
      });
      return mapMasterServiceReviewRow(row as MasterServiceReviewRow);
    } catch (error) {
      throw mapMasterServiceReviewWriteError(error, { id });
    }
  }

  async softDelete(
    id: string,
    scope: TransactionScope,
  ): Promise<IMasterServiceReviewEntity> {
    const tx = unwrapPrismaTxFromScope(scope);

    try {
      const row = await tx.masterServiceReview.update({
        where: { id },
        data: { deletedAt: new Date() },
      });
      return mapMasterServiceReviewRow(row as MasterServiceReviewRow);
    } catch (error) {
      throw mapMasterServiceReviewWriteError(error, { id });
    }
  }
}
