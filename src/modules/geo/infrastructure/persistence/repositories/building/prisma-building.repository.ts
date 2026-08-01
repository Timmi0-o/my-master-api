import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '@shared/infrastructure/persistence/prisma/prisma.service';
import type { IBuildingPublicEntity } from 'src/modules/geo/domain/entities/building/i-building.entity';
import type {
  IFindBuildingsParams,
  IBuildingRepository,
} from 'src/modules/geo/domain/repositories/building';

@Injectable()
export class PrismaBuildingRepository implements IBuildingRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findMany(params: IFindBuildingsParams): Promise<IBuildingPublicEntity[]> {
    const where: Prisma.BuildingWhereInput = {
      streetId: params.streetId,
    };
    if (params.search?.trim()) {
      const q = params.search.trim();
      where.OR = [
        { name: { contains: q, mode: 'insensitive' } },
        { houseNum: { contains: q, mode: 'insensitive' } },
      ];
    }

    return this.prisma.building.findMany({
      where,
      select: {
        id: true,
        slug: true,
        name: true,
        houseNum: true,
        streetId: true,
        localityId: true,
        postalCode: true,
      },
      orderBy: { name: 'asc' },
      take: params.limit,
      skip: params.offset,
    });
  }
}
