import { JSONSchemaType } from 'ajv';
import type { IMarkAppointmentChatReadPayload } from './mark-appointment-chat-read-payload.types';

export const markAppointmentChatReadPayloadSchema: JSONSchemaType<IMarkAppointmentChatReadPayload> =
  {
    type: 'object',
    properties: {
      lastReadAt: { type: 'string', format: 'date-time' },
    },
    required: ['lastReadAt'],
    additionalProperties: false,
  };
