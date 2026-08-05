import { JSONSchemaType } from 'ajv';
import { EAppointmentChatMessageAttachmentKind } from 'src/modules/appointments/domain/entities/appointment-chat-message-attachment';
import { APPOINTMENT_CHAT_ATTACHMENT_MAX_COUNT_PER_MESSAGE } from 'src/modules/appointments/domain/entities/appointment-chat-message-attachment';
import type { IPresignAppointmentChatAttachmentsPayload } from './presign-appointment-chat-attachments-payload.types';

const attachmentKindValues = Object.values(
  EAppointmentChatMessageAttachmentKind,
);

export const presignAppointmentChatAttachmentsPayloadSchema: JSONSchemaType<IPresignAppointmentChatAttachmentsPayload> =
  {
    type: 'object',
    properties: {
      files: {
        type: 'array',
        minItems: 1,
        maxItems: APPOINTMENT_CHAT_ATTACHMENT_MAX_COUNT_PER_MESSAGE,
        items: {
          type: 'object',
          properties: {
            name: { type: 'string', minLength: 1, maxLength: 255 },
            sha256sum: { type: 'string', minLength: 1, maxLength: 128 },
            mimeType: { type: 'string', minLength: 1, maxLength: 255 },
            sizeBytes: { type: 'integer', minimum: 1 },
            kind: { type: 'string', enum: attachmentKindValues },
          },
          required: ['name', 'sha256sum', 'mimeType', 'sizeBytes', 'kind'],
          additionalProperties: false,
        },
      },
    },
    required: ['files'],
    additionalProperties: false,
  };
