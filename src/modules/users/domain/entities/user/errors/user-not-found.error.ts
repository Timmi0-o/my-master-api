import { DomainError } from '@shared/domain/errors';

export class UserNotFoundError extends DomainError {
  constructor(userId: string) {
    super('USER_NOT_FOUND', 'User not found', { userId });
  }
}
