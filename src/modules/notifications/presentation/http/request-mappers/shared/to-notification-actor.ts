import type { INotificationActor } from 'src/modules/notifications/domain/entities/notification';
import type { ISessionUser } from 'src/modules/shared/domain/i-session-user';

export function toNotificationActor(
  sessionUser: ISessionUser,
  isStaffUser: boolean,
): INotificationActor {
  return {
    userId: sessionUser.id,
    isStaffUser,
  };
}
