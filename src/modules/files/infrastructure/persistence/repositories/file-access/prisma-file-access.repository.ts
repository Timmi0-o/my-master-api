import { Injectable } from '@nestjs/common';
import type { TransactionScope } from '@shared/domain/transactions';
import { unwrapPrismaTxFromScope } from '@shared/infrastructure/persistence/transactions';
import { PrismaService } from '@shared/infrastructure/persistence/prisma/prisma.service';
import type {
  FileAccessTargetType,
  ICreateFileAccessInput,
} from '../../../../domain/entities/file-access/i-file-access.entity';
import type { IFileAccessRepository } from '../../../../domain/repositories/file-access/i-file-access.repository';
import { mapFileAccessRow } from '../../row-mappers/file-access/file-access.row-mapper';

@Injectable()
export class PrismaFileAccessRepository implements IFileAccessRepository {
  constructor(private readonly prisma: PrismaService) {}

  private getDelegate(scope?: TransactionScope) {
    return scope
      ? unwrapPrismaTxFromScope(scope).fileAccess
      : this.prisma.fileAccess;
  }

  async findById(id: string, scope?: TransactionScope) {
    const row = await this.getDelegate(scope).findUnique({ where: { id } });
    return row ? mapFileAccessRow(row) : null;
  }

  async findByFileIdAndTarget(
    fileId: string,
    targetType: FileAccessTargetType,
    targetId: string,
    scope?: TransactionScope,
  ) {
    const row = await this.getDelegate(scope).findUnique({
      where: {
        fileId_targetType_targetId: { fileId, targetType, targetId },
      },
    });
    return row ? mapFileAccessRow(row) : null;
  }

  async findByFileId(fileId: string, scope?: TransactionScope) {
    const rows = await this.getDelegate(scope).findMany({ where: { fileId } });
    return rows.map(mapFileAccessRow);
  }

  async create(data: ICreateFileAccessInput, scope?: TransactionScope) {
    const row = await this.getDelegate(scope).create({
      data: {
        fileId: data.fileId,
        targetType: data.targetType,
        targetId: data.targetId,
        grantedBy: data.grantedBy,
        permissions: data.permissions,
        reason: data.reason ?? null,
        expiresAt: data.expiresAt ?? null,
      },
    });
    return mapFileAccessRow(row);
  }

  async delete(id: string, scope?: TransactionScope) {
    await this.getDelegate(scope).delete({ where: { id } });
  }
}
