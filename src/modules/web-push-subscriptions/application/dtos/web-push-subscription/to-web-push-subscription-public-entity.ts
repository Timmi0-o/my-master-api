import type {
  IWebPushSubscriptionEntity,
  IWebPushSubscriptionPublicEntity,
} from 'src/modules/web-push-subscriptions/domain/entities/web-push-subscription';

export function toWebPushSubscriptionPublicEntity(
  entity: IWebPushSubscriptionEntity,
): IWebPushSubscriptionPublicEntity {
  const { p256dh: _p256dh, auth: _auth, ...publicEntity } = entity;
  return publicEntity;
}
