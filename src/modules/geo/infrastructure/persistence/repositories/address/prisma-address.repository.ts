import { Injectable } from '@nestjs/common';
import { AddressEntityType, Prisma } from '@prisma/client';
import type { TransactionScope } from '@shared/domain/transactions';
import { PrismaService } from '@shared/infrastructure/persistence/prisma/prisma.service';
import { unwrapPrismaTxFromScope } from '@shared/infrastructure/persistence/transactions';
import {
  type EAddressEntityType,
  type IAddressPublicEntity,
  type IUpsertAddressInput,
} from 'src/modules/geo/domain/entities/address';
import type { IAddressRepository } from 'src/modules/geo/domain/repositories/address';

const ADDRESS_INCLUDE = {
  locality: {
    select: { id: true, slug: true, name: true },
  },
  streetEntity: {
    select: { id: true, name: true },
  },
  buildingRef: {
    select: { id: true, name: true, houseNum: true },
  },
  apartmentRef: {
    select: { id: true, name: true, number: true },
  },
} satisfies Prisma.AddressInclude;

function mapAddressRow(
  row: Prisma.AddressGetPayload<{ include: typeof ADDRESS_INCLUDE }>,
): IAddressPublicEntity {
  return {
    entityId: row.entityId,
    entityType: row.entityType as EAddressEntityType,
    countryId: row.countryId,
    regionId: row.regionId,
    districtRegionId: row.districtRegionId,
    localityId: row.localityId,
    localityDistrictId: row.localityDistrictId,
    streetId: row.streetId,
    buildingId: row.buildingId,
    apartmentId: row.apartmentId,
    street: row.street,
    houseNumber: row.houseNumber,
    building: row.building,
    apartment: row.apartment,
    postalCode: row.postalCode,
    additionalInfo: row.additionalInfo,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
    locality: row.locality,
    streetEntity: row.streetEntity,
    buildingRef: row.buildingRef,
    apartmentRef: row.apartmentRef,
  };
}

function toPrismaEntityType(entityType: EAddressEntityType): AddressEntityType {
  return entityType as AddressEntityType;
}

@Injectable()
export class PrismaAddressRepository implements IAddressRepository {
  constructor(private readonly prisma: PrismaService) {}

  private client(scope?: TransactionScope) {
    return scope ? unwrapPrismaTxFromScope(scope) : this.prisma;
  }

  async findByEntity(
    entityType: EAddressEntityType,
    entityId: string,
  ): Promise<IAddressPublicEntity | null> {
    const row = await this.prisma.address.findFirst({
      where: {
        entityId,
        entityType: toPrismaEntityType(entityType),
      },
      include: ADDRESS_INCLUDE,
      orderBy: { updatedAt: 'desc' },
    });

    return row ? mapAddressRow(row) : null;
  }

  async replaceByEntity(
    input: IUpsertAddressInput,
    scope?: TransactionScope,
  ): Promise<IAddressPublicEntity> {
    const db = this.client(scope);
    const entityType = toPrismaEntityType(input.entityType);

    await db.address.deleteMany({
      where: {
        entityId: input.entityId,
        entityType,
      },
    });

    const row = await db.address.create({
      data: {
        entityId: input.entityId,
        entityType,
        localityId: input.localityId,
        countryId: input.countryId ?? null,
        regionId: input.regionId ?? null,
        districtRegionId: input.districtRegionId ?? null,
        localityDistrictId: input.localityDistrictId ?? null,
        streetId: input.streetId ?? null,
        buildingId: input.buildingId ?? null,
        apartmentId: input.apartmentId ?? null,
        street: input.street ?? null,
        houseNumber: input.houseNumber ?? null,
        building: input.building ?? null,
        apartment: input.apartment ?? null,
        postalCode: input.postalCode ?? null,
        additionalInfo: input.additionalInfo ?? null,
      },
      include: ADDRESS_INCLUDE,
    });

    return mapAddressRow(row);
  }

  async deleteByEntity(
    entityType: EAddressEntityType,
    entityId: string,
    scope?: TransactionScope,
  ): Promise<void> {
    const db = this.client(scope);
    await db.address.deleteMany({
      where: {
        entityId,
        entityType: toPrismaEntityType(entityType),
      },
    });
  }

  async findEntityIdsByLocalityId(
    localityId: string,
    entityType: EAddressEntityType,
  ): Promise<string[]> {
    const rows = await this.prisma.address.findMany({
      where: {
        localityId,
        entityType: toPrismaEntityType(entityType),
      },
      select: { entityId: true },
    });

    return [...new Set(rows.map((row) => row.entityId))];
  }
}
