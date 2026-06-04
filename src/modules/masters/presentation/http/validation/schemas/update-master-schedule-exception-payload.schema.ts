import { JSONSchemaType } from 'ajv';
import { EMasterScheduleExceptionKind } from 'src/modules/masters/domain/entities/master-schedule-exception';
import type { IUpdateMasterScheduleExceptionPayload } from './update-master-schedule-exception-payload.types';

const HH_MM_PATTERN = '^([01]\\d|2[0-3]):[0-5]\\d$';

export const updateMasterScheduleExceptionPayloadSchema: JSONSchemaType<IUpdateMasterScheduleExceptionPayload> =
  {
    type: 'object',
    properties: {
      startsAt: { type: 'string', format: 'date-time', nullable: true },
      endsAt: { type: 'string', format: 'date-time', nullable: true },
      kind: {
        type: 'string',
        enum: Object.values(EMasterScheduleExceptionKind),
        nullable: true,
      },
      customStartTime: {
        type: 'string',
        pattern: HH_MM_PATTERN,
        nullable: true,
      },
      customEndTime: {
        type: 'string',
        pattern: HH_MM_PATTERN,
        nullable: true,
      },
      title: { type: 'string', maxLength: 255, nullable: true },
      note: { type: 'string', maxLength: 5000, nullable: true },
    },
    required: [],
    additionalProperties: false,
  };
