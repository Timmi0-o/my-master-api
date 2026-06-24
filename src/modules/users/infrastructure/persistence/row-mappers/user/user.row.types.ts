import type { EUserLanguage, EUserStatus } from 'src/modules/users/domain/entities/user/user.enum';

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
};

export type UserEntityRow = UserRow & { passwordHash: string };
