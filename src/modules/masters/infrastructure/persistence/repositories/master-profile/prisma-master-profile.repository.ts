import { Injectable } from '@nestjs/common';
import type {
  ICreateMasterProfileInput,
  IMasterProfileEntity,
  IMasterProfilePublicEntity,
  IMasterProfileRelations,
  IUpdateMasterProfileInput,
} from 'src/modules/masters/domain/entities/master-profile';
import type { IMasterProfileRepository } from 'src/modules/masters/domain/repositories/master-profile/i-master-profile.repository';
import type { ReadResult } from 'src/modules/shared/domain/query';
import { PrismaService } from 'src/modules/shared/infrastructure/persistence/prisma/prisma.service';
import { PrismaReadRepository } from 'src/modules/shared/infrastructure/persistence/repositories/base/prisma-read.repository';
import {
  mapMasterProfileRow,
  type MasterProfileRow,
} from '../../row-mappers/master-profile';
import { MASTER_PROFILE_RELATIONS } from './master-profile.relations';

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
  protected readonly relationConfig = MASTER_PROFILE_RELATIONS;

  constructor(private readonly prismaService: PrismaService) {
    super();
  }

  protected getDelegate() {
    return this.prismaService.masterProfile;
  }

  protected mapRow(
    row: MasterProfileRow,
  ): ReadResult<IMasterProfilePublicEntity, IMasterProfileRelations> {
    return mapMasterProfileRow(row);
  }

  protected toPrismaWhereUnique(id: string): Record<string, unknown> {
    return { id };
  }

  async findEntityById(id: string): Promise<IMasterProfileEntity | null> {
    const row = await this.prismaService.masterProfile.findUnique({
      where: { id },
    });
    return row ? mapMasterProfileRow(row as MasterProfileRow) : null;
  }

  async create(
    input: ICreateMasterProfileInput,
  ): Promise<IMasterProfileEntity> {
    const row = await this.prismaService.masterProfile.create({ data: input });
    return mapMasterProfileRow(row as MasterProfileRow);
  }

  async update(
    id: string,
    input: IUpdateMasterProfileInput,
  ): Promise<IMasterProfileEntity> {
    const row = await this.prismaService.masterProfile.update({
      where: { id },
      data: input,
    });
    return mapMasterProfileRow(row as MasterProfileRow);
  }

  async softDeleteById(id: string): Promise<boolean> {
    const row = await this.prismaService.masterProfile.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
    return row.deletedAt != null;
  }
}
