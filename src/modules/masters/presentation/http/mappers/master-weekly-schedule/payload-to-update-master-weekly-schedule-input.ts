import type { IUpdateMasterWeeklyScheduleApplicationInput } from 'src/modules/masters/application/dtos/master-weekly-schedule/update-master-weekly-schedule.input';
import type { IUpdateMasterWeeklyScheduleInput } from 'src/modules/masters/domain/entities/master-weekly-schedule';
import type { ISessionUser } from 'src/modules/shared/domain/i-session-user';
import { BadRequestException } from '@nestjs/common';
import type { IUpdateMasterWeeklySchedulePayload } from '../../validation/schemas/update-master-weekly-schedule-payload.types';
import { pickPatch } from '../shared/pick-patch.util';
import { toMasterActor } from '../shared/to-master-actor';

const PATCHABLE_KEYS = [
  'dayOfWeek',
  'startTime',
  'endTime',
] as const satisfies readonly (keyof IUpdateMasterWeeklyScheduleInput)[];

export function payloadToUpdateMasterWeeklyScheduleInput(
  id: string,
  payload: IUpdateMasterWeeklySchedulePayload,
  sessionUser: ISessionUser,
  isStaffUser: boolean,
): IUpdateMasterWeeklyScheduleApplicationInput {
  const patch = pickPatch(payload, PATCHABLE_KEYS);

  if (Object.keys(patch).length === 0) {
    throw new BadRequestException(
      'Update payload must contain at least one mutable field',
    );
  }

  return {
    id,
    patch,
    actor: toMasterActor(sessionUser, isStaffUser),
  };
}
