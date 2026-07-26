import { DomainError } from '@shared/domain/errors';

export class UserBlockAlreadyExistsError extends DomainError {
  constructor(blockerUserId: string, blockedUserId: string) {
    super('USER_BLOCK_ALREADY_EXISTS', 'User block already exists', {
      blockerUserId,
      blockedUserId,
    });
  }
}
