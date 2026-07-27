import type { IWebPushSubscriptionActor } from 'src/modules/web-push-subscriptions/domain/entities/web-push-subscription';

export interface IGetMyWebPushSubscriptionsApplicationInput {
  actor: IWebPushSubscriptionActor;
}
