import { DomainError } from '@shared/domain/errors';

export class MasterSubscriptionAlreadyExistsError extends DomainError {
  constructor(userId: string, masterProfileId: string) {
    super(
      'MASTER_SUBSCRIPTION_ALREADY_EXISTS',
      'Subscription to this master already exists',
      { userId, masterProfileId },
    );
  }
}
