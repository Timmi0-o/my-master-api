import type { IUserPersonalNoteEntity } from '../i-user-personal-note.entity';
import { UserPersonalNoteForbiddenError } from '../errors';
import type { IUserPersonalNoteActor } from './user-personal-note-actor.types';

export function ensureUserPersonalNoteOwnedByActor(
  entity: IUserPersonalNoteEntity,
  actor: IUserPersonalNoteActor,
): void {
  if (actor.isStaffUser) {
    return;
  }

  if (entity.ownerUserId !== actor.userId) {
    throw new UserPersonalNoteForbiddenError(entity.id);
  }
}
