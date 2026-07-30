import { JSONSchemaType } from 'ajv';
import { idSchema } from 'src/modules/shared/presentation/http/validation/schemas/common.schemas';
import type { IUpsertUserPersonalNotePayload } from './upsert-user-personal-note-payload.types';

export const upsertUserPersonalNotePayloadSchema: JSONSchemaType<IUpsertUserPersonalNotePayload> =
  {
    type: 'object',
    properties: {
      referenceUserId: idSchema,
      context: { type: 'string', enum: ['master', 'client'] },
      name: {
        type: 'string',
        maxLength: 255,
        nullable: true,
      },
      note: {
        type: 'string',
        maxLength: 5000,
        nullable: true,
      },
    },
    required: ['referenceUserId', 'context'],
    additionalProperties: false,
  };
