import { Inject, Injectable } from '@nestjs/common';
import { LOGGER_TOKEN, type ILogger } from '@shared/domain/logging/logger.token';
import type { ISessionUser } from '@shared/domain/i-session-user';
import type { TransactionScope } from '@shared/domain/transactions';
import { unwrapPrismaTxFromScope } from '@shared/infrastructure/persistence/transactions';
import type { ReadResult } from '@shared/domain/query';
import { PrismaService } from '@shared/infrastructure/persistence/prisma/prisma.service';
import { PrismaReadRepository } from '@shared/infrastructure/persistence/repositories/base/prisma-read.repository';
import { ERoleIdentifier } from 'src/modules/authorization/domain/entities/role';
import {
  EUserStatus,
  type ICreateUserInput,
  type IUpdateUserInput,
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
import { USER_RELATIONS, USER_VALIDATION_CONFIG } from './user.relations';
import { mapUserWriteError } from './user-write-error.mapper';

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
  protected readonly validationConfig = USER_VALIDATION_CONFIG;
  protected readonly relationConfig = USER_RELATIONS;

  constructor(
    private readonly prismaService: PrismaService,
    @Inject(LOGGER_TOKEN) logger: ILogger,
  ) {
    super(logger);
  }

  protected getDelegate(scope?: TransactionScope) {
    return scope
      ? unwrapPrismaTxFromScope(scope).user
      : this.prismaService.user;
  }

  protected mapRow(row: UserRow): ReadResult<IUserPublicEntity, Record<never, never>> {
    return mapUserRow(row);
  }

  protected toPrismaWhereUnique(id: string): Record<string, unknown> {
    return { id };
  }

  async findEntityById(
    userId: string,
    scope?: TransactionScope,
  ): Promise<IUserEntity | null> {
    const row = await this.getDelegate(scope).findUnique({ where: { id: userId } });
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
        roleId: true,
        status: true,
        role: {
          select: {
            roleIdentifier: true,
            rolePermissions: {
              select: {
                permission: {
                  select: {
                    name: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!row) return null;

    return {
      id: row.id,
      email: row.email,
      username: row.username,
      roleId: row.roleId,
      roleIdentifier: row.role.roleIdentifier as ERoleIdentifier,
      permissions: row.role.rolePermissions.map(
        (rolePermission) => rolePermission.permission.name,
      ),
      status: row.status as EUserStatus,
    };
  }

  async update(
    id: string,
    patch: IUpdateUserInput,
    scope: TransactionScope,
  ): Promise<IUserEntity> {
    const tx = unwrapPrismaTxFromScope(scope);

    try {
      const row = await tx.user.update({
        where: { id },
        data: patch,
      });
      return mapUserEntityRow(row as UserEntityRow);
    } catch (error) {
      throw mapUserWriteError(error, { id });
    }
  }

  async create(user: ICreateUserInput, scope: TransactionScope): Promise<IUserEntity> {
    const tx = unwrapPrismaTxFromScope(scope);

    try {
      const row = await tx.user.create({ data: user });
      return mapUserEntityRow(row as UserEntityRow);
    } catch (error) {
      throw mapUserWriteError(error, { email: user.email });
    }
  }

  async createMany(
    inputs: readonly ICreateUserInput[],
    scope: TransactionScope,
  ): Promise<IUserEntity[]> {
    if (inputs.length === 0) {
      return [];
    }

    const tx = unwrapPrismaTxFromScope(scope);

    try {
      const rows = await tx.user.createManyAndReturn({ data: [...inputs] });
      return rows.map((row) => mapUserEntityRow(row as UserEntityRow));
    } catch (error) {
      const first = inputs[0];
      throw mapUserWriteError(error, { email: first.email });
    }
  }

  async softDelete(userId: string, scope: TransactionScope): Promise<IUserEntity> {
    const tx = unwrapPrismaTxFromScope(scope);

    try {
      const row = await tx.user.update({
        where: { id: userId },
        data: { deletedAt: new Date() },
      });
      return mapUserEntityRow(row as UserEntityRow);
    } catch (error) {
      throw mapUserWriteError(error, { id: userId });
    }
  }
}
