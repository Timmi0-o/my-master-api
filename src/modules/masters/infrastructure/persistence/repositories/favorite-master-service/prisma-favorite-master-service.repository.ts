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
  ICreateFavoriteMasterServiceInput,
  IFavoriteMasterServiceEntity,
  IFavoriteMasterServicePublicEntity,
  IFavoriteMasterServiceRelations,
} from 'src/modules/masters/domain/entities/favorite-master-service';
import type { IFavoriteMasterServiceRepository } from 'src/modules/masters/domain/repositories/favorite-master-service/i-favorite-master-service.repository';
import {
  mapFavoriteMasterServiceRow,
  type FavoriteMasterServiceRow,
} from '../../row-mappers/favorite-master-service';
import { mapFavoriteMasterServiceWriteError } from './favorite-master-service-write-error.mapper';
import {
  FAVORITE_MASTER_SERVICE_RELATIONS,
  FAVORITE_MASTER_SERVICE_VALIDATION_CONFIG,
} from './favorite-master-service.relations';

@Injectable()
export class PrismaFavoriteMasterServiceRepository
  extends PrismaReadRepository<
    IFavoriteMasterServicePublicEntity,
    string,
    IFavoriteMasterServiceRelations,
    FavoriteMasterServiceRow
  >
  implements IFavoriteMasterServiceRepository
{
  protected readonly validationConfig =
    FAVORITE_MASTER_SERVICE_VALIDATION_CONFIG;
  protected readonly relationConfig = FAVORITE_MASTER_SERVICE_RELATIONS;

  constructor(
    private readonly prismaService: PrismaService,
    @Inject(LOGGER_TOKEN) logger: ILogger,
  ) {
    super(logger);
  }

  protected getDelegate(scope?: TransactionScope) {
    return scope
      ? unwrapPrismaTxFromScope(scope).favoriteMasterService
      : this.prismaService.favoriteMasterService;
  }

  protected mapRow(
    row: FavoriteMasterServiceRow,
  ): ReadResult<
    IFavoriteMasterServicePublicEntity,
    IFavoriteMasterServiceRelations
  > {
    return mapFavoriteMasterServiceRow(row);
  }

  protected toPrismaWhereUnique(id: string): Record<string, unknown> {
    return { id };
  }

  async findEntityById(
    id: string,
    scope?: TransactionScope,
  ): Promise<IFavoriteMasterServiceEntity | null> {
    const row = await this.getDelegate(scope).findUnique({
      where: { id },
    });
    return row
      ? mapFavoriteMasterServiceRow(row as FavoriteMasterServiceRow)
      : null;
  }

  async findEntityByUserAndMasterServiceId(
    userId: string,
    masterServiceId: string,
    scope?: TransactionScope,
  ): Promise<IFavoriteMasterServiceEntity | null> {
    const row = await this.getDelegate(scope).findUnique({
      where: { userId_masterServiceId: { userId, masterServiceId } },
    });
    return row
      ? mapFavoriteMasterServiceRow(row as FavoriteMasterServiceRow)
      : null;
  }

  async create(
    input: ICreateFavoriteMasterServiceInput,
    scope: TransactionScope,
  ): Promise<IFavoriteMasterServiceEntity> {
    const tx = unwrapPrismaTxFromScope(scope);

    try {
      const row = await tx.favoriteMasterService.create({ data: input });
      return mapFavoriteMasterServiceRow(row as FavoriteMasterServiceRow);
    } catch (error) {
      throw mapFavoriteMasterServiceWriteError(error, {
        userId: input.userId,
        masterServiceId: input.masterServiceId,
      });
    }
  }

  async createMany(
    inputs: readonly ICreateFavoriteMasterServiceInput[],
    scope: TransactionScope,
  ): Promise<IFavoriteMasterServiceEntity[]> {
    if (inputs.length === 0) {
      return [];
    }

    const tx = unwrapPrismaTxFromScope(scope);

    try {
      const rows = await tx.favoriteMasterService.createManyAndReturn({
        data: [...inputs],
      });
      return rows.map((row) =>
        mapFavoriteMasterServiceRow(row as FavoriteMasterServiceRow),
      );
    } catch (error) {
      const first = inputs[0];
      throw mapFavoriteMasterServiceWriteError(error, {
        userId: first.userId,
        masterServiceId: first.masterServiceId,
      });
    }
  }

  async softDelete(
    id: string,
    scope: TransactionScope,
  ): Promise<IFavoriteMasterServiceEntity> {
    const tx = unwrapPrismaTxFromScope(scope);

    try {
      const row = await tx.favoriteMasterService.update({
        where: { id },
        data: { deletedAt: new Date() },
      });
      return mapFavoriteMasterServiceRow(row as FavoriteMasterServiceRow);
    } catch (error) {
      throw mapFavoriteMasterServiceWriteError(error, { id });
    }
  }

  async restore(
    id: string,
    scope: TransactionScope,
  ): Promise<IFavoriteMasterServiceEntity> {
    const tx = unwrapPrismaTxFromScope(scope);

    try {
      const row = await tx.favoriteMasterService.update({
        where: { id },
        data: { deletedAt: null },
      });
      return mapFavoriteMasterServiceRow(row as FavoriteMasterServiceRow);
    } catch (error) {
      throw mapFavoriteMasterServiceWriteError(error, { id });
    }
  }
}
