import type { IMarkAllNotificationsReadApplicationInput } from 'src/modules/notifications/application/dtos/notification/mark-all-notifications-read.input';
import type { ISessionUser } from 'src/modules/shared/domain/i-session-user';
import { toNotificationActor } from '../shared/to-notification-actor';

export function requestParamsToMarkAllNotificationsReadUseCaseInput(
  sessionUser: ISessionUser,
  isStaffUser: boolean,
): IMarkAllNotificationsReadApplicationInput {
  return {
    actor: toNotificationActor(sessionUser, isStaffUser),
  };
}
