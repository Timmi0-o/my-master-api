import { JSONSchemaType } from 'ajv';
import { EMasterBookingStatus } from 'src/modules/masters/domain/entities/master-profile/master-profile-booking.enum';
import { idSchema } from 'src/modules/shared/presentation/http/validation/schemas/common.schemas';
import type { IUpdateMasterProfilePayload } from './update-master-profile-payload.types';

export const updateMasterProfilePayloadSchema: JSONSchemaType<IUpdateMasterProfilePayload> =
  {
    type: 'object',
    properties: {
      displayName: {
        type: 'string',
        minLength: 1,
        maxLength: 255,
        nullable: true,
      },
      description: {
        type: 'string',
        minLength: 1,
        maxLength: 5000,
        nullable: true,
      },
      rating: { type: 'number', minimum: 0, nullable: true },
      userId: { ...idSchema, nullable: true },
      timezone: { type: 'string', minLength: 1, maxLength: 64, nullable: true },
      bookingStatus: {
        type: 'string',
        enum: Object.values(EMasterBookingStatus),
        nullable: true,
      },
      pausedUntil: { type: 'string', format: 'date-time', nullable: true },
      minNoticeMinutes: {
        type: 'integer',
        minimum: 0,
        maximum: 10080,
        nullable: true,
      },
      maxBookingDaysAhead: {
        type: 'integer',
        minimum: 1,
        maximum: 365,
        nullable: true,
      },
      slotStepMinutes: {
        type: 'integer',
        minimum: 5,
        maximum: 120,
        nullable: true,
      },
      bufferBetweenAppointmentsMinutes: {
        type: 'integer',
        minimum: 0,
        maximum: 240,
        nullable: true,
      },
    },
    required: [],
    additionalProperties: false,
  };
