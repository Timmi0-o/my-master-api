import type {
  IWebPushSubscriptionActor,
  WebPushDeviceType,
} from 'src/modules/web-push-subscriptions/domain/entities/web-push-subscription';

export interface IUpsertWebPushSubscriptionApplicationInput {
  actor: IWebPushSubscriptionActor;
  endpoint: string;
  p256dh: string;
  auth: string;
  expirationTime?: number | null;
  contentEncoding?: string;
  userAgent?: string | null;
  deviceType?: WebPushDeviceType;
  browser?: string | null;
  platform?: string | null;
}
