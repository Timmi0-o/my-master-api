import type { IWebPushSubscriptionEntity } from 'src/modules/web-push-subscriptions/domain/entities/web-push-subscription';
import type { WebPushSubscriptionRow } from './web-push-subscription.row.types';

export function mapWebPushSubscriptionRow(
  row: WebPushSubscriptionRow,
): IWebPushSubscriptionEntity {
  return {
    id: row.id,
    userId: row.userId,
    endpoint: row.endpoint,
    p256dh: row.p256dh,
    auth: row.auth,
    expirationTime: row.expirationTime,
    contentEncoding: row.contentEncoding,
    userAgent: row.userAgent,
    deviceType: row.deviceType,
    browser: row.browser,
    platform: row.platform,
    status: row.status,
    lastSuccessAt: row.lastSuccessAt,
    lastFailureAt: row.lastFailureAt,
    lastFailureCode: row.lastFailureCode,
    failureCount: row.failureCount,
    subscribedAt: row.subscribedAt,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
    deletedAt: row.deletedAt,
  };
}
