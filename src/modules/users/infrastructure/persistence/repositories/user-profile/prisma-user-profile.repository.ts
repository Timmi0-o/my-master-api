import { Injectable } from '@nestjs/common';
import type { ReadResult } from 'src/modules/shared/domain/query';
import { PrismaService } from 'src/modules/shared/infrastructure/persistence/prisma/prisma.service';
import { PrismaReadRepository } from 'src/modules/shared/infrastructure/persistence/repositories/base/prisma-read.repository';
import {
  ICreateUserProfileInput,
  IUserProfileEntity,
  IUpdateUserProfileInput,
} from 'src/modules/users/domain/entities/user-profile';
import { IUserProfileRepository } from 'src/modules/users/domain/repositories/user-profile/i-user-profile.repository';
import {
  mapUserProfileRow,
  UserProfileRow,
} from '../../row-mappers/user-profile';
import {
  USER_PROFILE_RELATIONS,
  USER_PROFILE_VALIDATION_CONFIG,
} from './user-profile.relations';

@Injectable()
export class PrismaUserProfileRepository
  extends PrismaReadRepository<
    IUserProfileEntity,
    string,
    Record<never, never>,
    UserProfileRow
  >
  implements IUserProfileRepository
{
  protected readonly validationConfig = USER_PROFILE_VALIDATION_CONFIG;
  protected readonly relationConfig = USER_PROFILE_RELATIONS;

  constructor(private readonly prismaService: PrismaService) {
    super();
  }

  protected getDelegate() {
    return this.prismaService.userProfile;
  }

  protected mapRow(
    row: UserProfileRow,
  ): ReadResult<IUserProfileEntity, Record<never, never>> {
    return mapUserProfileRow(row);
  }

  protected toPrismaWhereUnique(id: string): Record<string, unknown> {
    return { id };
  }

  async findEntityById(id: string): Promise<IUserProfileEntity | null> {
    const row = await this.prismaService.userProfile.findUnique({
      where: { id },
    });
    return row ? mapUserProfileRow(row) : null;
  }

  async create(input: ICreateUserProfileInput): Promise<IUserProfileEntity> {
    const row = await this.prismaService.userProfile.create({ data: input });
    return mapUserProfileRow(row);
  }

  async update(
    id: string,
    input: IUpdateUserProfileInput,
  ): Promise<IUserProfileEntity> {
    const row = await this.prismaService.userProfile.update({
      where: { id },
      data: input,
    });
    return mapUserProfileRow(row);
  }

  async softDeleteById(id: string): Promise<boolean> {
    const row = await this.prismaService.userProfile.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
    return row.deletedAt != null;
  }
}
