import type {
  IUserBlockEntity,
  IUserBlockPublicEntity,
  IUserBlockRelations,
} from 'src/modules/users/domain/entities/user-block';
import type { UserBlockRow } from './user-block.row.types';

function mapUserRelation(
  row: NonNullable<UserBlockRow['blocker']>,
): IUserBlockRelations['blocker'] {
  return {
    id: row.id,
    username: row.username,
    name: row.name,
    surname: row.surname,
    patronymic: row.patronymic,
  };
}

export function mapUserBlockRow(
  row: UserBlockRow,
): IUserBlockPublicEntity & Partial<IUserBlockRelations> {
  const entity: IUserBlockEntity & Partial<IUserBlockRelations> = {
    id: row.id,
    blockerUserId: row.blockerUserId,
    blockedUserId: row.blockedUserId,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
    deletedAt: row.deletedAt ?? null,
  };

  if (row.blocker != null) {
    entity.blocker = mapUserRelation(row.blocker);
  }

  if (row.blocked != null) {
    entity.blocked = mapUserRelation(row.blocked);
  }

  return entity;
}
