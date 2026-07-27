import { DomainError } from '@shared/domain/errors';

export class WebPushSubscriptionNotFoundError extends DomainError {
  constructor(webPushSubscriptionId: string) {
    super('WEB_PUSH_SUBSCRIPTION_NOT_FOUND', 'Web push subscription not found', {
      webPushSubscriptionId,
    });
  }
}
