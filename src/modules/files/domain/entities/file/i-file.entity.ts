import type {
  FileAccessLevel,
  FileOwnerType,
  FilePurpose,
  FileStatus,
  FileType,
} from './file.enums';

export interface IFileEntity {
  id: string;
  folderId: string | null;
  uploadedBy: string;
  fileName: string;
  originalName: string;
  mimeType: string;
  fileSize: bigint;
  fileUrl: string;
  checksum: string | null;
  status: FileStatus;
  fileType: FileType;
  ownerType: FileOwnerType;
  ownerKind: string | null;
  ownerId: string | null;
  accessLevel: FileAccessLevel;
  purpose: FilePurpose;
  metadata: Record<string, unknown> | null;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}

export type IFilePublicEntity = IFileEntity;

export interface ICreateFileInput {
  folderId?: string | null;
  uploadedBy: string;
  fileName: string;
  originalName: string;
  mimeType?: string;
  fileSize?: bigint;
  fileUrl: string;
  checksum?: string | null;
  status?: FileStatus;
  fileType: FileType;
  ownerType: FileOwnerType;
  ownerKind?: string | null;
  ownerId?: string | null;
  accessLevel: FileAccessLevel;
  purpose: FilePurpose;
  metadata?: Record<string, unknown> | null;
  tags?: string[];
}

export interface IUpdateFileInput {
  folderId?: string | null;
  fileName?: string;
  originalName?: string;
  mimeType?: string;
  fileSize?: bigint;
  checksum?: string | null;
  status?: FileStatus;
  fileType?: FileType;
  accessLevel?: FileAccessLevel;
  purpose?: FilePurpose;
  metadata?: Record<string, unknown> | null;
  tags?: string[];
}
