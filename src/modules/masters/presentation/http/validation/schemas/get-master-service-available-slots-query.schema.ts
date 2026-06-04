import { JSONSchemaType } from 'ajv';
import type { IGetMasterServiceAvailableSlotsQueryPayload } from './get-master-service-available-slots-query.types';

export const getMasterServiceAvailableSlotsQuerySchema: JSONSchemaType<IGetMasterServiceAvailableSlotsQueryPayload> =
  {
    type: 'object',
    properties: {
      date: {
        type: 'string',
        pattern: '^\\d{4}-\\d{2}-\\d{2}$',
        nullable: true,
      },
    },
    required: [],
    additionalProperties: false,
  };
