import { Injectable } from '@nestjs/common';
import type { ISessionUser } from 'src/modules/shared/domain/i-session-user';
import type { ReadResult } from 'src/modules/shared/domain/query';
import { PrismaReadRepository } from 'src/modules/shared/infrastructure/persistence/repositories/base/prisma-read.repository';
import { PrismaService } from 'src/modules/shared/infrastructure/persistence/prisma/prisma.service';
import {
  EUserRole,
  EUserStatus,
  type ICreateUserInput,
  type IUserEntity,
  type IUserPublicEntity,
} from 'src/modules/users/domain/entities/user';
import type { IUserRepository } from 'src/modules/users/domain/repositories/user/i-user.repository';
import {
  mapUserEntityRow,
  mapUserRow,
  type UserEntityRow,
  type UserRow,
} from '../../row-mappers/user';
import { USER_RELATIONS } from './user.relations';

@Injectable()
export class PrismaUserRepository
  extends PrismaReadRepository<
    IUserPublicEntity,
    string,
    Record<never, never>,
    UserRow
  >
  implements IUserRepository
{
  protected readonly relationConfig = USER_RELATIONS;

  constructor(private readonly prismaService: PrismaService) {
    super();
  }

  protected getDelegate() {
    return this.prismaService.user;
  }

  protected mapRow(row: UserRow): ReadResult<IUserPublicEntity, Record<never, never>> {
    return mapUserRow(row);
  }

  protected toPrismaWhereUnique(id: string): Record<string, unknown> {
    return { id };
  }

  async findEntityById(userId: string): Promise<IUserEntity | null> {
    const row = await this.prismaService.user.findUnique({ where: { id: userId } });
    return row ? mapUserEntityRow(row as UserEntityRow) : null;
  }

  async findByEmail(email: string): Promise<IUserEntity | null> {
    const row = await this.prismaService.user.findUnique({ where: { email } });
    return row ? mapUserEntityRow(row as UserEntityRow) : null;
  }

  async findByEmailOrUsername(identifier: string): Promise<IUserEntity | null> {
    const row = await this.prismaService.user.findFirst({
      where: {
        OR: [{ email: identifier }, { username: identifier }],
      },
    });
    return row ? mapUserEntityRow(row as UserEntityRow) : null;
  }

  async findSessionUserById(userId: string): Promise<ISessionUser | null> {
    const row = await this.prismaService.user.findUnique({
      where: { id: userId, deletedAt: null },
      select: {
        id: true,
        email: true,
        username: true,
        role: true,
        status: true,
      },
    });

    if (!row) return null;

    return {
      id: row.id,
      email: row.email,
      username: row.username,
      role: row.role as EUserRole,
      status: row.status as EUserStatus,
    };
  }

  async create(user: ICreateUserInput): Promise<IUserEntity> {
    const row = await this.prismaService.user.create({ data: user });
    return mapUserEntityRow(row as UserEntityRow);
  }

  async softDeleteById(userId: string): Promise<boolean> {
    const row = await this.prismaService.user.update({
      where: { id: userId },
      data: { deletedAt: new Date() },
    });
    return row.deletedAt != null;
  }
}
