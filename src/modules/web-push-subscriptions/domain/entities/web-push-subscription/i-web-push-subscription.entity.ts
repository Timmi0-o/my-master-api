import type {
  WebPushDeviceType,
  WebPushSubscriptionStatus,
} from './web-push-subscription.enums';

export interface IWebPushSubscriptionEntity {
  id: string;
  userId: string;
  endpoint: string;
  p256dh: string;
  auth: string;
  expirationTime: Date | null;
  contentEncoding: string;
  userAgent: string | null;
  deviceType: WebPushDeviceType;
  browser: string | null;
  platform: string | null;
  status: WebPushSubscriptionStatus;
  lastSuccessAt: Date | null;
  lastFailureAt: Date | null;
  lastFailureCode: number | null;
  failureCount: number;
  subscribedAt: Date;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}

/** Публичное представление без push-ключей. */
export type IWebPushSubscriptionPublicEntity = Omit<
  IWebPushSubscriptionEntity,
  'p256dh' | 'auth'
>;
