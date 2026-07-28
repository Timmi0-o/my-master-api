import { DomainError } from '@shared/domain/errors';

export class NotificationNotFoundError extends DomainError {
  constructor(notificationId: string) {
    super('NOTIFICATION_NOT_FOUND', 'Notification not found', {
      notificationId,
    });
  }
}
