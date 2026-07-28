import type { IGetUnreadNotificationsCountApplicationInput } from 'src/modules/notifications/application/dtos/notification/get-unread-notifications-count.input';
import type { ISessionUser } from 'src/modules/shared/domain/i-session-user';
import { toNotificationActor } from '../shared/to-notification-actor';

export function payloadToGetUnreadNotificationsCountInput(
  sessionUser: ISessionUser,
  isStaffUser: boolean,
): IGetUnreadNotificationsCountApplicationInput {
  return {
    actor: toNotificationActor(sessionUser, isStaffUser),
  };
}
