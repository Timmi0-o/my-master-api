import { DomainError } from '@shared/domain/errors';

export class UnauthenticatedError extends DomainError {
  constructor() {
    super('UNAUTHENTICATED', 'Authentication required');
  }
}

export class InsufficientPermissionsError extends DomainError {
  constructor(requiredPermissions: readonly string[]) {
    super('INSUFFICIENT_PERMISSIONS', 'Insufficient permissions', {
      requiredPermissions: [...requiredPermissions],
    });
  }
}

export class StaffAccessRequiredError extends DomainError {
  constructor() {
    super('STAFF_ACCESS_REQUIRED', 'Staff access required');
  }
}
