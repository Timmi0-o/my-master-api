import { Injectable } from '@nestjs/common';
import type { TransactionScope } from '@shared/domain/transactions';
import { PrismaService } from '@shared/infrastructure/persistence/prisma/prisma.service';
import { unwrapPrismaTxFromScope } from '@shared/infrastructure/persistence/transactions';
import type { ICreateMasterServiceImageInput } from 'src/modules/masters/domain/entities/master-service-image';
import type { IMasterServiceImageRepository } from 'src/modules/masters/domain/repositories/master-service-image/i-master-service-image.repository';
import {
  mapMasterServiceImageRow,
  type MasterServiceImageRow,
} from '../../row-mappers/master-service-image/map-master-service-image-row';

@Injectable()
export class PrismaMasterServiceImageRepository implements IMasterServiceImageRepository {
  constructor(private readonly prisma: PrismaService) {}

  private getDelegate(scope?: TransactionScope) {
    return scope
      ? unwrapPrismaTxFromScope(scope).masterServiceImage
      : this.prisma.masterServiceImage;
  }

  async findByMasterServiceId(
    masterServiceId: string,
    scope?: TransactionScope,
  ) {
    const rows = await this.getDelegate(scope).findMany({
      where: { masterServiceId },
    });

    return rows.map((row) =>
      mapMasterServiceImageRow(row as MasterServiceImageRow),
    );
  }

  async findByMasterServiceIdAndFileIds(
    masterServiceId: string,
    fileIds: readonly string[],
    scope?: TransactionScope,
  ) {
    if (fileIds.length === 0) {
      return [];
    }

    const rows = await this.getDelegate(scope).findMany({
      where: {
        masterServiceId,
        fileId: { in: [...fileIds] },
      },
    });

    return rows.map((row) =>
      mapMasterServiceImageRow(row as MasterServiceImageRow),
    );
  }

  async deleteByMasterServiceIdAndFileIds(
    masterServiceId: string,
    fileIds: readonly string[],
    scope: TransactionScope,
  ): Promise<number> {
    if (fileIds.length === 0) {
      return 0;
    }

    const result = await this.getDelegate(scope).deleteMany({
      where: {
        masterServiceId,
        fileId: { in: [...fileIds] },
      },
    });

    return result.count;
  }

  async create(input: ICreateMasterServiceImageInput, scope: TransactionScope) {
    const row = await this.getDelegate(scope).create({
      data: {
        masterServiceId: input.masterServiceId,
        fileId: input.fileId,
      },
    });

    return mapMasterServiceImageRow(row as MasterServiceImageRow);
  }

  async createMany(
    inputs: readonly ICreateMasterServiceImageInput[],
    scope: TransactionScope,
  ) {
    if (inputs.length === 0) {
      return [];
    }

    const tx = unwrapPrismaTxFromScope(scope);
    const rows = await tx.masterServiceImage.createManyAndReturn({
      data: [...inputs],
    });

    return rows.map((row) =>
      mapMasterServiceImageRow(row as MasterServiceImageRow),
    );
  }
}
