import { JSONSchemaType } from 'ajv';
import { idSchema } from '@shared/presentation/http/validation/schemas/common.schemas';
import type { IDeleteMasterProfileImagesPayload } from './delete-master-profile-images-payload.types';

export const deleteMasterProfileImagesPayloadSchema: JSONSchemaType<IDeleteMasterProfileImagesPayload> =
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
