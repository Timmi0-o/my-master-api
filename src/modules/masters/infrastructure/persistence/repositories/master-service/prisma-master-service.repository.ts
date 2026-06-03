import { Injectable } from '@nestjs/common';
import type {
  ICreateMasterServiceInput,
  IMasterServiceEntity,
  IMasterServicePublicEntity,
  IMasterServiceRelations,
  IUpdateMasterServiceInput,
} from 'src/modules/masters/domain/entities/master-service';
import type { IMasterServiceRepository } from 'src/modules/masters/domain/repositories/master-service/i-master-service.repository';
import type { ReadResult } from 'src/modules/shared/domain/query';
import { PrismaService } from 'src/modules/shared/infrastructure/persistence/prisma/prisma.service';
import { PrismaReadRepository } from 'src/modules/shared/infrastructure/persistence/repositories/base/prisma-read.repository';
import {
  mapMasterServiceRow,
  type MasterServiceRow,
} from '../../row-mappers/master-service';
import { MASTER_SERVICE_RELATIONS } from './master-service.relations';

@Injectable()
export class PrismaMasterServiceRepository
  extends PrismaReadRepository<
    IMasterServicePublicEntity,
    string,
    IMasterServiceRelations,
    MasterServiceRow
  >
  implements IMasterServiceRepository
{
  protected readonly relationConfig = MASTER_SERVICE_RELATIONS;

  constructor(private readonly prismaService: PrismaService) {
    super();
  }

  protected getDelegate() {
    return this.prismaService.masterService;
  }

  protected mapRow(
    row: MasterServiceRow,
  ): ReadResult<IMasterServicePublicEntity, IMasterServiceRelations> {
    return mapMasterServiceRow(row);
  }

  protected toPrismaWhereUnique(id: string): Record<string, unknown> {
    return { id };
  }

  async findEntityById(id: string): Promise<IMasterServiceEntity | null> {
    const row = await this.prismaService.masterService.findUnique({
      where: { id },
    });
    return row ? mapMasterServiceRow(row as MasterServiceRow) : null;
  }

  async create(
    input: ICreateMasterServiceInput,
  ): Promise<IMasterServiceEntity> {
    const row = await this.prismaService.masterService.create({ data: input });
    return mapMasterServiceRow(row as MasterServiceRow);
  }

  async update(
    id: string,
    input: IUpdateMasterServiceInput,
  ): Promise<IMasterServiceEntity> {
    const row = await this.prismaService.masterService.update({
      where: { id },
      data: input,
    });
    return mapMasterServiceRow(row as MasterServiceRow);
  }

  async softDeleteById(id: string): Promise<boolean> {
    const row = await this.prismaService.masterService.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
    return row.deletedAt != null;
  }
}
