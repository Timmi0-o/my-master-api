import { UserLanguage, UserRole, UserStatus } from '../domain/user.enums';
import { UserEntity } from '../domain/user.entity';

export const USERS_REPOSITORY = Symbol('USERS_REPOSITORY');

export interface CreateUserRecord {
  email: string;
  phone: string | null;
  username: string;
  role: UserRole;
  status: UserStatus;
  passwordHash: string;
  name: string;
  surname: string;
  patronymic: string | null;
  language: UserLanguage;
}

export interface ListUsersQuery {
  take: number;
  skip: number;
}

export interface UsersRepositoryPort {
  create(data: CreateUserRecord): Promise<UserEntity>;
  findById(id: string): Promise<UserEntity | null>;
  findByEmail(email: string): Promise<UserEntity | null>;
  findMany(query: ListUsersQuery): Promise<UserEntity[]>;
  softDeleteById(id: string): Promise<boolean>;
}
