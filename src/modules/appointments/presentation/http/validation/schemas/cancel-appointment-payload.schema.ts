import type { JSONSchemaType } from 'ajv';
import type { ICancelAppointmentPayload } from './cancel-appointment-payload.types';

export const cancelAppointmentPayloadSchema: JSONSchemaType<ICancelAppointmentPayload> =
  {
    type: 'object',
    additionalProperties: false,
    properties: {
      cancelReason: { type: 'string', nullable: true, maxLength: 1000 },
    },
    required: [],
  };
