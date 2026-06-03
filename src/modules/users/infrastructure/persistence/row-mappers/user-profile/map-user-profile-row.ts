import {
  IUserProfileEntity,
  IUserProfilePublicEntity,
} from 'src/modules/users/domain/entities';
import { UserProfileEntityRow, UserProfileRow } from './user-profile.row.types';

function mapUserProfileBase(row: UserProfileRow): IUserProfilePublicEntity {
  return {
    id: row.id,
    userId: row.userId,
    displayName: row.displayName,
    rating: row.rating,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
    deletedAt: row.deletedAt,
  };
}

export function mapUserProfileRow(
  row: UserProfileRow,
): IUserProfilePublicEntity {
  return mapUserProfileBase(row);
}

export function mapUserProfileEntityRow(
  row: UserProfileEntityRow,
): IUserProfileEntity {
  return {
    ...mapUserProfileBase(row),
    rating: row.rating,
  };
}
