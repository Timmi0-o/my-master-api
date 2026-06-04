import { JSONSchemaType } from 'ajv';
import { EDayOfWeek } from 'src/modules/masters/domain/entities/master-weekly-schedule';
import { idSchema } from 'src/modules/shared/presentation/http/validation/schemas/common.schemas';
import type { ICreateMasterWeeklySchedulePayload } from './create-master-weekly-schedule-payload.types';

const HH_MM_PATTERN = '^([01]\\d|2[0-3]):[0-5]\\d$';

export const createMasterWeeklySchedulePayloadSchema: JSONSchemaType<ICreateMasterWeeklySchedulePayload> =
  {
    type: 'object',
    properties: {
      masterProfileId: idSchema,
      dayOfWeek: { type: 'string', enum: Object.values(EDayOfWeek) },
      startTime: { type: 'string', pattern: HH_MM_PATTERN },
      endTime: { type: 'string', pattern: HH_MM_PATTERN },
    },
    required: ['masterProfileId', 'dayOfWeek', 'startTime', 'endTime'],
    additionalProperties: false,
  };
