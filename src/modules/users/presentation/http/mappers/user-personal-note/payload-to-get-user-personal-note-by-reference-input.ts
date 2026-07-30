import type { IGetUserPersonalNoteByReferenceApplicationInput } from 'src/modules/users/application/dtos/user-personal-note/get-user-personal-note-by-reference.input';
import type { ISessionUser } from 'src/modules/shared/domain/i-session-user';
import { toUserActor } from '../shared/to-user-actor';

export function payloadToGetUserPersonalNoteByReferenceInput(
  referenceUserId: string,
  sessionUser: ISessionUser,
  isStaffUser: boolean,
): IGetUserPersonalNoteByReferenceApplicationInput {
  return {
    referenceUserId,
    actor: toUserActor(sessionUser, isStaffUser),
  };
}
