import { DomainError } from '@shared/domain/errors';

export class MasterSubscriptionBlockedUserError extends DomainError {
  constructor(masterUserId: string) {
    super(
      'MASTER_SUBSCRIPTION_BLOCKED_USER',
      'Cannot subscribe to a user you have blocked',
      { masterUserId },
    );
  }
}
