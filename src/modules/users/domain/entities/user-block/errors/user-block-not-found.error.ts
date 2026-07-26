import { DomainError } from '@shared/domain/errors';

export class UserBlockNotFoundError extends DomainError {
  constructor(userBlockId: string) {
    super('USER_BLOCK_NOT_FOUND', 'User block not found', { userBlockId });
  }
}
