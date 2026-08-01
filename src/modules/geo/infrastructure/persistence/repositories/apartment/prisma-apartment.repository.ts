import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '@shared/infrastructure/persistence/prisma/prisma.service';
import type { IApartmentPublicEntity } from 'src/modules/geo/domain/entities/apartment/i-apartment.entity';
import type {
  IFindApartmentsParams,
  IApartmentRepository,
} from 'src/modules/geo/domain/repositories/apartment';

@Injectable()
export class PrismaApartmentRepository implements IApartmentRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findMany(params: IFindApartmentsParams): Promise<IApartmentPublicEntity[]> {
    const where: Prisma.ApartmentWhereInput = {
      buildingId: params.buildingId,
    };
    if (params.search?.trim()) {
      const q = params.search.trim();
      where.OR = [
        { name: { contains: q, mode: 'insensitive' } },
        { number: { contains: q, mode: 'insensitive' } },
      ];
    }

    return this.prisma.apartment.findMany({
      where,
      select: {
        id: true,
        name: true,
        number: true,
        buildingId: true,
      },
      orderBy: { name: 'asc' },
      take: params.limit,
      skip: params.offset,
    });
  }
}
