import { DomainError } from '@shared/domain/errors';

export class WebPushSubscriptionForbiddenError extends DomainError {
  constructor(webPushSubscriptionId?: string) {
    super(
      'WEB_PUSH_SUBSCRIPTION_FORBIDDEN',
      'Web push subscription access forbidden',
      webPushSubscriptionId ? { webPushSubscriptionId } : {},
    );
  }
}
