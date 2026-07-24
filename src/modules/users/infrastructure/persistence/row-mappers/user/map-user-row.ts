import type {
  IUserEntity,
  IUserPublicEntity,
} from 'src/modules/users/domain/entities/user';
import type { IUserProfilePublicEntity } from 'src/modules/users/domain/entities/user-profile';
import { mapUserProfileRow } from '../user-profile/map-user-profile-row';
import type { UserEntityRow, UserRow } from './user.row.types';

export type IUserRowMapped = IUserPublicEntity & {
  userProfile?: IUserProfilePublicEntity;
};

function mapUserBase(row: UserRow): IUserPublicEntity {
  return {
    id: row.id,
    email: row.email,
    phone: row.phone,
    username: row.username,
    roleId: row.roleId,
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

export function mapUserRow(row: UserRow): IUserRowMapped {
  const entity: IUserRowMapped = mapUserBase(row);

  if (row.userProfile != null) {
    entity.userProfile = mapUserProfileRow(row.userProfile);
  }

  return entity;
}

export function mapUserEntityRow(row: UserEntityRow): IUserEntity {
  return {
    ...mapUserBase(row),
    passwordHash: row.passwordHash,
  };
}
