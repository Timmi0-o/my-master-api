import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import {
  CreateUserRecord,
  ListUsersQuery,
  UsersRepositoryPort,
} from '../../application/users.repository.port';
import { UserEntity } from '../../domain/user.entity';
import { UserPrismaMapper } from '../mappers/user.prisma.mapper';
import { PrismaService } from '../../../shared/infrastructure/prisma/prisma.service';
import { UserAlreadyExistsError } from '../../application/users.errors';

@Injectable()
export class PrismaUsersRepository implements UsersRepositoryPort {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateUserRecord): Promise<UserEntity> {
    try {
      const user = await this.prisma.user.create({
        data: UserPrismaMapper.toPrismaCreateInput(data),
      });

      return UserPrismaMapper.toDomain(user);
    } catch (error: unknown) {
      this.handlePrismaError(error);
    }
  }

  async findById(id: string): Promise<UserEntity | null> {
    const user = await this.prisma.user.findFirst({
      where: {
        id,
        deletedAt: null,
      },
    });

    return user ? UserPrismaMapper.toDomain(user) : null;
  }

  async findByEmail(email: string): Promise<UserEntity | null> {
    const user = await this.prisma.user.findFirst({
      where: {
        email,
        deletedAt: null,
      },
    });

    return user ? UserPrismaMapper.toDomain(user) : null;
  }

  async findMany(query: ListUsersQuery): Promise<UserEntity[]> {
    const users = await this.prisma.user.findMany({
      where: {
        deletedAt: null,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: query.take,
      skip: query.skip,
    });

    return users.map((user) => UserPrismaMapper.toDomain(user));
  }

  async softDeleteById(id: string): Promise<boolean> {
    const result = await this.prisma.user.updateMany({
      where: {
        id,
        deletedAt: null,
      },
      data: {
        deletedAt: new Date(),
      },
    });

    return result.count > 0;
  }

  private handlePrismaError(error: unknown): never {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2002') {
        const firstTarget =
          (error.meta?.target as string[] | undefined)?.[0] ?? '';

        if (firstTarget.includes('email')) {
          throw new UserAlreadyExistsError('email');
        }

        if (firstTarget.includes('phone')) {
          throw new UserAlreadyExistsError('phone');
        }

        if (firstTarget.includes('username')) {
          throw new UserAlreadyExistsError('username');
        }

        throw new UserAlreadyExistsError('email');
      }
    }

    throw error;
  }
}
