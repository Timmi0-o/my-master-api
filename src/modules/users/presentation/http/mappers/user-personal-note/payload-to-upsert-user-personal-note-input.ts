import type { IUpsertUserPersonalNoteApplicationInput } from 'src/modules/users/application/dtos/user-personal-note/upsert-user-personal-note.input';
import type { ISessionUser } from 'src/modules/shared/domain/i-session-user';
import type { IUpsertUserPersonalNotePayload } from '../../validation/schemas/upsert-user-personal-note-payload.types';
import { toUserActor } from '../shared/to-user-actor';

export function payloadToUpsertUserPersonalNoteInput(
  payload: IUpsertUserPersonalNotePayload,
  sessionUser: ISessionUser,
  isStaffUser: boolean,
): IUpsertUserPersonalNoteApplicationInput {
  return {
    referenceUserId: payload.referenceUserId,
    context: payload.context,
    name: payload.name === '' ? null : payload.name,
    note: payload.note === '' ? null : payload.note,
    actor: toUserActor(sessionUser, isStaffUser),
  };
}
