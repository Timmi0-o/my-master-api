import type { IDeleteNotificationApplicationInput } from 'src/modules/notifications/application/dtos/notification/delete-notification.input';
import type { ISessionUser } from 'src/modules/shared/domain/i-session-user';
import { toNotificationActor } from '../shared/to-notification-actor';

export function requestParamsToDeleteNotificationUseCaseInput(
  id: string,
  sessionUser: ISessionUser,
  isStaffUser: boolean,
): IDeleteNotificationApplicationInput {
  return {
    id,
    actor: toNotificationActor(sessionUser, isStaffUser),
  };
}
