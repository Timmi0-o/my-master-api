import { JSONSchemaType } from 'ajv';
import { EMasterScheduleExceptionKind } from 'src/modules/masters/domain/entities/master-schedule-exception';
import { idSchema } from 'src/modules/shared/presentation/http/validation/schemas/common.schemas';
import type { ICreateMasterScheduleExceptionPayload } from './create-master-schedule-exception-payload.types';

const HH_MM_PATTERN = '^([01]\\d|2[0-3]):[0-5]\\d$';

export const createMasterScheduleExceptionPayloadSchema: JSONSchemaType<ICreateMasterScheduleExceptionPayload> =
  {
    type: 'object',
    properties: {
      masterProfileId: idSchema,
      startsAt: { type: 'string', format: 'date-time' },
      endsAt: { type: 'string', format: 'date-time' },
      kind: {
        type: 'string',
        enum: Object.values(EMasterScheduleExceptionKind),
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
    required: ['masterProfileId', 'startsAt', 'endsAt', 'kind'],
    additionalProperties: false,
  };
