import type { IDeleteUserProfileApplicationInput } from 'src/modules/users/application/dtos/user-profile/delete-user-profile.input';
import type { ISessionUser } from 'src/modules/shared/domain/i-session-user';
import { toUserActor } from '../shared/to-user-actor';

export function payloadToDeleteUserProfileInput(
  id: string,
  sessionUser: ISessionUser,
  isStaffUser: boolean,
): IDeleteUserProfileApplicationInput {
  return {
    id,
    actor: toUserActor(sessionUser, isStaffUser),
  };
}
