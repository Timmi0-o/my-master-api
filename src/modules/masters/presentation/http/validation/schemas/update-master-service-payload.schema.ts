import { JSONSchemaType } from 'ajv';
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
    },
    required: [],
    additionalProperties: false,
  };
