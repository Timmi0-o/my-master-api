import { JSONSchemaType } from 'ajv';
import { EMasterServiceCategory } from 'src/modules/masters/domain/entities/master-service';
import { idSchema } from 'src/modules/shared/presentation/http/validation/schemas/common.schemas';
import type { ICreateMasterServicePayload } from './create-master-service-payload.types';

export const createMasterServicePayloadSchema: JSONSchemaType<ICreateMasterServicePayload> =
  {
    type: 'object',
    properties: {
      masterProfileId: idSchema,
      name: { type: 'string', minLength: 1, maxLength: 255 },
      description: { type: 'string', minLength: 1, maxLength: 5000 },
      price: { type: 'number', minimum: 0 },
      durationMinutes: {
        type: 'integer',
        minimum: 1,
        maximum: 1440,
        nullable: true,
      },
      category: {
        type: 'string',
        enum: Object.values(EMasterServiceCategory),
        nullable: true,
      },
    },
    required: ['masterProfileId', 'name', 'description', 'price'],
    additionalProperties: false,
  };
