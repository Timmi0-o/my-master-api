import { DomainError } from '@shared/domain/errors';

export class UserBlockForbiddenError extends DomainError {
  constructor(userBlockId?: string) {
    super(
      'USER_BLOCK_FORBIDDEN',
      'User block access forbidden',
      userBlockId ? { userBlockId } : {},
    );
  }
}
