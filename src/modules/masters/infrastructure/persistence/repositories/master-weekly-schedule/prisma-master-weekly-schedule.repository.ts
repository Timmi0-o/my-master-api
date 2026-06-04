import { Injectable } from '@nestjs/common';
import type {
  ICreateMasterWeeklyScheduleInput,
  IMasterWeeklyScheduleEntity,
  IMasterWeeklySchedulePublicEntity,
  IMasterWeeklyScheduleRelations,
  IUpdateMasterWeeklyScheduleInput,
} from 'src/modules/masters/domain/entities/master-weekly-schedule';
import type { IMasterWeeklyScheduleRepository } from 'src/modules/masters/domain/repositories/master-weekly-schedule/i-master-weekly-schedule.repository';
import type { ReadResult } from 'src/modules/shared/domain/query';
import { PrismaService } from 'src/modules/shared/infrastructure/persistence/prisma/prisma.service';
import { PrismaReadRepository } from 'src/modules/shared/infrastructure/persistence/repositories/base/prisma-read.repository';
import {
  mapMasterWeeklyScheduleRow,
  type MasterWeeklyScheduleRow,
} from '../../row-mappers/master-weekly-schedule';
import {
  MASTER_WEEKLY_SCHEDULE_RELATIONS,
  MASTER_WEEKLY_SCHEDULE_VALIDATION_CONFIG,
} from './master-weekly-schedule.relations';

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

  constructor(private readonly prismaService: PrismaService) {
    super();
  }

  protected getDelegate() {
    return this.prismaService.masterWeeklySchedule;
  }

  protected mapRow(
    row: MasterWeeklyScheduleRow,
  ): ReadResult<
    IMasterWeeklySchedulePublicEntity,
    IMasterWeeklyScheduleRelations
  > {
    return mapMasterWeeklyScheduleRow(row);
  }

  protected toPrismaWhereUnique(id: string): Record<string, unknown> {
    return { id };
  }

  async findEntityById(id: string): Promise<IMasterWeeklyScheduleEntity | null> {
    const row = await this.prismaService.masterWeeklySchedule.findUnique({
      where: { id },
    });
    return row ? mapMasterWeeklyScheduleRow(row as MasterWeeklyScheduleRow) : null;
  }

  async create(
    input: ICreateMasterWeeklyScheduleInput,
  ): Promise<IMasterWeeklyScheduleEntity> {
    const row = await this.prismaService.masterWeeklySchedule.create({
      data: input,
    });
    return mapMasterWeeklyScheduleRow(row as MasterWeeklyScheduleRow);
  }

  async update(
    id: string,
    input: IUpdateMasterWeeklyScheduleInput,
  ): Promise<IMasterWeeklyScheduleEntity> {
    const row = await this.prismaService.masterWeeklySchedule.update({
      where: { id },
      data: input,
    });
    return mapMasterWeeklyScheduleRow(row as MasterWeeklyScheduleRow);
  }

  async softDeleteById(id: string): Promise<boolean> {
    const row = await this.prismaService.masterWeeklySchedule.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
    return row.deletedAt != null;
  }
}
