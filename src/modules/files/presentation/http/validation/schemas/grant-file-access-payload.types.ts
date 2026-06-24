import type {
  FileAccessPermission,
  FileAccessTargetType,
} from 'src/modules/files/domain/entities/file';

export interface IGrantFileAccessPayload {
  targetType: FileAccessTargetType;
  targetId: string;
  permissions: FileAccessPermission[];
  reason?: string | null;
  expiresAt?: string | null;
}
