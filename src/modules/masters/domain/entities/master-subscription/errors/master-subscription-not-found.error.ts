import { DomainError } from '@shared/domain/errors';

export class MasterSubscriptionNotFoundError extends DomainError {
  constructor(masterSubscriptionId: string) {
    super('MASTER_SUBSCRIPTION_NOT_FOUND', 'Master subscription not found', {
      masterSubscriptionId,
    });
  }
}
