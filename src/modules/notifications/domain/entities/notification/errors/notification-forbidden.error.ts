import { DomainError } from '@shared/domain/errors';

export class NotificationForbiddenError extends DomainError {
  constructor(notificationId?: string) {
    super(
      'NOTIFICATION_FORBIDDEN',
      'Notification access forbidden',
      notificationId ? { notificationId } : {},
    );
  }
}
