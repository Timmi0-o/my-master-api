import { Inject, Injectable } from '@nestjs/common';
import { LOGGER_TOKEN, type ILogger } from '@shared/domain/logging/logger.token';
import type { TransactionScope } from '@shared/domain/transactions';
import { unwrapPrismaTxFromScope } from '@shared/infrastructure/persistence/transactions';
import type { ReadResult } from '@shared/domain/query';
import { PrismaService } from '@shared/infrastructure/persistence/prisma/prisma.service';
import { PrismaReadRepository } from '@shared/infrastructure/persistence/repositories/base/prisma-read.repository';
import type {
  ICreateFileInput,
  IFileEntity,
  IFilePublicEntity,
  IUpdateFileInput,
} from 'src/modules/files/domain/entities/file';
import type { IFileRepository } from 'src/modules/files/domain/repositories/file/i-file.repository';
import {
  mapFileRow,
  mapFileToPrismaCreate,
  type FileRow,
} from '../../row-mappers/file/file.row-mapper';
import {
  FILE_RELATIONS,
  FILE_VALIDATION_CONFIG,
} from './file.relations';
import { mapFileWriteError } from './file-write-error.mapper';

@Injectable()
export class PrismaFileRepository
  extends PrismaReadRepository<
    IFilePublicEntity,
    string,
    Record<never, never>,
    FileRow
  >
  implements IFileRepository
{
  protected readonly validationConfig = FILE_VALIDATION_CONFIG;
  protected readonly relationConfig = FILE_RELATIONS;

  constructor(
    private readonly prismaService: PrismaService,
    @Inject(LOGGER_TOKEN) logger: ILogger,
  ) {
    super(logger);
  }

  protected getDelegate(scope?: TransactionScope) {
    return scope
      ? unwrapPrismaTxFromScope(scope).file
      : this.prismaService.file;
  }

  protected mapRow(
    row: FileRow,
  ): ReadResult<IFilePublicEntity, Record<never, never>> {
    return mapFileRow(row);
  }

  protected toPrismaWhereUnique(id: string): Record<string, unknown> {
    return { id };
  }

  async findEntityById(
    id: string,
    scope?: TransactionScope,
  ): Promise<IFileEntity | null> {
    const row = await this.getDelegate(scope).findUnique({
      where: { id },
    });
    return row ? mapFileRow(row as FileRow) : null;
  }

  async findEntityByUrl(
    fileUrl: string,
    scope?: TransactionScope,
  ): Promise<IFileEntity | null> {
    const row = await this.getDelegate(scope).findUnique({
      where: { fileUrl },
    });
    return row ? mapFileRow(row as FileRow) : null;
  }

  async findEntitiesByIds(
    ids: string[],
    scope?: TransactionScope,
  ): Promise<IFileEntity[]> {
    if (ids.length === 0) {
      return [];
    }

    const rows = await this.getDelegate(scope).findMany({
      where: { id: { in: ids }, deletedAt: null },
    });
    return rows.map((row) => mapFileRow(row as FileRow));
  }

  async create(
    data: ICreateFileInput,
    scope?: TransactionScope,
  ): Promise<IFileEntity> {
    try {
      const row = await this.getDelegate(scope).create({
        data: mapFileToPrismaCreate(data),
      });
      return mapFileRow(row as FileRow);
    } catch (error) {
      throw mapFileWriteError(error, { fileUrl: data.fileUrl });
    }
  }

  async insertMany(
    data: ICreateFileInput[],
    scope?: TransactionScope,
  ): Promise<IFileEntity[]> {
    if (data.length === 0) {
      return [];
    }

    const created: IFileEntity[] = [];
    for (const item of data) {
      created.push(await this.create(item, scope));
    }
    return created;
  }

  async update(
    id: string,
    patch: IUpdateFileInput,
    scope?: TransactionScope,
  ): Promise<IFileEntity> {
    try {
      const row = await this.getDelegate(scope).update({
        where: { id },
        data: {
          folderId: patch.folderId,
          fileName: patch.fileName,
          originalName: patch.originalName,
          mimeType: patch.mimeType,
          fileSize: patch.fileSize,
          checksum: patch.checksum,
          status: patch.status,
          fileType: patch.fileType,
          accessLevel: patch.accessLevel,
          purpose: patch.purpose,
          metadata:
            patch.metadata != null ? (patch.metadata as object) : undefined,
          tags: patch.tags,
        },
      });
      return mapFileRow(row as FileRow);
    } catch (error) {
      throw mapFileWriteError(error, { id });
    }
  }

  async softDeleteMany(ids: string[], scope?: TransactionScope): Promise<number> {
    try {
      const result = await this.getDelegate(scope).updateMany({
        where: { id: { in: ids }, deletedAt: null },
        data: { deletedAt: new Date() },
      });
      return result.count;
    } catch (error) {
      throw mapFileWriteError(error, {});
    }
  }

  async softDeleteByFolderIds(
    folderIds: string[],
    scope?: TransactionScope,
  ): Promise<number> {
    try {
      const result = await this.getDelegate(scope).updateMany({
        where: { folderId: { in: folderIds }, deletedAt: null },
        data: { deletedAt: new Date() },
      });
      return result.count;
    } catch (error) {
      throw mapFileWriteError(error, {});
    }
  }
}
