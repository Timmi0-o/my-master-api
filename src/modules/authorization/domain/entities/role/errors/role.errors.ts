import { DomainError } from '@shared/domain/errors';

export class RoleNotFoundError extends DomainError {
  constructor(roleId: string) {
    super('ROLE_NOT_FOUND', 'Role not found', { roleId });
  }
}
