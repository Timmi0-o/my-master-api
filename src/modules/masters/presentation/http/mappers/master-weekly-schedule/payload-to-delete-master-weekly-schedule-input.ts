import type { IDeleteMasterWeeklyScheduleApplicationInput } from 'src/modules/masters/application/dtos/master-weekly-schedule/delete-master-weekly-schedule.input';
import type { ISessionUser } from 'src/modules/shared/domain/i-session-user';
import { toMasterActor } from '../shared/to-master-actor';

export function payloadToDeleteMasterWeeklyScheduleInput(
  id: string,
  sessionUser: ISessionUser,
  isStaffUser: boolean,
): IDeleteMasterWeeklyScheduleApplicationInput {
  return {
    id,
    actor: toMasterActor(sessionUser, isStaffUser),
  };
}
