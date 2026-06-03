import type {
  IUserEntity,
  IUserPublicEntity,
} from 'src/modules/users/domain/entities/user';
import type { UserEntityRow, UserRow } from './user.row.types';

function mapUserBase(row: UserRow): IUserPublicEntity {
  return {
    id: row.id,
    email: row.email,
    phone: row.phone,
    username: row.username,
    role: row.role,
    status: row.status,
    language: row.language,
    name: row.name,
    surname: row.surname,
    patronymic: row.patronymic,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
    deletedAt: row.deletedAt,
  };
}

export function mapUserRow(row: UserRow): IUserPublicEntity {
  return mapUserBase(row);
}

export function mapUserEntityRow(row: UserEntityRow): IUserEntity {
  return {
    ...mapUserBase(row),
    passwordHash: row.passwordHash,
  };
}
