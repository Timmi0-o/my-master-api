import type { IDeleteWebPushSubscriptionApplicationInput } from 'src/modules/web-push-subscriptions/application/dtos/web-push-subscription/delete-web-push-subscription.input';
import type { ISessionUser } from 'src/modules/shared/domain/i-session-user';
import { toWebPushSubscriptionActor } from '../shared/to-web-push-subscription-actor';

export function requestParamsToDeleteWebPushSubscriptionUseCaseInput(
  id: string,
  sessionUser: ISessionUser,
  isStaffUser: boolean,
): IDeleteWebPushSubscriptionApplicationInput {
  return {
    id,
    actor: toWebPushSubscriptionActor(sessionUser, isStaffUser),
  };
}
