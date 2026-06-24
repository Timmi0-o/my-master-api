import type { Folder as PrismaFolder } from '@prisma/client';
import {
  FilePurpose,
  FolderSystemType,
} from '../../../../domain/entities/file/file.enums';
import type { IFolderEntity } from '../../../../domain/entities/folder';

export function mapFolderRow(row: PrismaFolder): IFolderEntity {
  return {
    id: row.id,
    ownerKind: row.ownerKind,
    ownerId: row.ownerId,
    createdBy: row.createdBy,
    name: row.name,
    parentId: row.parentId,
    path: row.path,
    depth: row.depth,
    isSystem: row.isSystem,
    systemType: row.systemType as FolderSystemType | null,
    allowedPurposes: row.allowedPurposes as FilePurpose[],
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
    deletedAt: row.deletedAt,
  };
}
