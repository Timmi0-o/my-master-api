import type { ICreateMasterWeeklyScheduleApplicationInput } from 'src/modules/masters/application/dtos/master-weekly-schedule/create-master-weekly-schedule.input';
import type { ISessionUser } from 'src/modules/shared/domain/i-session-user';
import type { ICreateMasterWeeklySchedulePayload } from '../../validation/schemas/create-master-weekly-schedule-payload.types';
import { toMasterActor } from '../shared/to-master-actor';

export function payloadToCreateMasterWeeklyScheduleInput(
  payload: ICreateMasterWeeklySchedulePayload,
  sessionUser: ISessionUser,
  isStaffUser: boolean,
): ICreateMasterWeeklyScheduleApplicationInput {
  return {
    masterProfileId: payload.masterProfileId,
    dayOfWeek: payload.dayOfWeek,
    startTime: payload.startTime,
    endTime: payload.endTime,
    actor: toMasterActor(sessionUser, isStaffUser),
  };
}
