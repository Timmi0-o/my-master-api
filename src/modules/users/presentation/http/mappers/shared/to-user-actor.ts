import type { IUserActorInput } from 'src/modules/users/application/dtos/common/i-user-actor.input';
import type { ISessionUser } from 'src/modules/shared/domain/i-session-user';

export function toUserActor(
  sessionUser: ISessionUser,
  isStaffUser: boolean,
): IUserActorInput {
  return {
    userId: sessionUser.id,
    isStaffUser,
  };
}
