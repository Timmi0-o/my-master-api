import type { IGetMyWebPushSubscriptionsApplicationInput } from 'src/modules/web-push-subscriptions/application/dtos/web-push-subscription/get-my-web-push-subscriptions.input';
import type { ISessionUser } from 'src/modules/shared/domain/i-session-user';
import { toWebPushSubscriptionActor } from '../shared/to-web-push-subscription-actor';

export function requestParamsToGetMyWebPushSubscriptionsUseCaseInput(
  sessionUser: ISessionUser,
  isStaffUser: boolean,
): IGetMyWebPushSubscriptionsApplicationInput {
  return {
    actor: toWebPushSubscriptionActor(sessionUser, isStaffUser),
  };
}
