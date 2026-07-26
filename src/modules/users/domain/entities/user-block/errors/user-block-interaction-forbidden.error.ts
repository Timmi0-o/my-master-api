import { DomainError } from '@shared/domain/errors';

export class UserBlockInteractionForbiddenError extends DomainError {
  constructor(userIdA: string, userIdB: string) {
    super(
      'USER_BLOCK_INTERACTION_FORBIDDEN',
      'Interaction between users is forbidden due to a block',
      { userIdA, userIdB },
    );
  }
}
