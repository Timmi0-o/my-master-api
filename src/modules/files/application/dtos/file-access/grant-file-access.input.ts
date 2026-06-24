import type {
  FileAccessPermission,
  FileAccessTargetType,
} from 'src/modules/files/domain/entities/file';
import type { IFileActorInput } from '../common/i-file-actor.input';

export interface IGrantFileAccessApplicationInput {
  fileId: string;
  targetType: FileAccessTargetType;
  targetId: string;
  permissions: FileAccessPermission[];
  reason?: string | null;
  expiresAt?: Date | null;
  actor: IFileActorInput;
}
