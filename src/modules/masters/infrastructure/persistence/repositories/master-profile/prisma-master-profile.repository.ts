import { Inject, Injectable } from '@nestjs/common';
import { LOGGER_TOKEN, type ILogger } from '@shared/domain/logging/logger.token';
import type { TransactionScope } from '@shared/domain/transactions';
import { unwrapPrismaTxFromScope } from '@shared/infrastructure/persistence/transactions';
import type {
  ICreateMasterProfileInput,
  IMasterProfileEntity,
  IMasterProfilePublicEntity,
  IMasterProfileRelations,
  IUpdateMasterProfileInput,
} from 'src/modules/masters/domain/entities/master-profile';
import { ImageEntityType } from 'src/modules/masters/domain/entities/image';
import type { IImageRepository } from 'src/modules/masters/domain/repositories/image/i-image.repository';
import { IMAGE_REPOSITORY_TOKEN } from 'src/modules/masters/domain/repositories/image/image.repository.tokens';
import type { IMasterProfileRepository } from 'src/modules/masters/domain/repositories/master-profile/i-master-profile.repository';
import type {
  FindManyParams,
  FindOneParams,
  ReadResult,
} from '@shared/domain/query';
import { PrismaService } from '@shared/infrastructure/persistence/prisma/prisma.service';
import { PrismaReadRepository } from '@shared/infrastructure/persistence/repositories/base/prisma-read.repository';
import {
  groupAvatarsByEntityId,
  wantsAvatarInclude,
} from '../../helpers/hydrate-profile-avatar.helper';
import {
  groupImagesByEntityId,
  wantsNestedServiceImagesInclude,
} from '../../helpers/hydrate-service-images.helper';
import {
  mapMasterProfileRow,
  type MasterProfileRow,
} from '../../row-mappers/master-profile';
import {
  MASTER_PROFILE_RELATIONS,
  MASTER_PROFILE_VALIDATION_CONFIG,
} from './master-profile.relations';
import { mapMasterProfileWriteError } from './master-profile-write-error.mapper';

@Injectable()
export class PrismaMasterProfileRepository
  extends PrismaReadRepository<
    IMasterProfilePublicEntity,
    string,
    IMasterProfileRelations,
    MasterProfileRow
  >
  implements IMasterProfileRepository
{
  protected readonly validationConfig = MASTER_PROFILE_VALIDATION_CONFIG;
  protected readonly relationConfig = MASTER_PROFILE_RELATIONS;

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
      ? unwrapPrismaTxFromScope(scope).masterProfile
      : this.prismaService.masterProfile;
  }

  protected mapRow(
    row: MasterProfileRow,
  ): ReadResult<IMasterProfilePublicEntity, IMasterProfileRelations> {
    return mapMasterProfileRow(row);
  }

  protected toPrismaWhereUnique(id: string): Record<string, unknown> {
    return { id };
  }

  async findOne(
    id: string,
    params?: FindOneParams<IMasterProfilePublicEntity, IMasterProfileRelations>,
    scope?: TransactionScope,
  ): Promise<ReadResult<
    IMasterProfilePublicEntity,
    IMasterProfileRelations
  > | null> {
    const result = await super.findOne(id, params, scope);
    if (result == null) {
      return null;
    }

    const [hydrated] = await this.hydrateRelations(
      [result],
      params?.selectOptions?.include,
      scope,
    );
    return hydrated ?? null;
  }

  async findMany(
    params?: FindManyParams<
      IMasterProfilePublicEntity,
      IMasterProfileRelations
    >,
    scope?: TransactionScope,
  ): Promise<
    ReadResult<IMasterProfilePublicEntity, IMasterProfileRelations>[]
  > {
    const results = await super.findMany(params, scope);
    return this.hydrateRelations(
      results,
      params?.selectOptions?.include,
      scope,
    );
  }

  private async hydrateRelations(
    profiles: ReadResult<
      IMasterProfilePublicEntity,
      IMasterProfileRelations
    >[],
    include: unknown,
    scope?: TransactionScope,
  ): Promise<
    ReadResult<IMasterProfilePublicEntity, IMasterProfileRelations>[]
  > {
    let next = profiles;

    if (wantsAvatarInclude(include)) {
      next = await this.hydrateAvatars(next, scope);
    }

    if (wantsNestedServiceImagesInclude(include)) {
      next = await this.hydrateServiceImages(next, scope);
    }

    return next;
  }

  private async hydrateAvatars(
    profiles: ReadResult<
      IMasterProfilePublicEntity,
      IMasterProfileRelations
    >[],
    scope?: TransactionScope,
  ): Promise<
    ReadResult<IMasterProfilePublicEntity, IMasterProfileRelations>[]
  > {
    if (profiles.length === 0) {
      return profiles;
    }

    const images = await this.imageRepository.findByEntityTypeAndEntityIds(
      ImageEntityType.MASTER_PROFILE_AVATAR,
      profiles.map((profile) => profile.id),
      { includeFile: true },
      scope,
    );
    const byProfileId = groupAvatarsByEntityId(images);

    return profiles.map((profile) => ({
      ...profile,
      avatar: byProfileId.get(profile.id) ?? null,
    }));
  }

  private async hydrateServiceImages(
    profiles: ReadResult<
      IMasterProfilePublicEntity,
      IMasterProfileRelations
    >[],
    scope?: TransactionScope,
  ): Promise<
    ReadResult<IMasterProfilePublicEntity, IMasterProfileRelations>[]
  > {
    const serviceIds = profiles.flatMap((profile) =>
      (profile.services ?? []).map((service) => service.id),
    );

    if (serviceIds.length === 0) {
      return profiles;
    }

    const images = await this.imageRepository.findByEntityTypeAndEntityIds(
      ImageEntityType.MASTER_SERVICE,
      serviceIds,
      { includeFile: true },
      scope,
    );
    const byServiceId = groupImagesByEntityId(images);

    return profiles.map((profile) => {
      if (profile.services == null) {
        return profile;
      }

      return {
        ...profile,
        services: profile.services.map((service) => ({
          ...service,
          images: byServiceId.get(service.id) ?? [],
        })),
      };
    });
  }

  async findEntityById(
    id: string,
    scope?: TransactionScope,
  ): Promise<IMasterProfileEntity | null> {
    const row = await this.getDelegate(scope).findUnique({
      where: { id },
    });
    return row ? mapMasterProfileRow(row as MasterProfileRow) : null;
  }

  async findEntityByUserId(
    userId: string,
    scope?: TransactionScope,
  ): Promise<IMasterProfileEntity | null> {
    const row = await this.getDelegate(scope).findUnique({
      where: { userId },
    });
    return row ? mapMasterProfileRow(row as MasterProfileRow) : null;
  }

  async create(
    input: ICreateMasterProfileInput,
    scope: TransactionScope,
  ): Promise<IMasterProfileEntity> {
    const tx = unwrapPrismaTxFromScope(scope);

    try {
      const row = await tx.masterProfile.create({ data: input });
      return mapMasterProfileRow(row as MasterProfileRow);
    } catch (error) {
      throw mapMasterProfileWriteError(error, { userId: input.userId });
    }
  }

  async createMany(
    inputs: readonly ICreateMasterProfileInput[],
    scope: TransactionScope,
  ): Promise<IMasterProfileEntity[]> {
    if (inputs.length === 0) {
      return [];
    }

    const tx = unwrapPrismaTxFromScope(scope);

    try {
      const rows = await tx.masterProfile.createManyAndReturn({
        data: [...inputs],
      });
      return rows.map((row) => mapMasterProfileRow(row as MasterProfileRow));
    } catch (error) {
      const first = inputs[0];
      throw mapMasterProfileWriteError(error, { userId: first.userId });
    }
  }

  async update(
    id: string,
    patch: IUpdateMasterProfileInput,
    scope: TransactionScope,
  ): Promise<IMasterProfileEntity> {
    const tx = unwrapPrismaTxFromScope(scope);

    try {
      const row = await tx.masterProfile.update({
        where: { id },
        data: patch,
      });
      return mapMasterProfileRow(row as MasterProfileRow);
    } catch (error) {
      throw mapMasterProfileWriteError(error, { id });
    }
  }

  async softDelete(
    id: string,
    scope: TransactionScope,
  ): Promise<IMasterProfileEntity> {
    const tx = unwrapPrismaTxFromScope(scope);

    try {
      const row = await tx.masterProfile.update({
        where: { id },
        data: { deletedAt: new Date() },
      });
      return mapMasterProfileRow(row as MasterProfileRow);
    } catch (error) {
      throw mapMasterProfileWriteError(error, { id });
    }
  }
}
