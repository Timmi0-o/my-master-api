import { DomainError } from '@shared/domain/errors';

export class MasterSubscriptionForbiddenError extends DomainError {
  constructor(masterSubscriptionId?: string) {
    super(
      'MASTER_SUBSCRIPTION_FORBIDDEN',
      'Master subscription access forbidden',
      masterSubscriptionId ? { masterSubscriptionId } : {},
    );
  }
}
