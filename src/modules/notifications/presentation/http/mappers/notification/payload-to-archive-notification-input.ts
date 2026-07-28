import type { IArchiveNotificationApplicationInput } from 'src/modules/notifications/application/dtos/notification/archive-notification.input';
import type { ISessionUser } from 'src/modules/shared/domain/i-session-user';
import { toNotificationActor } from '../shared/to-notification-actor';

export function payloadToArchiveNotificationInput(
  id: string,
  sessionUser: ISessionUser,
  isStaffUser: boolean,
): IArchiveNotificationApplicationInput {
  return {
    id,
    actor: toNotificationActor(sessionUser, isStaffUser),
  };
}
