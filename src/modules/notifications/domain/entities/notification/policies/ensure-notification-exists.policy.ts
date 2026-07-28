import { NotificationNotFoundError } from '../errors';
import type { INotificationEntity } from '../i-notification.entity';

export function ensureNotificationExists(
  notification: INotificationEntity | null,
  notificationId: string,
): asserts notification is INotificationEntity {
  if (!notification || notification.deletedAt != null) {
    throw new NotificationNotFoundError(notificationId);
  }
}
