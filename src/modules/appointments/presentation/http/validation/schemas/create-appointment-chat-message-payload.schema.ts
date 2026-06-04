import { JSONSchemaType } from 'ajv';
import { idSchema } from 'src/modules/shared/presentation/http/validation/schemas/common.schemas';
import type { ICreateAppointmentChatMessagePayload } from './create-appointment-chat-message-payload.types';

export const createAppointmentChatMessagePayloadSchema: JSONSchemaType<ICreateAppointmentChatMessagePayload> =
  {
    type: 'object',
    properties: {
      chatId: idSchema,
      body: { type: 'string', minLength: 1, maxLength: 10000 },
    },
    required: ['chatId', 'body'],
    additionalProperties: false,
  };
