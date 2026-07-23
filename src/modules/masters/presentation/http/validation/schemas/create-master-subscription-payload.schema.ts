import { JSONSchemaType } from 'ajv';
import { idSchema } from 'src/modules/shared/presentation/http/validation/schemas/common.schemas';
import type { ICreateMasterSubscriptionPayload } from './create-master-subscription-payload.types';

export const createMasterSubscriptionPayloadSchema: JSONSchemaType<ICreateMasterSubscriptionPayload> =
  {
    type: 'object',
    properties: {
      masterProfileId: idSchema,
    },
    required: ['masterProfileId'],
    additionalProperties: false,
  };
