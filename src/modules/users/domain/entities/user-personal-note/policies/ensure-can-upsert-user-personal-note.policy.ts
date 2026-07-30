import { UserPersonalNoteCannotTargetSelfError } from '../errors';
import type { IUserPersonalNoteActor } from './user-personal-note-actor.types';

export function ensureCanUpsertUserPersonalNote(
  referenceUserId: string,
  actor: IUserPersonalNoteActor,
): void {
  if (referenceUserId === actor.userId) {
    throw new UserPersonalNoteCannotTargetSelfError(actor.userId);
  }
}
