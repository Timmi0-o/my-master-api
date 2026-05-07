import { EUserLanguage, EUserRole, EUserStatus } from './user.enum';

export interface IUserEntity {
  id: string;
  email: string;
  phone?: string | null;
  username: string;
  role: EUserRole;
  status: EUserStatus;
  passwordHash: string;
  name: string;
  surname: string;
  patronymic?: string | null;
  language: EUserLanguage;

  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null;
}

/** Публичное представление пользователя без чувствительных полей (списки, API). */
export type IUserPublicEntity = Omit<IUserEntity, 'passwordHash'>;

export type ICreateUserInput = Omit<
  IUserEntity,
  'id' | 'createdAt' | 'updatedAt' | 'deletedAt'
>;

export type IUpdateUserInput = Omit<Partial<ICreateUserInput>, 'deletedAt'>;
