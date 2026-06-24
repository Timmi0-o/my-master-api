import type { FileAccess as PrismaFileAccess } from '@prisma/client';
import {
  FileAccessPermission,
  FileAccessTargetType,
  type IFileAccessEntity,
} from '../../../../domain/entities/file-access/i-file-access.entity';

export function mapFileAccessRow(row: PrismaFileAccess): IFileAccessEntity {
  return {
    id: row.id,
    fileId: row.fileId,
    targetType: row.targetType as FileAccessTargetType,
    targetId: row.targetId,
    grantedBy: row.grantedBy,
    permissions: row.permissions as FileAccessPermission[],
    reason: row.reason,
    expiresAt: row.expiresAt,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}
