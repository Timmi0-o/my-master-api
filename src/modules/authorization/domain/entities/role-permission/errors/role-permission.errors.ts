import { DomainError } from '@shared/domain/errors';

export class RolePermissionNotFoundError extends DomainError {
  constructor(roleId: string, permissionId: string) {
    super('ROLE_PERMISSION_NOT_FOUND', 'Role permission not found', {
      roleId,
      permissionId,
    });
  }
}

export class RolePermissionAlreadyExistsError extends DomainError {
  constructor(roleId: string, permissionId: string) {
    super('ROLE_PERMISSION_ALREADY_EXISTS', 'Role permission already exists', {
      roleId,
      permissionId,
    });
  }
}
