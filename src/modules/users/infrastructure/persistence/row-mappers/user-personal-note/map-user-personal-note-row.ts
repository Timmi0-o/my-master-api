import {
  parseUserPersonalNoteContextMap,
  type IUserPersonalNoteEntity,
  type IUserPersonalNotePublicEntity,
} from 'src/modules/users/domain/entities/user-personal-note';
import type { UserPersonalNoteRow } from './user-personal-note.row.types';

export function mapUserPersonalNoteRow(
  row: UserPersonalNoteRow,
): IUserPersonalNotePublicEntity {
  const entity: IUserPersonalNoteEntity = {
    id: row.id,
    ownerUserId: row.ownerUserId,
    referenceUserId: row.referenceUserId,
    names: parseUserPersonalNoteContextMap(row.names),
    notes:
      row.notes == null
        ? null
        : parseUserPersonalNoteContextMap(row.notes),
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
    deletedAt: row.deletedAt ?? null,
  };

  if (entity.notes && Object.keys(entity.notes).length === 0) {
    entity.notes = null;
  }

  return entity;
}
