import {
  RolePermissionAlreadyExistsError,
  RolePermissionNotFoundError,
} from 'src/modules/authorization/domain/entities/role-permission';
import {
  isPrismaKnownError,
  normalizeUnknownPrismaError,
} from '@shared/infrastructure/persistence/repositories/shared';

export type RolePermissionWriteErrorContext = {
  id?: string;
  roleId?: string;
  permissionId?: string;
};

export function mapRolePermissionWriteError(
  error: unknown,
  context: RolePermissionWriteErrorContext,
): Error {
  if (!isPrismaKnownError(error)) {
    return normalizeUnknownPrismaError(error);
  }

  if (
    error.code === 'P2002' &&
    context.roleId !== undefined &&
    context.permissionId !== undefined
  ) {
    return new RolePermissionAlreadyExistsError(
      context.roleId,
      context.permissionId,
    );
  }

  if (
    error.code === 'P2025' &&
    context.roleId !== undefined &&
    context.permissionId !== undefined
  ) {
    return new RolePermissionNotFoundError(
      context.roleId,
      context.permissionId,
    );
  }

  if (error.code === 'P2025' && context.id !== undefined) {
    return new RolePermissionNotFoundError(
      context.roleId ?? context.id,
      context.permissionId ?? context.id,
    );
  }

  return error;
}
