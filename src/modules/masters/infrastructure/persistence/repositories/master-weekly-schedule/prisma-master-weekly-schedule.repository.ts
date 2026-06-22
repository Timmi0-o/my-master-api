import { Inject, Injectable } from '@nestjs/common';
import { LOGGER_TOKEN, type ILogger } from '@shared/domain/logging/logger.token';
import type { TransactionScope } from '@shared/domain/transactions';
import { unwrapPrismaTxFromScope } from '@shared/infrastructure/persistence/transactions';
import type {
  ICreateMasterWeeklyScheduleInput,
  IMasterWeeklyScheduleEntity,
  IMasterWeeklySchedulePublicEntity,
  IMasterWeeklyScheduleRelations,
  IUpdateMasterWeeklyScheduleInput,
} from 'src/modules/masters/domain/entities/master-weekly-schedule';
import type { IMasterWeeklyScheduleRepository } from 'src/modules/masters/domain/repositories/master-weekly-schedule/i-master-weekly-schedule.repository';
import type { ReadResult } from '@shared/domain/query';
import { PrismaService } from '@shared/infrastructure/persistence/prisma/prisma.service';
import { PrismaReadRepository } from '@shared/infrastructure/persistence/repositories/base/prisma-read.repository';
import {
  mapMasterWeeklyScheduleRow,
  type MasterWeeklyScheduleRow,
} from '../../row-mappers/master-weekly-schedule';
import {
  MASTER_WEEKLY_SCHEDULE_RELATIONS,
  MASTER_WEEKLY_SCHEDULE_VALIDATION_CONFIG,
} from './master-weekly-schedule.relations';
import { mapMasterWeeklyScheduleWriteError } from './master-weekly-schedule-write-error.mapper';

@Injectable()
export class PrismaMasterWeeklyScheduleRepository
  extends PrismaReadRepository<
    IMasterWeeklySchedulePublicEntity,
    string,
    IMasterWeeklyScheduleRelations,
    MasterWeeklyScheduleRow
  >
  implements IMasterWeeklyScheduleRepository
{
  protected readonly validationConfig = MASTER_WEEKLY_SCHEDULE_VALIDATION_CONFIG;
  protected readonly relationConfig = MASTER_WEEKLY_SCHEDULE_RELATIONS;

  constructor(
    private readonly prismaService: PrismaService,
    @Inject(LOGGER_TOKEN) logger: ILogger,
  ) {
    super(logger);
  }

  protected getDelegate(scope?: TransactionScope) {
    return scope
      ? unwrapPrismaTxFromScope(scope).masterWeeklySchedule
      : this.prismaService.masterWeeklySchedule;
  }

  protected mapRow(
    row: MasterWeeklyScheduleRow,
  ): ReadResult<IMasterWeeklySchedulePublicEntity, IMasterWeeklyScheduleRelations> {
    return mapMasterWeeklyScheduleRow(row);
  }

  protected toPrismaWhereUnique(id: string): Record<string, unknown> {
    return { id };
  }

  async findEntityById(
    id: string,
    scope?: TransactionScope,
  ): Promise<IMasterWeeklyScheduleEntity | null> {
    const row = await this.getDelegate(scope).findUnique({
      where: { id },
    });
    return row ? mapMasterWeeklyScheduleRow(row as MasterWeeklyScheduleRow) : null;
  }

  async create(
    input: ICreateMasterWeeklyScheduleInput,
    scope: TransactionScope,
  ): Promise<IMasterWeeklyScheduleEntity> {
    const tx = unwrapPrismaTxFromScope(scope);

    try {
      const row = await tx.masterWeeklySchedule.create({ data: input });
      return mapMasterWeeklyScheduleRow(row as MasterWeeklyScheduleRow);
    } catch (error) {
      throw mapMasterWeeklyScheduleWriteError(error, { masterProfileId: input.masterProfileId });
    }
  }

  async createMany(
    inputs: readonly ICreateMasterWeeklyScheduleInput[],
    scope: TransactionScope,
  ): Promise<IMasterWeeklyScheduleEntity[]> {
    if (inputs.length === 0) {
      return [];
    }

    const tx = unwrapPrismaTxFromScope(scope);

    try {
      const rows = await tx.masterWeeklySchedule.createManyAndReturn({
        data: [...inputs],
      });
      return rows.map((row) => mapMasterWeeklyScheduleRow(row as MasterWeeklyScheduleRow));
    } catch (error) {
      const first = inputs[0];
      throw mapMasterWeeklyScheduleWriteError(error, { masterProfileId: first.masterProfileId });
    }
  }

  async update(
    id: string,
    patch: IUpdateMasterWeeklyScheduleInput,
    scope: TransactionScope,
  ): Promise<IMasterWeeklyScheduleEntity> {
    const tx = unwrapPrismaTxFromScope(scope);

    try {
      const row = await tx.masterWeeklySchedule.update({
        where: { id },
        data: patch,
      });
      return mapMasterWeeklyScheduleRow(row as MasterWeeklyScheduleRow);
    } catch (error) {
      throw mapMasterWeeklyScheduleWriteError(error, { id });
    }
  }

  async softDelete(
    id: string,
    scope: TransactionScope,
  ): Promise<IMasterWeeklyScheduleEntity> {
    const tx = unwrapPrismaTxFromScope(scope);

    try {
      const row = await tx.masterWeeklySchedule.update({
        where: { id },
        data: { deletedAt: new Date() },
      });
      return mapMasterWeeklyScheduleRow(row as MasterWeeklyScheduleRow);
    } catch (error) {
      throw mapMasterWeeklyScheduleWriteError(error, { id });
    }
  }
}
