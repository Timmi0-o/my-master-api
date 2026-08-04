import { JSONSchemaType } from 'ajv';
import { USER_SERVICE_INTERACTION_MAX_EVENTS_PER_REQUEST } from 'src/modules/feed/domain/entities/user-service-interaction';
import { idSchema } from 'src/modules/shared/presentation/http/validation/schemas/common.schemas';
import type { IRecordFeedEventsPayload } from './record-feed-events-payload.types';

export const recordFeedEventsPayloadSchema: JSONSchemaType<IRecordFeedEventsPayload> =
  {
    type: 'object',
    properties: {
      events: {
        type: 'array',
        minItems: 1,
        maxItems: USER_SERVICE_INTERACTION_MAX_EVENTS_PER_REQUEST,
        items: {
          type: 'object',
          properties: {
            masterServiceId: idSchema,
            type: { type: 'string', enum: ['VIEW', 'CLICK'] },
          },
          required: ['masterServiceId', 'type'],
          additionalProperties: false,
        },
      },
    },
    required: ['events'],
    additionalProperties: false,
  };
