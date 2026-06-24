import type {
  FileAccessPermission,
  FileAccessTargetType,
} from '../file/file.enums';

export type { FileAccessPermission, FileAccessTargetType };

export interface IFileAccessEntity {
  id: string;
  fileId: string;
  targetType: FileAccessTargetType;
  targetId: string;
  grantedBy: string;
  permissions: FileAccessPermission[];
  reason: string | null;
  expiresAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface ICreateFileAccessInput {
  fileId: string;
  targetType: FileAccessTargetType;
  targetId: string;
  grantedBy: string;
  permissions: FileAccessPermission[];
  reason?: string | null;
  expiresAt?: Date | null;
}
