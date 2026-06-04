import type { IDeleteMasterScheduleExceptionApplicationInput } from 'src/modules/masters/application/dtos/master-schedule-exception/delete-master-schedule-exception.input';
import type { ISessionUser } from 'src/modules/shared/domain/i-session-user';
import { toMasterActor } from '../shared/to-master-actor';

export function payloadToDeleteMasterScheduleExceptionInput(
  id: string,
  sessionUser: ISessionUser,
  isStaffUser: boolean,
): IDeleteMasterScheduleExceptionApplicationInput {
  return {
    id,
    actor: toMasterActor(sessionUser, isStaffUser),
  };
}
