import { Injectable } from '@nestjs/common';
import type { TransactionScope } from '@shared/domain/transactions';
import { PrismaService } from '@shared/infrastructure/persistence/prisma/prisma.service';
import { unwrapPrismaTxFromScope } from '@shared/infrastructure/persistence/transactions';
import type {
  ICreateImageInput,
  IImagePublicEntity,
  ImageEntityType,
} from 'src/modules/masters/domain/entities/image';
import type { IImageRepository } from 'src/modules/masters/domain/repositories/image/i-image.repository';
import {
  mapFileRow,
  type FileRow,
} from 'src/modules/files/infrastructure/persistence/row-mappers/file/file.row-mapper';
import {
  mapImageRow,
  type ImageRow,
} from '../../row-mappers/image/map-image-row';

@Injectable()
export class PrismaImageRepository implements IImageRepository {
  constructor(private readonly prisma: PrismaService) {}

  private getDelegate(scope?: TransactionScope) {
    return scope
      ? unwrapPrismaTxFromScope(scope).image
      : this.prisma.image;
  }

  async findByEntity(
    entityType: ImageEntityType,
    entityId: string,
    scope?: TransactionScope,
  ) {
    const rows = await this.getDelegate(scope).findMany({
      where: { entityType, entityId },
      orderBy: { createdAt: 'asc' },
    });

    return rows.map((row) => mapImageRow(row as ImageRow));
  }

  async findByEntityAndFileIds(
    entityType: ImageEntityType,
    entityId: string,
    fileIds: readonly string[],
    scope?: TransactionScope,
  ) {
    if (fileIds.length === 0) {
      return [];
    }

    const rows = await this.getDelegate(scope).findMany({
      where: {
        entityType,
        entityId,
        fileId: { in: [...fileIds] },
      },
    });

    return rows.map((row) => mapImageRow(row as ImageRow));
  }

  async findByEntityTypeAndEntityIds(
    entityType: ImageEntityType,
    entityIds: readonly string[],
    options?: { includeFile?: boolean },
    scope?: TransactionScope,
  ): Promise<IImagePublicEntity[]> {
    if (entityIds.length === 0) {
      return [];
    }

    const rows = await this.getDelegate(scope).findMany({
      where: {
        entityType,
        entityId: { in: [...entityIds] },
      },
      orderBy: { createdAt: 'asc' },
      ...(options?.includeFile
        ? {
            include: {
              file: true,
            },
          }
        : {}),
    });

    return rows.map((row) => {
      const mapped = mapImageRow(row as ImageRow);
      const withFile = row as ImageRow & { file?: FileRow | null };

      if (withFile.file != null) {
        return {
          ...mapped,
          file: mapFileRow(withFile.file),
        };
      }

      return mapped;
    });
  }

  async deleteByEntityAndFileIds(
    entityType: ImageEntityType,
    entityId: string,
    fileIds: readonly string[],
    scope: TransactionScope,
  ): Promise<number> {
    if (fileIds.length === 0) {
      return 0;
    }

    const result = await this.getDelegate(scope).deleteMany({
      where: {
        entityType,
        entityId,
        fileId: { in: [...fileIds] },
      },
    });

    return result.count;
  }

  async create(input: ICreateImageInput, scope: TransactionScope) {
    const row = await this.getDelegate(scope).create({
      data: {
        entityType: input.entityType,
        entityId: input.entityId,
        fileId: input.fileId,
      },
    });

    return mapImageRow(row as ImageRow);
  }

  async createMany(
    inputs: readonly ICreateImageInput[],
    scope: TransactionScope,
  ) {
    if (inputs.length === 0) {
      return [];
    }

    const tx = unwrapPrismaTxFromScope(scope);
    const rows = await tx.image.createManyAndReturn({
      data: [...inputs],
    });

    return rows.map((row) => mapImageRow(row as ImageRow));
  }
}
