import type { File as PrismaFile } from '@prisma/client';

export type FileRow = PrismaFile;
import {
  FileAccessLevel,
  FileOwnerType,
  FilePurpose,
  FileStatus,
  FileType,
  type ICreateFileInput,
  type IFileEntity,
} from '../../../../domain/entities/file';

export function mapFileRow(row: PrismaFile): IFileEntity {
  return {
    id: row.id,
    folderId: row.folderId,
    uploadedBy: row.uploadedBy,
    fileName: row.fileName,
    originalName: row.originalName,
    mimeType: row.mimeType,
    fileSize: row.fileSize,
    fileUrl: row.fileUrl,
    checksum: row.checksum,
    status: row.status as FileStatus,
    fileType: row.fileType as FileType,
    ownerType: row.ownerType as FileOwnerType,
    ownerKind: row.ownerKind,
    ownerId: row.ownerId,
    accessLevel: row.accessLevel as FileAccessLevel,
    purpose: row.purpose as FilePurpose,
    metadata: (row.metadata as Record<string, unknown> | null) ?? null,
    tags: row.tags,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
    deletedAt: row.deletedAt,
  };
}

export function mapFileToPrismaCreate(data: ICreateFileInput) {
  return {
    folderId: data.folderId ?? null,
    uploadedBy: data.uploadedBy,
    fileName: data.fileName,
    originalName: data.originalName,
    mimeType: data.mimeType ?? '',
    fileSize: data.fileSize ?? BigInt(0),
    fileUrl: data.fileUrl,
    checksum: data.checksum ?? null,
    status: data.status ?? FileStatus.PENDING,
    fileType: data.fileType,
    ownerType: data.ownerType,
    ownerKind: data.ownerKind ?? null,
    ownerId: data.ownerId ?? null,
    accessLevel: data.accessLevel,
    purpose: data.purpose,
    metadata: data.metadata != null ? (data.metadata as object) : undefined,
    tags: data.tags ?? [],
  };
}
