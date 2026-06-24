import {
  FileAccessLevel,
  FileAccessPermission,
  FileAccessTargetType,
  FileOwnerType,
} from '../file.enums';
import { FileForbiddenError } from '../errors/file.errors';
import type { IFileEntity } from '../i-file.entity';
import type { IFileAccessEntity } from '../../file-access/i-file-access.entity';
import type { IFileAccessRepository } from '../../../repositories/file-access/i-file-access.repository';
import type { IFileShareRepository } from '../../../repositories/file-share/i-file-share.repository';
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

function checkPrivateAccess(file: IFileEntity, actor: IFileActor): boolean {
  if (file.uploadedBy === actor.userId) {
    return true;
  }
  if (file.ownerType === FileOwnerType.USER && file.ownerId === actor.userId) {
    return true;
  }
  return false;
}

async function checkRestrictedAccess(
  file: IFileEntity,
  actor: IFileActor,
  fileAccessRepository: IFileAccessRepository,
): Promise<boolean> {
  const userAccess = await fileAccessRepository.findByFileIdAndTarget(
    file.id,
    FileAccessTargetType.USER,
    actor.userId,
  );
  if (hasPermission(userAccess, FileAccessPermission.READ)) {
    return true;
  }
  if (actor.userRole) {
    const roleAccess = await fileAccessRepository.findByFileIdAndTarget(
      file.id,
      FileAccessTargetType.ROLE,
      actor.userRole,
    );
    return hasPermission(roleAccess, FileAccessPermission.READ);
  }
  return false;
}

async function checkSharedAccess(
  file: IFileEntity,
  actor: IFileActor,
  fileShareRepository: IFileShareRepository,
): Promise<boolean> {
  if (!actor.shareToken) {
    return false;
  }
  const share = await fileShareRepository.findByToken(actor.shareToken);
  if (!share || share.fileId !== file.id) {
    return false;
  }
  if (share.expiresAt && share.expiresAt < new Date()) {
    return false;
  }
  if (share.maxViews != null && share.views >= share.maxViews) {
    return false;
  }
  return true;
}

export async function isFileAccessible(
  file: IFileEntity,
  actor: IFileActor,
  deps: {
    fileAccessRepository: IFileAccessRepository;
    fileShareRepository: IFileShareRepository;
  },
): Promise<boolean> {
  if (actor.isStaffUser) {
    return true;
  }

  switch (file.accessLevel) {
    case FileAccessLevel.PUBLIC:
      return true;
    case FileAccessLevel.INTERNAL:
      return false;
    case FileAccessLevel.PRIVATE:
      return checkPrivateAccess(file, actor);
    case FileAccessLevel.RESTRICTED:
      return checkRestrictedAccess(file, actor, deps.fileAccessRepository);
    case FileAccessLevel.SHARED:
      return checkSharedAccess(file, actor, deps.fileShareRepository);
    default:
      return false;
  }
}

export async function ensureFileAccessible(
  file: IFileEntity,
  actor: IFileActor,
  deps: {
    fileAccessRepository: IFileAccessRepository;
    fileShareRepository: IFileShareRepository;
  },
): Promise<void> {
  const allowed = await isFileAccessible(file, actor, deps);
  if (!allowed) {
    throw new FileForbiddenError(file.id);
  }
}
