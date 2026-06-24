import { DomainError } from '@shared/domain/errors';

export class PermissionNotFoundError extends DomainError {
  constructor(permissionId: string) {
    super('PERMISSION_NOT_FOUND', 'Permission not found', { permissionId });
  }
}
