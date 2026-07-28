import { NotificationForbiddenError } from '../errors';
import type { INotificationEntity } from '../i-notification.entity';
import type { INotificationActor } from './notification-actor.types';

export function ensureNotificationModifiable(
  notification: INotificationEntity,
  actor: INotificationActor,
): void {
  if (actor.isStaffUser) {
    return;
  }

  if (notification.userId === actor.userId) {
    return;
  }

  throw new NotificationForbiddenError(notification.id);
}
