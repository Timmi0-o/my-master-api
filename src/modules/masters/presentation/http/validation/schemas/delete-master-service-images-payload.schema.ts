import { JSONSchemaType } from 'ajv';
import { idSchema } from '@shared/presentation/http/validation/schemas/common.schemas';
import type { IDeleteMasterServiceImagesPayload } from './delete-master-service-images-payload.types';

export const deleteMasterServiceImagesPayloadSchema: JSONSchemaType<IDeleteMasterServiceImagesPayload> =
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
