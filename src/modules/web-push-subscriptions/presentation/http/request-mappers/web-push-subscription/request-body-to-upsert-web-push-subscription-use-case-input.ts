import type { IUpsertWebPushSubscriptionApplicationInput } from 'src/modules/web-push-subscriptions/application/dtos/web-push-subscription/upsert-web-push-subscription.input';
import type { ISessionUser } from 'src/modules/shared/domain/i-session-user';
import type { IUpsertWebPushSubscriptionPayload } from '../../validation/schemas/upsert-web-push-subscription-payload.types';
import { toWebPushSubscriptionActor } from '../shared/to-web-push-subscription-actor';

export function requestBodyToUpsertWebPushSubscriptionUseCaseInput(
  payload: IUpsertWebPushSubscriptionPayload,
  sessionUser: ISessionUser,
  isStaffUser: boolean,
): IUpsertWebPushSubscriptionApplicationInput {
  return {
    actor: toWebPushSubscriptionActor(sessionUser, isStaffUser),
    endpoint: payload.endpoint,
    p256dh: payload.p256dh,
    auth: payload.auth,
    expirationTime: payload.expirationTime ?? null,
    contentEncoding: payload.contentEncoding ?? undefined,
    userAgent: payload.userAgent ?? null,
    deviceType: payload.deviceType ?? undefined,
    browser: payload.browser ?? null,
    platform: payload.platform ?? null,
  };
}
