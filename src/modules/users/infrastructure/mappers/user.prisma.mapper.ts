import { Language, Role, Status, User as PrismaUser } from '@prisma/client';
import { CreateUserRecord } from '../../application/users.repository.port';
import { UserEntity } from '../../domain/user.entity';
import { UserLanguage, UserRole, UserStatus } from '../../domain/user.enums';

export class UserPrismaMapper {
  static toDomain(user: PrismaUser): UserEntity {
    return new UserEntity({
      id: user.id,
      email: user.email,
      phone: user.phone,
      username: user.username,
      role: user.role as UserRole,
      status: user.status as UserStatus,
      passwordHash: user.passwordHash,
      name: user.name,
      surname: user.surname,
      patronymic: user.patronymic,
      language: user.language as UserLanguage,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      deletedAt: user.deletedAt,
    });
  }

  static toPrismaCreateInput(input: CreateUserRecord): {
    email: string;
    phone: string | null;
    username: string;
    role: Role;
    status: Status;
    passwordHash: string;
    name: string;
    surname: string;
    patronymic: string | null;
    language: Language;
  } {
    return {
      email: input.email,
      phone: input.phone,
      username: input.username,
      role: input.role,
      status: input.status,
      passwordHash: input.passwordHash,
      name: input.name,
      surname: input.surname,
      patronymic: input.patronymic,
      language: input.language,
    };
  }
}
