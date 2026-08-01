import { JSONSchemaType } from 'ajv';
import type { IRescheduleAppointmentPayload } from './reschedule-appointment-payload.types';

export const rescheduleAppointmentPayloadSchema: JSONSchemaType<IRescheduleAppointmentPayload> =
  {
    type: 'object',
    properties: {
      startsAt: { type: 'string', format: 'date-time' },
    },
    required: ['startsAt'],
    additionalProperties: false,
  };
