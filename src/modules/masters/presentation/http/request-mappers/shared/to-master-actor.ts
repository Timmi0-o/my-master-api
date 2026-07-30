import type { IMasterActorInput } from 'src/modules/masters/application/dtos/common/i-master-actor.input';
import type { ISessionUser } from 'src/modules/shared/domain/i-session-user';

export function toMasterActor(
  sessionUser: ISessionUser,
  isStaffUser: boolean,
): IMasterActorInput {
  return {
    userId: sessionUser.id,
    isStaffUser,
  };
}
