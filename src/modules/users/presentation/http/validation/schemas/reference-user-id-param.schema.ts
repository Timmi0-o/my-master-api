import { JSONSchemaType } from 'ajv';
import { idSchema } from 'src/modules/shared/presentation/http/validation/schemas/common.schemas';
import type { IReferenceUserIdParamPayload } from './reference-user-id-param.types';

export const referenceUserIdParamSchema: JSONSchemaType<IReferenceUserIdParamPayload> =
  {
    type: 'object',
    properties: {
      referenceUserId: idSchema,
    },
    required: ['referenceUserId'],
    additionalProperties: false,
  };
