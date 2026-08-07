import { JSONSchemaType } from 'ajv';
import { EAppointmentChatMessageAttachmentKind } from 'src/modules/appointments/domain/entities/appointment-chat-message-attachment';
import { APPOINTMENT_CHAT_ATTACHMENT_MAX_COUNT_PER_MESSAGE } from 'src/modules/appointments/domain/entities/appointment-chat-message-attachment';
import { idSchema } from 'src/modules/shared/presentation/http/validation/schemas/common.schemas';
import type { ICreateAppointmentChatMessagePayload } from './create-appointment-chat-message-payload.types';

const attachmentKindValues = Object.values(
  EAppointmentChatMessageAttachmentKind,
);

export const createAppointmentChatMessagePayloadSchema: JSONSchemaType<ICreateAppointmentChatMessagePayload> =
  {
    type: 'object',
    properties: {
      chatId: idSchema,
      body: { type: 'string', nullable: true, maxLength: 10000 },
      replyToMessageId: { ...idSchema, nullable: true },
      attachments: {
        type: 'array',
        nullable: true,
        maxItems: APPOINTMENT_CHAT_ATTACHMENT_MAX_COUNT_PER_MESSAGE,
        items: {
          type: 'object',
          properties: {
            fileId: idSchema,
            kind: { type: 'string', enum: attachmentKindValues },
            sortOrder: { type: 'integer', minimum: 0 },
            durationMs: { type: 'integer', nullable: true, minimum: 1 },
            mimeType: { type: 'string', nullable: true, minLength: 1, maxLength: 255 },
            sizeBytes: { type: 'integer', nullable: true, minimum: 1 },
          },
          required: ['fileId', 'kind', 'sortOrder'],
          additionalProperties: false,
        },
      },
    },
    required: ['chatId'],
    additionalProperties: false,
  };
