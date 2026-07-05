import { JSONSchemaType } from 'ajv';
import { idSchema } from '@shared/presentation/http/validation/schemas/common.schemas';
import type { IJoinAppointmentChatPayload } from './join-appointment-chat-payload.types';

export const joinAppointmentChatPayloadSchema: JSONSchemaType<IJoinAppointmentChatPayload> =
  {
    type: 'object',
    properties: {
      chatId: idSchema,
    },
    required: ['chatId'],
    additionalProperties: false,
  };
