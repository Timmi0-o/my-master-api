import type { IDeleteUserBlockApplicationInput } from 'src/modules/users/application/dtos/user-block/delete-user-block.input';
import type { ISessionUser } from 'src/modules/shared/domain/i-session-user';
import { toUserActor } from '../shared/to-user-actor';

export function payloadToDeleteUserBlockInput(
  id: string,
  sessionUser: ISessionUser,
  isStaffUser: boolean,
): IDeleteUserBlockApplicationInput {
  return {
    id,
    actor: toUserActor(sessionUser, isStaffUser),
  };
}
