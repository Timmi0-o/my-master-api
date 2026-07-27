import type { IWebPushSubscriptionActor } from 'src/modules/web-push-subscriptions/domain/entities/web-push-subscription';
import type { ISessionUser } from 'src/modules/shared/domain/i-session-user';

export function toWebPushSubscriptionActor(
  sessionUser: ISessionUser,
  isStaffUser: boolean,
): IWebPushSubscriptionActor {
  return {
    userId: sessionUser.id,
    isStaffUser,
  };
}
