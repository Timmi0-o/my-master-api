import { Inject, Injectable } from '@nestjs/common';
import { LOGGER_TOKEN, type ILogger } from '@shared/domain/logging/logger.token';
import type { TransactionScope } from '@shared/domain/transactions';
import { unwrapPrismaTxFromScope } from '@shared/infrastructure/persistence/transactions';
import type {
  ICreateUserProfileInput,
  IUserProfileEntity,
  IUserProfilePublicEntity,
  IUpdateUserProfileInput,
} from 'src/modules/users/domain/entities/user-profile';
import type { IUserProfileRepository } from 'src/modules/users/domain/repositories/user-profile/i-user-profile.repository';
import type { ReadResult } from '@shared/domain/query';
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
    Record<never, never>,
    UserProfileRow
  >
  implements IUserProfileRepository
{
  protected readonly validationConfig = USER_PROFILE_VALIDATION_CONFIG;
  protected readonly relationConfig = USER_PROFILE_RELATIONS;

  constructor(
    private readonly prismaService: PrismaService,
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
  ): ReadResult<IUserProfilePublicEntity, Record<never, never>> {
    return mapUserProfileRow(row);
  }

  protected toPrismaWhereUnique(id: string): Record<string, unknown> {
    return { id };
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
