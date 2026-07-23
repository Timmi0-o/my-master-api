import { DomainError } from '@shared/domain/errors';

export class MasterSubscriptionCannotSubscribeToSelfError extends DomainError {
  constructor(masterProfileId: string) {
    super(
      'MASTER_SUBSCRIPTION_CANNOT_SUBSCRIBE_TO_SELF',
      'Cannot subscribe to your own master profile',
      { masterProfileId },
    );
  }
}
