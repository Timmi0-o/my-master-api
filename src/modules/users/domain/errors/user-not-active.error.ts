import { DomainError } from 'src/modules/shared/domain/errors';

export class UserNotActiveError extends DomainError {
  constructor(userId?: string) {
    super('USER_NOT_ACTIVE', 'User is not active', userId ? { userId } : undefined);
  }
}
