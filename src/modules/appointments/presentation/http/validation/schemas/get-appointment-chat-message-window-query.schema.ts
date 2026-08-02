import { JSONSchemaType } from 'ajv';
import type { IGetAppointmentChatMessageWindowQueryPayload } from './get-appointment-chat-message-window-query.types';

export const getAppointmentChatMessageWindowQuerySchema: JSONSchemaType<IGetAppointmentChatMessageWindowQueryPayload> =
  {
    type: 'object',
    properties: {
      limit: { type: 'integer', minimum: 1, maximum: 100, nullable: true },
      beforeCreatedAt: { type: 'string', format: 'date-time', nullable: true },
      beforeId: { type: 'string', minLength: 1, nullable: true },
      afterCreatedAt: { type: 'string', format: 'date-time', nullable: true },
      afterId: { type: 'string', minLength: 1, nullable: true },
    },
    required: [],
    additionalProperties: false,
  };
