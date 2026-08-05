import { JSONSchemaType } from 'ajv';
import type { IDeleteAppointmentChatMessageQueryPayload } from './delete-appointment-chat-message-query.types';

export const deleteAppointmentChatMessageQuerySchema: JSONSchemaType<IDeleteAppointmentChatMessageQueryPayload> =
  {
    type: 'object',
    properties: {
      mode: {
        type: 'string',
        enum: ['FOR_EVERYONE', 'FOR_ME'],
        nullable: true,
      },
    },
    required: [],
    additionalProperties: false,
  };
