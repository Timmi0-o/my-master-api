import { Inject, Injectable } from '@nestjs/common';
import { LOGGER_TOKEN, type ILogger } from '@shared/domain/logging/logger.token';
import type { TransactionScope } from '@shared/domain/transactions';
import { unwrapPrismaTxFromScope } from '@shared/infrastructure/persistence/transactions';
import { ImageEntityType } from 'src/modules/masters/domain/entities/image';
import type { IImageRepository } from 'src/modules/masters/domain/repositories/image/i-image.repository';
import { IMAGE_REPOSITORY_TOKEN } from 'src/modules/masters/domain/repositories/image/image.repository.tokens';
import {
  groupAvatarsByEntityId,
  wantsAvatarInclude,
} from 'src/modules/masters/infrastructure/persistence/helpers/hydrate-profile-avatar.helper';
import type {
  ICreateUserProfileInput,
  IUserProfileEntity,
  IUserProfilePublicEntity,
  IUserProfileRelations,
  IUpdateUserProfileInput,
} from 'src/modules/users/domain/entities/user-profile';
import type { IUserProfileRepository } from 'src/modules/users/domain/repositories/user-profile/i-user-profile.repository';
import type {
  FindManyParams,
  FindOneParams,
  ReadResult,
} from '@shared/domain/query';
import { PrismaService } from '@shared/infrastructure/persistence/prisma/prisma.service';
import { PrismaReadRepository } from '@shared/infrastructure/persistence/repositories/base/prisma-read.repository';
import {
  mapUserProfileRow,
  type UserProfileRow,
} from '../../row-mappers/user-profile';
import {
  USER_PROFILE_RELATIONS,
  USER_PROFILE_VALIDATION_CONFIG,
} from './user-profile.relations';
import { mapUserProfileWriteError } from './user-profile-write-error.mapper';

@Injectable()
export class PrismaUserProfileRepository
  extends PrismaReadRepository<
    IUserProfilePublicEntity,
    string,
    IUserProfileRelations,
    UserProfileRow
  >
  implements IUserProfileRepository
{
  protected readonly validationConfig = USER_PROFILE_VALIDATION_CONFIG;
  protected readonly relationConfig = USER_PROFILE_RELATIONS;

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
      ? unwrapPrismaTxFromScope(scope).userProfile
      : this.prismaService.userProfile;
  }

  protected mapRow(
    row: UserProfileRow,
  ): ReadResult<IUserProfilePublicEntity, IUserProfileRelations> {
    return mapUserProfileRow(row);
  }

  protected toPrismaWhereUnique(id: string): Record<string, unknown> {
    return { id };
  }

  async findOne(
    id: string,
    params?: FindOneParams<IUserProfilePublicEntity, IUserProfileRelations>,
    scope?: TransactionScope,
  ): Promise<ReadResult<
    IUserProfilePublicEntity,
    IUserProfileRelations
  > | null> {
    const result = await super.findOne(id, params, scope);
    if (result == null || !wantsAvatarInclude(params?.selectOptions?.include)) {
      return result;
    }

    const [hydrated] = await this.hydrateAvatars([result], scope);
    return hydrated ?? null;
  }

  async findMany(
    params?: FindManyParams<IUserProfilePublicEntity, IUserProfileRelations>,
    scope?: TransactionScope,
  ): Promise<ReadResult<IUserProfilePublicEntity, IUserProfileRelations>[]> {
    const results = await super.findMany(params, scope);
    if (!wantsAvatarInclude(params?.selectOptions?.include)) {
      return results;
    }

    return this.hydrateAvatars(results, scope);
  }

  private async hydrateAvatars(
    profiles: ReadResult<IUserProfilePublicEntity, IUserProfileRelations>[],
    scope?: TransactionScope,
  ): Promise<ReadResult<IUserProfilePublicEntity, IUserProfileRelations>[]> {
    if (profiles.length === 0) {
      return profiles;
    }

    const images = await this.imageRepository.findByEntityTypeAndEntityIds(
      ImageEntityType.CLIENT_PROFILE_AVATAR,
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

  async findEntityById(
    id: string,
    scope?: TransactionScope,
  ): Promise<IUserProfileEntity | null> {
    const row = await this.getDelegate(scope).findUnique({
      where: { id },
    });
    return row ? mapUserProfileRow(row as UserProfileRow) : null;
  }

  async findEntityByUserId(
    userId: string,
    scope?: TransactionScope,
  ): Promise<IUserProfileEntity | null> {
    const row = await this.getDelegate(scope).findUnique({
      where: { userId },
    });
    return row ? mapUserProfileRow(row as UserProfileRow) : null;
  }

  async create(
    input: ICreateUserProfileInput,
    scope: TransactionScope,
  ): Promise<IUserProfileEntity> {
    const tx = unwrapPrismaTxFromScope(scope);

    try {
      const row = await tx.userProfile.create({ data: input });
      return mapUserProfileRow(row as UserProfileRow);
    } catch (error) {
      throw mapUserProfileWriteError(error, { userId: input.userId });
    }
  }

  async createMany(
    inputs: readonly ICreateUserProfileInput[],
    scope: TransactionScope,
  ): Promise<IUserProfileEntity[]> {
    if (inputs.length === 0) {
      return [];
    }

    const tx = unwrapPrismaTxFromScope(scope);

    try {
      const rows = await tx.userProfile.createManyAndReturn({
        data: [...inputs],
      });
      return rows.map((row) => mapUserProfileRow(row as UserProfileRow));
    } catch (error) {
      const first = inputs[0];
      throw mapUserProfileWriteError(error, { userId: first.userId });
    }
  }

  async update(
    id: string,
    patch: IUpdateUserProfileInput,
    scope: TransactionScope,
  ): Promise<IUserProfileEntity> {
    const tx = unwrapPrismaTxFromScope(scope);

    try {
      const row = await tx.userProfile.update({
        where: { id },
        data: patch,
      });
      return mapUserProfileRow(row as UserProfileRow);
    } catch (error) {
      throw mapUserProfileWriteError(error, { id });
    }
  }

  async softDelete(
    id: string,
    scope: TransactionScope,
  ): Promise<IUserProfileEntity> {
    const tx = unwrapPrismaTxFromScope(scope);

    try {
      const row = await tx.userProfile.update({
        where: { id },
        data: { deletedAt: new Date() },
      });
      return mapUserProfileRow(row as UserProfileRow);
    } catch (error) {
      throw mapUserProfileWriteError(error, { id });
    }
  }
}
