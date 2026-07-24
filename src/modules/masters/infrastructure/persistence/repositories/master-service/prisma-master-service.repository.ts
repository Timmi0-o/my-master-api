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
import { ImageEntityType } from 'src/modules/masters/domain/entities/image';
import type { IImageRepository } from 'src/modules/masters/domain/repositories/image/i-image.repository';
import { IMAGE_REPOSITORY_TOKEN } from 'src/modules/masters/domain/repositories/image/image.repository.tokens';
import type { IMasterServiceRepository } from 'src/modules/masters/domain/repositories/master-service/i-master-service.repository';
import type {
  FindManyParams,
  FindOneParams,
  ReadResult,
} from '@shared/domain/query';
import { PrismaService } from '@shared/infrastructure/persistence/prisma/prisma.service';
import { PrismaReadRepository } from '@shared/infrastructure/persistence/repositories/base/prisma-read.repository';
import {
  groupImagesByEntityId,
  wantsImagesInclude,
} from '../../helpers/hydrate-service-images.helper';
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
    @Inject(IMAGE_REPOSITORY_TOKEN)
    private readonly imageRepository: IImageRepository,
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

  async findOne(
    id: string,
    params?: FindOneParams<IMasterServicePublicEntity, IMasterServiceRelations>,
    scope?: TransactionScope,
  ): Promise<ReadResult<
    IMasterServicePublicEntity,
    IMasterServiceRelations
  > | null> {
    const result = await super.findOne(id, params, scope);
    if (result == null || !wantsImagesInclude(params?.selectOptions?.include)) {
      return result;
    }

    const [hydrated] = await this.hydrateImages([result], scope);
    return hydrated ?? null;
  }

  async findMany(
    params?: FindManyParams<
      IMasterServicePublicEntity,
      IMasterServiceRelations
    >,
    scope?: TransactionScope,
  ): Promise<ReadResult<IMasterServicePublicEntity, IMasterServiceRelations>[]> {
    const results = await super.findMany(params, scope);
    if (!wantsImagesInclude(params?.selectOptions?.include)) {
      return results;
    }

    return this.hydrateImages(results, scope);
  }

  private async hydrateImages(
    services: ReadResult<IMasterServicePublicEntity, IMasterServiceRelations>[],
    scope?: TransactionScope,
  ): Promise<
    ReadResult<IMasterServicePublicEntity, IMasterServiceRelations>[]
  > {
    if (services.length === 0) {
      return services;
    }

    const images =
      await this.imageRepository.findByEntityTypeAndEntityIds(
        ImageEntityType.MASTER_SERVICE,
        services.map((service) => service.id),
        { includeFile: true },
        scope,
      );
    const byServiceId = groupImagesByEntityId(images);

    return services.map((service) => ({
      ...service,
      images: byServiceId.get(service.id) ?? [],
    }));
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
      throw mapMasterServiceWriteError(error, {
        masterProfileId: input.masterProfileId,
      });
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
      throw mapMasterServiceWriteError(error, {
        masterProfileId: first.masterProfileId,
      });
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
