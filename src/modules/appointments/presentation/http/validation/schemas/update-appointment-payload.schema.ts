import { JSONSchemaType } from 'ajv';
import {
  EAppointmentCancelledBy,
  EAppointmentStatus,
} from 'src/modules/appointments/domain/entities/appointment/appointment.enum';
import type { IUpdateAppointmentPayload } from './update-appointment-payload.types';

export const updateAppointmentPayloadSchema: JSONSchemaType<IUpdateAppointmentPayload> =
  {
    type: 'object',
    properties: {
      startsAt: { type: 'string', format: 'date-time', nullable: true },
      status: {
        type: 'string',
        enum: Object.values(EAppointmentStatus),
        nullable: true,
      },
      cancelledAt: { type: 'string', format: 'date-time', nullable: true },
      cancelledBy: {
        type: 'string',
        enum: Object.values(EAppointmentCancelledBy),
        nullable: true,
      },
      cancelReason: { type: 'string', maxLength: 2000, nullable: true },
    },
    required: [],
    additionalProperties: false,
  };
