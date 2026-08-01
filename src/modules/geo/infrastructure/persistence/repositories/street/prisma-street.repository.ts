import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '@shared/infrastructure/persistence/prisma/prisma.service';
import type { IStreetPublicEntity } from 'src/modules/geo/domain/entities/street/i-street.entity';
import type {
  IFindStreetsParams,
  IStreetRepository,
} from 'src/modules/geo/domain/repositories/street';

@Injectable()
export class PrismaStreetRepository implements IStreetRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findMany(params: IFindStreetsParams): Promise<IStreetPublicEntity[]> {
    const where: Prisma.StreetWhereInput = {
      localityId: params.localityId,
    };
    if (params.search?.trim()) {
      where.name = { contains: params.search.trim(), mode: 'insensitive' };
    }

    return this.prisma.street.findMany({
      where,
      select: {
        id: true,
        slug: true,
        name: true,
        localityId: true,
        descriptions: true,
      },
      orderBy: { name: 'asc' },
      take: params.limit,
      skip: params.offset,
    });
  }
}
