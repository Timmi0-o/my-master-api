import { Injectable } from '@nestjs/common';
import type {
  ICreateMasterScheduleExceptionInput,
  IMasterScheduleExceptionEntity,
  IMasterScheduleExceptionPublicEntity,
  IMasterScheduleExceptionRelations,
  IUpdateMasterScheduleExceptionInput,
} from 'src/modules/masters/domain/entities/master-schedule-exception';
import type { IMasterScheduleExceptionRepository } from 'src/modules/masters/domain/repositories/master-schedule-exception/i-master-schedule-exception.repository';
import type { ReadResult } from 'src/modules/shared/domain/query';
import { PrismaService } from 'src/modules/shared/infrastructure/persistence/prisma/prisma.service';
import { PrismaReadRepository } from 'src/modules/shared/infrastructure/persistence/repositories/base/prisma-read.repository';
import {
  mapMasterScheduleExceptionRow,
  type MasterScheduleExceptionRow,
} from '../../row-mappers/master-schedule-exception';
import {
  MASTER_SCHEDULE_EXCEPTION_RELATIONS,
  MASTER_SCHEDULE_EXCEPTION_VALIDATION_CONFIG,
} from './master-schedule-exception.relations';

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
  protected readonly validationConfig =
    MASTER_SCHEDULE_EXCEPTION_VALIDATION_CONFIG;
  protected readonly relationConfig = MASTER_SCHEDULE_EXCEPTION_RELATIONS;

  constructor(private readonly prismaService: PrismaService) {
    super();
  }

  protected getDelegate() {
    return this.prismaService.masterScheduleException;
  }

  protected mapRow(
    row: MasterScheduleExceptionRow,
  ): ReadResult<
    IMasterScheduleExceptionPublicEntity,
    IMasterScheduleExceptionRelations
  > {
    return mapMasterScheduleExceptionRow(row);
  }

  protected toPrismaWhereUnique(id: string): Record<string, unknown> {
    return { id };
  }

  async findEntityById(
    id: string,
  ): Promise<IMasterScheduleExceptionEntity | null> {
    const row = await this.prismaService.masterScheduleException.findUnique({
      where: { id },
    });
    return row
      ? mapMasterScheduleExceptionRow(row as MasterScheduleExceptionRow)
      : null;
  }

  async create(
    input: ICreateMasterScheduleExceptionInput,
  ): Promise<IMasterScheduleExceptionEntity> {
    const row = await this.prismaService.masterScheduleException.create({
      data: input,
    });
    return mapMasterScheduleExceptionRow(row as MasterScheduleExceptionRow);
  }

  async update(
    id: string,
    input: IUpdateMasterScheduleExceptionInput,
  ): Promise<IMasterScheduleExceptionEntity> {
    const row = await this.prismaService.masterScheduleException.update({
      where: { id },
      data: input,
    });
    return mapMasterScheduleExceptionRow(row as MasterScheduleExceptionRow);
  }

  async softDeleteById(id: string): Promise<boolean> {
    const row = await this.prismaService.masterScheduleException.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
    return row.deletedAt != null;
  }
}
