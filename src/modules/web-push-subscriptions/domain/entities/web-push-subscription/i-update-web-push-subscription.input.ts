import type {
  WebPushDeviceType,
  WebPushSubscriptionStatus,
} from './web-push-subscription.enums';

export interface IUpdateWebPushSubscriptionInput {
  userId: string;
  p256dh: string;
  auth: string;
  expirationTime?: Date | null;
  contentEncoding?: string;
  userAgent?: string | null;
  deviceType?: WebPushDeviceType;
  browser?: string | null;
  platform?: string | null;
  status?: WebPushSubscriptionStatus;
  /** При реактивации soft-deleted записи */
  clearDeletedAt?: boolean;
  resetDeliveryState?: boolean;
}
