import { Inject, Injectable } from '@nestjs/common';
import { LOGGER_TOKEN, type ILogger } from '@shared/domain/logging/logger.token';
import type { TransactionScope } from '@shared/domain/transactions';
import { unwrapPrismaTxFromScope } from '@shared/infrastructure/persistence/transactions';
import type {
  ICreateMasterScheduleExceptionInput,
  IMasterScheduleExceptionEntity,
  IMasterScheduleExceptionPublicEntity,
  IMasterScheduleExceptionRelations,
  IUpdateMasterScheduleExceptionInput,
} from 'src/modules/masters/domain/entities/master-schedule-exception';
import type { IMasterScheduleExceptionRepository } from 'src/modules/masters/domain/repositories/master-schedule-exception/i-master-schedule-exception.repository';
import type { ReadResult } from '@shared/domain/query';
import { PrismaService } from '@shared/infrastructure/persistence/prisma/prisma.service';
import { PrismaReadRepository } from '@shared/infrastructure/persistence/repositories/base/prisma-read.repository';
import {
  mapMasterScheduleExceptionRow,
  type MasterScheduleExceptionRow,
} from '../../row-mappers/master-schedule-exception';
import {
  MASTER_SCHEDULE_EXCEPTION_RELATIONS,
  MASTER_SCHEDULE_EXCEPTION_VALIDATION_CONFIG,
} from './master-schedule-exception.relations';
import { mapMasterScheduleExceptionWriteError } from './master-schedule-exception-write-error.mapper';

@Injectable()
export class PrismaMasterScheduleExceptionRepository
  extends PrismaReadRepository<
    IMasterScheduleExceptionPublicEntity,
    string,
    IMasterScheduleExceptionRelations,
    MasterScheduleExceptionRow
  >
  implements IMasterScheduleExceptionRepository
{
  protected readonly validationConfig = MASTER_SCHEDULE_EXCEPTION_VALIDATION_CONFIG;
  protected readonly relationConfig = MASTER_SCHEDULE_EXCEPTION_RELATIONS;

  constructor(
    private readonly prismaService: PrismaService,
    @Inject(LOGGER_TOKEN) logger: ILogger,
  ) {
    super(logger);
  }

  protected getDelegate(scope?: TransactionScope) {
    return scope
      ? unwrapPrismaTxFromScope(scope).masterScheduleException
      : this.prismaService.masterScheduleException;
  }

  protected mapRow(
    row: MasterScheduleExceptionRow,
  ): ReadResult<IMasterScheduleExceptionPublicEntity, IMasterScheduleExceptionRelations> {
    return mapMasterScheduleExceptionRow(row);
  }

  protected toPrismaWhereUnique(id: string): Record<string, unknown> {
    return { id };
  }

  async findEntityById(
    id: string,
    scope?: TransactionScope,
  ): Promise<IMasterScheduleExceptionEntity | null> {
    const row = await this.getDelegate(scope).findUnique({
      where: { id },
    });
    return row ? mapMasterScheduleExceptionRow(row as MasterScheduleExceptionRow) : null;
  }

  async create(
    input: ICreateMasterScheduleExceptionInput,
    scope: TransactionScope,
  ): Promise<IMasterScheduleExceptionEntity> {
    const tx = unwrapPrismaTxFromScope(scope);

    try {
      const row = await tx.masterScheduleException.create({ data: input });
      return mapMasterScheduleExceptionRow(row as MasterScheduleExceptionRow);
    } catch (error) {
      throw mapMasterScheduleExceptionWriteError(error, { masterProfileId: input.masterProfileId });
    }
  }

  async createMany(
    inputs: readonly ICreateMasterScheduleExceptionInput[],
    scope: TransactionScope,
  ): Promise<IMasterScheduleExceptionEntity[]> {
    if (inputs.length === 0) {
      return [];
    }

    const tx = unwrapPrismaTxFromScope(scope);

    try {
      const rows = await tx.masterScheduleException.createManyAndReturn({
        data: [...inputs],
      });
      return rows.map((row) => mapMasterScheduleExceptionRow(row as MasterScheduleExceptionRow));
    } catch (error) {
      const first = inputs[0];
      throw mapMasterScheduleExceptionWriteError(error, { masterProfileId: first.masterProfileId });
    }
  }

  async update(
    id: string,
    patch: IUpdateMasterScheduleExceptionInput,
    scope: TransactionScope,
  ): Promise<IMasterScheduleExceptionEntity> {
    const tx = unwrapPrismaTxFromScope(scope);

    try {
      const row = await tx.masterScheduleException.update({
        where: { id },
        data: patch,
      });
      return mapMasterScheduleExceptionRow(row as MasterScheduleExceptionRow);
    } catch (error) {
      throw mapMasterScheduleExceptionWriteError(error, { id });
    }
  }

  async softDelete(
    id: string,
    scope: TransactionScope,
  ): Promise<IMasterScheduleExceptionEntity> {
    const tx = unwrapPrismaTxFromScope(scope);

    try {
      const row = await tx.masterScheduleException.update({
        where: { id },
        data: { deletedAt: new Date() },
      });
      return mapMasterScheduleExceptionRow(row as MasterScheduleExceptionRow);
    } catch (error) {
      throw mapMasterScheduleExceptionWriteError(error, { id });
    }
  }
}
