import type { WebPushDeviceType } from './web-push-subscription.enums';

export interface ICreateWebPushSubscriptionInput {
  userId: string;
  endpoint: string;
  p256dh: string;
  auth: string;
  expirationTime?: Date | null;
  contentEncoding?: string;
  userAgent?: string | null;
  deviceType?: WebPushDeviceType;
  browser?: string | null;
  platform?: string | null;
}
