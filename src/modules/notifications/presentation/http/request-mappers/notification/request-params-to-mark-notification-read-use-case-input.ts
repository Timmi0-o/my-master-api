import type { IMarkNotificationReadApplicationInput } from 'src/modules/notifications/application/dtos/notification/mark-notification-read.input';
import type { ISessionUser } from 'src/modules/shared/domain/i-session-user';
import { toNotificationActor } from '../shared/to-notification-actor';

export function requestParamsToMarkNotificationReadUseCaseInput(
  id: string,
  sessionUser: ISessionUser,
  isStaffUser: boolean,
): IMarkNotificationReadApplicationInput {
  return {
    id,
    actor: toNotificationActor(sessionUser, isStaffUser),
  };
}
