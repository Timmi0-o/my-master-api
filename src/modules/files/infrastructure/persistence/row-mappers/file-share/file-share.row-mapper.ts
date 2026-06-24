import type { FileShare as PrismaFileShare } from '@prisma/client';
import type { IFileShareEntity } from '../../../../domain/entities/file-share/i-file-share.entity';

export function mapFileShareRow(row: PrismaFileShare): IFileShareEntity {
  return {
    id: row.id,
    fileId: row.fileId,
    token: row.token,
    password: row.password,
    allowedIps: row.allowedIps,
    maxDownloads: row.maxDownloads,
    downloads: row.downloads,
    maxViews: row.maxViews,
    views: row.views,
    allowDownload: row.allowDownload,
    allowPreview: row.allowPreview,
    expiresAt: row.expiresAt,
    name: row.name,
    description: row.description,
    createdBy: row.createdBy,
    lastAccessAt: row.lastAccessAt,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}
