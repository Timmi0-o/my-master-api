import { JSONSchemaType } from 'ajv';
import { EDayOfWeek } from 'src/modules/masters/domain/entities/master-weekly-schedule';
import type { IUpdateMasterWeeklySchedulePayload } from './update-master-weekly-schedule-payload.types';

const HH_MM_PATTERN = '^([01]\\d|2[0-3]):[0-5]\\d$';

export const updateMasterWeeklySchedulePayloadSchema: JSONSchemaType<IUpdateMasterWeeklySchedulePayload> =
  {
    type: 'object',
    properties: {
      dayOfWeek: {
        type: 'string',
        enum: Object.values(EDayOfWeek),
        nullable: true,
      },
      startTime: { type: 'string', pattern: HH_MM_PATTERN, nullable: true },
      endTime: { type: 'string', pattern: HH_MM_PATTERN, nullable: true },
    },
    required: [],
    additionalProperties: false,
  };
