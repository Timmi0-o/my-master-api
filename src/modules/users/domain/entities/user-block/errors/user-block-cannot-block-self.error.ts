import { DomainError } from '@shared/domain/errors';

export class UserBlockCannotBlockSelfError extends DomainError {
  constructor(userId: string) {
    super(
      'USER_BLOCK_CANNOT_BLOCK_SELF',
      'Cannot block yourself',
      { userId },
    );
  }
}
