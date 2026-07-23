import { JSONSchemaType } from 'ajv';
import { idSchema } from 'src/modules/shared/presentation/http/validation/schemas/common.schemas';
import type { ICreateFavoriteMasterServicePayload } from './create-favorite-master-service-payload.types';

export const createFavoriteMasterServicePayloadSchema: JSONSchemaType<ICreateFavoriteMasterServicePayload> =
  {
    type: 'object',
    properties: {
      masterServiceId: idSchema,
    },
    required: ['masterServiceId'],
    additionalProperties: false,
  };
