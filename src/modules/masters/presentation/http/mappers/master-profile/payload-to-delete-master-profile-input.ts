import type { IDeleteMasterProfileApplicationInput } from 'src/modules/masters/application/dtos/master-profile/delete-master-profile.input';
import type { ISessionUser } from 'src/modules/shared/domain/i-session-user';
import { toMasterActor } from '../shared/to-master-actor';

export function payloadToDeleteMasterProfileInput(
  id: string,
  sessionUser: ISessionUser,
  isStaffUser: boolean,
): IDeleteMasterProfileApplicationInput {
  return {
    id,
    actor: toMasterActor(sessionUser, isStaffUser),
  };
}
