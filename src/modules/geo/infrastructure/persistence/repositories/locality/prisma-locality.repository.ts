import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '@shared/infrastructure/persistence/prisma/prisma.service';
import type { ILocalityPublicEntity } from 'src/modules/geo/domain/entities/locality/i-locality.entity';
import type {
  IFindLocalitiesParams,
  ILocalityRepository,
} from 'src/modules/geo/domain/repositories/locality';

const LOCALITY_SELECT = {
  id: true,
  slug: true,
  name: true,
  type: true,
  main: true,
  countryId: true,
  regionId: true,
  descriptions: true,
} satisfies Prisma.LocalitySelect;

@Injectable()
export class PrismaLocalityRepository implements ILocalityRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findMany(params: IFindLocalitiesParams): Promise<ILocalityPublicEntity[]> {
    const where: Prisma.LocalityWhereInput = {};
    if (params.regionId) {
      where.regionId = params.regionId;
    }
    if (params.search?.trim()) {
      where.name = { contains: params.search.trim(), mode: 'insensitive' };
    }

    const rows = await this.prisma.locality.findMany({
      where,
      select: LOCALITY_SELECT,
      orderBy: [{ main: 'desc' }, { name: 'asc' }],
      take: params.limit,
      skip: params.offset,
    });

    return rows.map((row) => ({
      ...row,
      type: String(row.type),
    }));
  }

  async findBySlugOrId(slugOrId: string): Promise<ILocalityPublicEntity | null> {
    const row = await this.prisma.locality.findFirst({
      where: {
        OR: [{ id: slugOrId }, { slug: slugOrId }],
      },
      select: LOCALITY_SELECT,
    });

    if (!row) {
      return null;
    }

    return { ...row, type: String(row.type) };
  }
}
