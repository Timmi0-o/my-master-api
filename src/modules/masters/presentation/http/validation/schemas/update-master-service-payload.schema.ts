import { JSONSchemaType } from 'ajv';
import { EMasterServiceCategory } from 'src/modules/masters/domain/entities/master-service';
import type { IUpdateMasterServicePayload } from './update-master-service-payload.types';

export const updateMasterServicePayloadSchema: JSONSchemaType<IUpdateMasterServicePayload> =
  {
    type: 'object',
    properties: {
      name: { type: 'string', minLength: 1, maxLength: 255, nullable: true },
      description: {
        type: 'string',
        minLength: 1,
        maxLength: 5000,
        nullable: true,
      },
      price: { type: 'number', minimum: 0, nullable: true },
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
    required: [],
    additionalProperties: false,
  };
