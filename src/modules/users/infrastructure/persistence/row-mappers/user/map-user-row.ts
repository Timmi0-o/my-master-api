import type { Language, Role, Status, User } from '@prisma/client';
import {
  EUserLanguage,
  EUserRole,
  EUserStatus,
  type IUserEntity,
  type IUserPublicEntity,
} from 'src/modules/users/domain/entities/user';
import type { UserPrismaRow } from './user.row.types';

function toDomainRole(role: Role): EUserRole {
  return role as EUserRole;
}

function toDomainStatus(status: Status): EUserStatus {
  return status as EUserStatus;
}

function toDomainLanguage(language: Language): EUserLanguage {
  return language as EUserLanguage;
}

export function mapUserEntityRow(row: User | UserPrismaRow): IUserEntity {
  return {
    id: row.id,
    email: row.email,
    phone: row.phone ?? null,
    username: row.username,
    role: toDomainRole(row.role),
    status: toDomainStatus(row.status),
    language: toDomainLanguage(row.language),
    name: row.name,
    surname: row.surname,
    patronymic: row.patronymic ?? null,
    passwordHash:
      'passwordHash' in row && typeof row.passwordHash === 'string'
        ? row.passwordHash
        : (() => {
            throw new TypeError('User row must include passwordHash');
          })(),
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
    deletedAt: row.deletedAt ?? null,
  };
}

export function mapUserPublicRow(row: UserPrismaRow): IUserPublicEntity {
  return {
    id: row.id,
    email: row.email,
    phone: row.phone ?? null,
    username: row.username,
    role: toDomainRole(row.role),
    status: toDomainStatus(row.status),
    language: toDomainLanguage(row.language),
    name: row.name,
    surname: row.surname,
    patronymic: row.patronymic ?? null,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
    deletedAt: row.deletedAt ?? null,
  };
}
