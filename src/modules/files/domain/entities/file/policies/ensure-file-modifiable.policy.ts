import {
  FileAccessLevel,
  FileAccessPermission,
  FileAccessTargetType,
} from '../file.enums';
import { FileForbiddenError } from '../errors/file.errors';
import type { IFileEntity } from '../i-file.entity';
import type { IFileAccessEntity } from '../../file-access/i-file-access.entity';
import type { IFileAccessRepository } from '../../../repositories/file-access/i-file-access.repository';
import type { IFileActor } from './file-actor.types';

function hasPermission(
  access: IFileAccessEntity | null,
  permission: FileAccessPermission,
): boolean {
  if (!access) {
    return false;
  }
  if (access.expiresAt && access.expiresAt < new Date()) {
    return false;
  }
  return access.permissions.includes(permission);
}

export async function isFileModifiable(
  file: IFileEntity,
  actor: IFileActor,
  fileAccessRepository: IFileAccessRepository,
): Promise<boolean> {
  if (actor.isStaffUser || file.uploadedBy === actor.userId) {
    return true;
  }

  if (file.accessLevel !== FileAccessLevel.RESTRICTED) {
    return false;
  }

  const userAccess = await fileAccessRepository.findByFileIdAndTarget(
    file.id,
    FileAccessTargetType.USER,
    actor.userId,
  );
  if (hasPermission(userAccess, FileAccessPermission.WRITE)) {
    return true;
  }

  if (actor.userRole) {
    const roleAccess = await fileAccessRepository.findByFileIdAndTarget(
      file.id,
      FileAccessTargetType.ROLE,
      actor.userRole,
    );
    if (hasPermission(roleAccess, FileAccessPermission.WRITE)) {
      return true;
    }
  }

  return false;
}

export async function ensureFileModifiable(
  file: IFileEntity,
  actor: IFileActor,
  fileAccessRepository: IFileAccessRepository,
): Promise<void> {
  const allowed = await isFileModifiable(file, actor, fileAccessRepository);
  if (!allowed) {
    throw new FileForbiddenError(file.id);
  }
}
