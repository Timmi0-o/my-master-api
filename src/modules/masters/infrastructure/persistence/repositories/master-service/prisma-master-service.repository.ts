import { Injectable } from '@nestjs/common';
import type { MasterService } from '@prisma/client';
import type {
  ICreateMasterServiceInput,
  IMasterServiceEntity,
  IMasterServicePublicEntity,
  IUpdateMasterServiceInput,
} from 'src/modules/masters/domain/entities/master-service';
import type { IMasterServiceRepository } from 'src/modules/masters/domain/repositories/master-service/i-master-service.repository';
import { PrismaReadRepository } from 'src/modules/shared/infrastructure/persistence/repositories/base/prisma-read.repository';
import { PrismaService } from 'src/modules/shared/infrastructure/persistence/prisma/prisma.service';
import {
  mapMasterServiceEntityRow,
  mapMasterServicePublicRow,
} from '../../row-mappers/master-service/map-master-service-row';

@Injectable()
export class PrismaMasterServiceRepository
  extends PrismaReadRepository<
    IMasterServicePublicEntity,
    string,
    Record<never, never>,
    MasterService
  >
  implements IMasterServiceRepository
{
  constructor(private readonly prismaService: PrismaService) {
    super();
  }

  protected getDelegate() {
    return this.prismaService.masterService;
  }

  protected mapRow(row: MasterService): IMasterServicePublicEntity {
    return mapMasterServicePublicRow(row);
  }

  protected toPrismaWhereUnique(id: string): Record<string, unknown> {
    return { id };
  }

  async findEntityById(id: string): Promise<IMasterServiceEntity | null> {
    const row = await this.prismaService.masterService.findUnique({
      where: { id },
    });
    return row ? mapMasterServiceEntityRow(row) : null;
  }

  async create(input: ICreateMasterServiceInput): Promise<IMasterServiceEntity> {
    const row = await this.prismaService.masterService.create({ data: input });
    return mapMasterServiceEntityRow(row);
  }

  async update(
    id: string,
    input: IUpdateMasterServiceInput,
  ): Promise<IMasterServiceEntity> {
    const row = await this.prismaService.masterService.update({
      where: { id },
      data: input,
    });
    return mapMasterServiceEntityRow(row);
  }

  async softDeleteById(id: string): Promise<boolean> {
    const row = await this.prismaService.masterService.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
    return row.deletedAt != null;
  }
}
