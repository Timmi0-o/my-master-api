import { JSONSchemaType } from 'ajv';
import { idSchema } from 'src/modules/shared/presentation/http/validation/schemas/common.schemas';
import {
  EAppointmentStatus,
} from 'src/modules/appointments/domain/entities/appointment/appointment.enum';
import type { ICreateAppointmentPayload } from './create-appointment-payload.types';

export const createAppointmentPayloadSchema: JSONSchemaType<ICreateAppointmentPayload> =
  {
    type: 'object',
    properties: {
      masterProfileId: idSchema,
      masterServiceId: idSchema,
      clientUserId: { ...idSchema, nullable: true },
      startsAt: { type: 'string', format: 'date-time' },
      status: {
        type: 'string',
        enum: Object.values(EAppointmentStatus),
        nullable: true,
      },
      initialMessage: {
        type: 'object',
        properties: {
          body: { type: 'string', minLength: 1, maxLength: 10000 },
        },
        required: ['body'],
        additionalProperties: false,
        nullable: true,
      },
    },
    required: ['masterProfileId', 'masterServiceId', 'startsAt'],
    additionalProperties: false,
  };
