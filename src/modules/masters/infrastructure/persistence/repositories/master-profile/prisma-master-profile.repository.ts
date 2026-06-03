import { Injectable } from '@nestjs/common';
import type { MasterProfile } from '@prisma/client';
import type {
  ICreateMasterProfileInput,
  IMasterProfileEntity,
  IMasterProfilePublicEntity,
  IUpdateMasterProfileInput,
} from 'src/modules/masters/domain/entities/master-profile';
import type { IMasterProfileRepository } from 'src/modules/masters/domain/repositories/master-profile/i-master-profile.repository';
import { PrismaReadRepository } from 'src/modules/shared/infrastructure/persistence/repositories/base/prisma-read.repository';
import { PrismaService } from 'src/modules/shared/infrastructure/persistence/prisma/prisma.service';
import {
  mapMasterProfileEntityRow,
  mapMasterProfilePublicRow,
} from '../../row-mappers/master-profile/map-master-profile-row';

@Injectable()
export class PrismaMasterProfileRepository
  extends PrismaReadRepository<
    IMasterProfilePublicEntity,
    string,
    Record<never, never>,
    MasterProfile
  >
  implements IMasterProfileRepository
{
  constructor(private readonly prismaService: PrismaService) {
    super();
  }

  protected getDelegate() {
    return this.prismaService.masterProfile;
  }

  protected mapRow(row: MasterProfile): IMasterProfilePublicEntity {
    return mapMasterProfilePublicRow(row);
  }

  protected toPrismaWhereUnique(id: string): Record<string, unknown> {
    return { id };
  }

  async findEntityById(id: string): Promise<IMasterProfileEntity | null> {
    const row = await this.prismaService.masterProfile.findUnique({
      where: { id },
    });
    return row ? mapMasterProfileEntityRow(row) : null;
  }

  async create(input: ICreateMasterProfileInput): Promise<IMasterProfileEntity> {
    const row = await this.prismaService.masterProfile.create({ data: input });
    return mapMasterProfileEntityRow(row);
  }

  async update(
    id: string,
    input: IUpdateMasterProfileInput,
  ): Promise<IMasterProfileEntity> {
    const row = await this.prismaService.masterProfile.update({
      where: { id },
      data: input,
    });
    return mapMasterProfileEntityRow(row);
  }

  async softDeleteById(id: string): Promise<boolean> {
    const row = await this.prismaService.masterProfile.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
    return row.deletedAt != null;
  }
}
