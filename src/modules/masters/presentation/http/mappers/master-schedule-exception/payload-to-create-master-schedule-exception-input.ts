import type { ICreateMasterScheduleExceptionApplicationInput } from 'src/modules/masters/application/dtos/master-schedule-exception/create-master-schedule-exception.input';
import type { ISessionUser } from 'src/modules/shared/domain/i-session-user';
import type { ICreateMasterScheduleExceptionPayload } from '../../validation/schemas/create-master-schedule-exception-payload.types';
import { toMasterActor } from '../shared/to-master-actor';

export function payloadToCreateMasterScheduleExceptionInput(
  payload: ICreateMasterScheduleExceptionPayload,
  sessionUser: ISessionUser,
  isStaffUser: boolean,
): ICreateMasterScheduleExceptionApplicationInput {
  return {
    masterProfileId: payload.masterProfileId,
    startsAt: new Date(payload.startsAt),
    endsAt: new Date(payload.endsAt),
    kind: payload.kind,
    customStartTime: payload.customStartTime,
    customEndTime: payload.customEndTime,
    title: payload.title,
    note: payload.note,
    actor: toMasterActor(sessionUser, isStaffUser),
  };
}
