import { JSONSchemaType } from 'ajv';
import { idSchema } from '@shared/presentation/http/validation/schemas/common.schemas';
import type { IDeleteUserProfileImagesPayload } from './delete-user-profile-images-payload.types';

export const deleteUserProfileImagesPayloadSchema: JSONSchemaType<IDeleteUserProfileImagesPayload> =
  {
    type: 'object',
    properties: {
      fileIds: {
        type: 'array',
        items: idSchema,
      },
    },
    required: ['fileIds'],
    additionalProperties: false,
  };
