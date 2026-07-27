import { JSONSchemaType } from 'ajv';
import { WebPushDeviceType } from 'src/modules/web-push-subscriptions/domain/entities/web-push-subscription';
import type { IUpsertWebPushSubscriptionPayload } from './upsert-web-push-subscription-payload.types';

export const upsertWebPushSubscriptionPayloadSchema: JSONSchemaType<IUpsertWebPushSubscriptionPayload> =
  {
    type: 'object',
    properties: {
      endpoint: { type: 'string', minLength: 8, maxLength: 2048 },
      p256dh: { type: 'string', minLength: 1, maxLength: 512 },
      auth: { type: 'string', minLength: 1, maxLength: 256 },
      expirationTime: {
        type: 'number',
        nullable: true,
      },
      contentEncoding: {
        type: 'string',
        nullable: true,
        minLength: 1,
        maxLength: 64,
      },
      userAgent: {
        type: 'string',
        nullable: true,
        maxLength: 1024,
      },
      deviceType: {
        type: 'string',
        nullable: true,
        enum: [...Object.values(WebPushDeviceType), null],
      },
      browser: {
        type: 'string',
        nullable: true,
        maxLength: 64,
      },
      platform: {
        type: 'string',
        nullable: true,
        maxLength: 64,
      },
    },
    required: ['endpoint', 'p256dh', 'auth'],
    additionalProperties: false,
  };
