import type { Language, Role, Status, User } from '@prisma/client';
import { PrismaService } from 'src/modules/shared/infrastructure/persistence/prisma/prisma.service';
import {
  EUserLanguage,
  EUserRole,
  EUserStatus,
  ICreateUserInput,
  IUserEntity,
} from '../../domain/entities/user';
import type { IUserRepository } from '../../domain/repositories/user/i-user.repository';

export const USER_REPOSITORY = Symbol('USER_REPOSITORY');

export class UserRepository implements IUserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(user: ICreateUserInput): Promise<IUserEntity> {
    const createdUser = await this.prisma.user.create({
      data: user,
    });
    return this.toDomainEntity(createdUser);
  }

  async findById(userId: string): Promise<IUserEntity | null> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });
    return user ? this.toDomainEntity(user) : null;
  }

  async findByEmail(email: string): Promise<IUserEntity | null> {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });
    return user ? this.toDomainEntity(user) : null;
  }

  async findMany(): Promise<IUserEntity[]> {
    const users = await this.prisma.user.findMany();
    return users.map((user) => this.toDomainEntity(user));
  }

  async softDeleteById(userId: string): Promise<boolean> {
    const result = await this.prisma.user.update({
      where: { id: userId },
      data: { deletedAt: new Date() },
    });
    return result.deletedAt !== null;
  }

  private toDomainEntity(user: User): IUserEntity {
    return {
      ...user,
      role: this.toDomainRole(user.role),
      status: this.toDomainStatus(user.status),
      language: this.toDomainLanguage(user.language),
    };
  }

  private toDomainRole(role: Role): EUserRole {
    return role as EUserRole;
  }

  private toDomainStatus(status: Status): EUserStatus {
    return status as EUserStatus;
  }

  private toDomainLanguage(language: Language): EUserLanguage {
    return language as EUserLanguage;
  }
}
