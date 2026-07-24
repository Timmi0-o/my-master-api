import type { EUserLanguage, EUserStatus } from 'src/modules/users/domain/entities/user/user.enum';
import type { UserProfileRow } from '../user-profile/user-profile.row.types';

export type UserRow = {
  id: string;
  email: string;
  phone: string | null;
  username: string;
  roleId: string;
  status: EUserStatus;
  language: EUserLanguage;
  name: string;
  surname: string;
  patronymic: string | null;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
  passwordHash?: string;
  userProfile?: UserProfileRow | null;
};

export type UserEntityRow = UserRow & { passwordHash: string };
