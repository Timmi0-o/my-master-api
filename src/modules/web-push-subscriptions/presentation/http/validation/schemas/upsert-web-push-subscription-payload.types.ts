import type { WebPushDeviceType } from 'src/modules/web-push-subscriptions/domain/entities/web-push-subscription';

export interface IUpsertWebPushSubscriptionPayload {
  endpoint: string;
  p256dh: string;
  auth: string;
  expirationTime?: number | null;
  contentEncoding?: string | null;
  userAgent?: string | null;
  deviceType?: WebPushDeviceType | null;
  browser?: string | null;
  platform?: string | null;
}
