import { JSONSchemaType } from 'ajv';
import type { IEditAppointmentChatMessagePayload } from './edit-appointment-chat-message-payload.types';

export const editAppointmentChatMessagePayloadSchema: JSONSchemaType<IEditAppointmentChatMessagePayload> =
  {
    type: 'object',
    properties: {
      body: { type: 'string', minLength: 1, maxLength: 10000 },
    },
    required: ['body'],
    additionalProperties: false,
  };
