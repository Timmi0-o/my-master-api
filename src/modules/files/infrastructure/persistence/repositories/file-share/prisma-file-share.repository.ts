import { Injectable } from '@nestjs/common';
import type { TransactionScope } from '@shared/domain/transactions';
import { unwrapPrismaTxFromScope } from '@shared/infrastructure/persistence/transactions';
import { PrismaService } from '@shared/infrastructure/persistence/prisma/prisma.service';
import type { ICreateFileShareInput } from '../../../../domain/entities/file-share/i-file-share.entity';
import type { IFileShareRepository } from '../../../../domain/repositories/file-share/i-file-share.repository';
import { mapFileShareRow } from '../../row-mappers/file-share/file-share.row-mapper';

@Injectable()
export class PrismaFileShareRepository implements IFileShareRepository {
  constructor(private readonly prisma: PrismaService) {}

  private getDelegate(scope?: TransactionScope) {
    return scope
      ? unwrapPrismaTxFromScope(scope).fileShare
      : this.prisma.fileShare;
  }

  async findById(id: string, scope?: TransactionScope) {
    const row = await this.getDelegate(scope).findUnique({ where: { id } });
    return row ? mapFileShareRow(row) : null;
  }

  async findByToken(token: string, scope?: TransactionScope) {
    const row = await this.getDelegate(scope).findUnique({ where: { token } });
    return row ? mapFileShareRow(row) : null;
  }

  async findByFileId(fileId: string, scope?: TransactionScope) {
    const rows = await this.getDelegate(scope).findMany({ where: { fileId } });
    return rows.map(mapFileShareRow);
  }

  async create(data: ICreateFileShareInput, scope?: TransactionScope) {
    const row = await this.getDelegate(scope).create({
      data: {
        fileId: data.fileId,
        token: data.token,
        password: data.password ?? null,
        allowedIps: data.allowedIps ?? [],
        maxDownloads: data.maxDownloads ?? null,
        maxViews: data.maxViews ?? null,
        allowDownload: data.allowDownload ?? true,
        allowPreview: data.allowPreview ?? true,
        expiresAt: data.expiresAt ?? null,
        name: data.name ?? null,
        description: data.description ?? null,
        createdBy: data.createdBy,
      },
    });
    return mapFileShareRow(row);
  }

  async update(
    id: string,
    data: Partial<{
      downloads: number;
      views: number;
      lastAccessAt: Date | null;
      password: string | null;
    }>,
    scope?: TransactionScope,
  ) {
    const row = await this.getDelegate(scope).update({
      where: { id },
      data,
    });
    return mapFileShareRow(row);
  }

  async delete(id: string, scope?: TransactionScope) {
    await this.getDelegate(scope).delete({ where: { id } });
  }
}
