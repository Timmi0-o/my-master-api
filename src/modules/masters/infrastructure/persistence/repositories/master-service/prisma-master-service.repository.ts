import { Inject, Injectable } from '@nestjs/common';
import { LOGGER_TOKEN, type ILogger } from '@shared/domain/logging/logger.token';
import type { TransactionScope } from '@shared/domain/transactions';
import { unwrapPrismaTxFromScope } from '@shared/infrastructure/persistence/transactions';
import type {
  ICreateMasterServiceInput,
  IMasterServiceEntity,
  IMasterServicePublicEntity,
  IMasterServiceRelations,
  IUpdateMasterServiceInput,
} from 'src/modules/masters/domain/entities/master-service';
import type { IMasterServiceRepository } from 'src/modules/masters/domain/repositories/master-service/i-master-service.repository';
import type { ReadResult } from '@shared/domain/query';
import { PrismaService } from '@shared/infrastructure/persistence/prisma/prisma.service';
import { PrismaReadRepository } from '@shared/infrastructure/persistence/repositories/base/prisma-read.repository';
import {
  mapMasterServiceRow,
  type MasterServiceRow,
} from '../../row-mappers/master-service';
import {
  MASTER_SERVICE_RELATIONS,
  MASTER_SERVICE_VALIDATION_CONFIG,
} from './master-service.relations';
import { mapMasterServiceWriteError } from './master-service-write-error.mapper';

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
  protected readonly validationConfig = MASTER_SERVICE_VALIDATION_CONFIG;
  protected readonly relationConfig = MASTER_SERVICE_RELATIONS;

  constructor(
    private readonly prismaService: PrismaService,
    @Inject(LOGGER_TOKEN) logger: ILogger,
  ) {
    super(logger);
  }

  protected getDelegate(scope?: TransactionScope) {
    return scope
      ? unwrapPrismaTxFromScope(scope).masterService
      : this.prismaService.masterService;
  }

  protected mapRow(
    row: MasterServiceRow,
  ): ReadResult<IMasterServicePublicEntity, IMasterServiceRelations> {
    return mapMasterServiceRow(row);
  }

  protected toPrismaWhereUnique(id: string): Record<string, unknown> {
    return { id };
  }

  async findEntityById(
    id: string,
    scope?: TransactionScope,
  ): Promise<IMasterServiceEntity | null> {
    const row = await this.getDelegate(scope).findUnique({
      where: { id },
    });
    return row ? mapMasterServiceRow(row as MasterServiceRow) : null;
  }

  async create(
    input: ICreateMasterServiceInput,
    scope: TransactionScope,
  ): Promise<IMasterServiceEntity> {
    const tx = unwrapPrismaTxFromScope(scope);

    try {
      const row = await tx.masterService.create({ data: input });
      return mapMasterServiceRow(row as MasterServiceRow);
    } catch (error) {
      throw mapMasterServiceWriteError(error, { masterProfileId: input.masterProfileId });
    }
  }

  async createMany(
    inputs: readonly ICreateMasterServiceInput[],
    scope: TransactionScope,
  ): Promise<IMasterServiceEntity[]> {
    if (inputs.length === 0) {
      return [];
    }

    const tx = unwrapPrismaTxFromScope(scope);

    try {
      const rows = await tx.masterService.createManyAndReturn({
        data: [...inputs],
      });
      return rows.map((row) => mapMasterServiceRow(row as MasterServiceRow));
    } catch (error) {
      const first = inputs[0];
      throw mapMasterServiceWriteError(error, { masterProfileId: first.masterProfileId });
    }
  }

  async update(
    id: string,
    patch: IUpdateMasterServiceInput,
    scope: TransactionScope,
  ): Promise<IMasterServiceEntity> {
    const tx = unwrapPrismaTxFromScope(scope);

    try {
      const row = await tx.masterService.update({
        where: { id },
        data: patch,
      });
      return mapMasterServiceRow(row as MasterServiceRow);
    } catch (error) {
      throw mapMasterServiceWriteError(error, { id });
    }
  }

  async softDelete(
    id: string,
    scope: TransactionScope,
  ): Promise<IMasterServiceEntity> {
    const tx = unwrapPrismaTxFromScope(scope);

    try {
      const row = await tx.masterService.update({
        where: { id },
        data: { deletedAt: new Date() },
      });
      return mapMasterServiceRow(row as MasterServiceRow);
    } catch (error) {
      throw mapMasterServiceWriteError(error, { id });
    }
  }
}
