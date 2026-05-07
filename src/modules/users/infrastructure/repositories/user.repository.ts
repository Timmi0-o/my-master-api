import { Injectable } from '@nestjs/common';
import type {
  Language,
  RefreshToken,
  Role,
  Status,
  User,
} from '@prisma/client';
import {
  GetManyHelper,
  type IFindManyAndCountRepo,
} from 'src/modules/shared/application/helpers/get-many.helper';
import type { ISessionUser } from 'src/modules/shared/domain/i-session-user';
import type { IListQueryParams } from 'src/modules/shared/domain/list-query.params';
import {
  FindManyWithRequiredIdsHelper,
  type FindManyOptions,
} from 'src/modules/shared/infrastructure/persistence/helpers/find-many-with-required-ids.helper';
import { PrismaService } from 'src/modules/shared/infrastructure/persistence/prisma/prisma.service';
import { PrismaCrudRepository } from 'src/modules/shared/infrastructure/persistence/repositories/prisma-crud.repository';
import {
  EUserLanguage,
  EUserRole,
  EUserStatus,
  ICreateUserInput,
  IUpdateUserInput,
  IUserEntity,
  IUserPublicEntity,
} from '../../domain/entities/user';
import type { IUserRepository } from '../../domain/repositories/user/i-user.repository';

export const USER_REPOSITORY = Symbol('USER_REPOSITORY');

@Injectable()
export class UserRepository
  extends PrismaCrudRepository<
    IUserEntity,
    ICreateUserInput,
    IUpdateUserInput,
    PrismaService['user']
  >
  implements IUserRepository
{
  constructor(prisma: PrismaService) {
    super(prisma);
  }

  protected getDelegate(): PrismaService['user'] {
    return this.prisma.user;
  }

  protected mapRowToEntity(row: unknown): IUserEntity {
    return this.toDomainEntity(row as User);
  }

  async create(user: ICreateUserInput): Promise<IUserEntity> {
    return super.create(user);
  }

  async findById(userId: string): Promise<IUserEntity | null> {
    return this.findOne(userId);
  }

  async findByEmail(email: string): Promise<IUserEntity | null> {
    const args = this.normalizeTopLevelSelectInclude({ where: { email } });
    const row = await this.getDelegate().findUnique(
      args as Parameters<PrismaService['user']['findUnique']>[0],
    );
    return this.mapResult(row);
  }

  async findByEmailOrUsername(identifier: string): Promise<IUserEntity | null> {
    const args = this.normalizeTopLevelSelectInclude({
      where: {
        OR: [{ email: identifier }, { username: identifier }],
      },
    });
    const row = await this.getDelegate().findFirst(
      args as Parameters<PrismaService['user']['findFirst']>[0],
    );
    return this.mapResult(row);
  }

  async findSessionUserById(userId: string): Promise<ISessionUser | null> {
    const args = this.normalizeTopLevelSelectInclude({
      where: { id: userId, deletedAt: null },
      select: {
        id: true,
        email: true,
        username: true,
        role: true,
        status: true,
      },
    });
    const row = await this.getDelegate().findUnique(
      args as Parameters<PrismaService['user']['findUnique']>[0],
    );

    if (!row) return null;

    return {
      id: row.id,
      email: row.email,
      username: row.username,
      role: this.toDomainRole(row.role),
      status: this.toDomainStatus(row.status),
    };
  }

  async createRefreshToken(payload: {
    userId: string;
    tokenHash: string;
    expiresAt: Date;
  }): Promise<{
    id: string;
    userId: string;
    tokenHash: string;
    revokedAt: Date | null;
  }> {
    const row = await this.prisma.refreshToken.create({
      data: {
        userId: payload.userId,
        tokenHash: payload.tokenHash,
        expiresAt: payload.expiresAt,
      },
    });
    return this.mapRefreshToken(row);
  }

  async findRefreshTokenByHash(tokenHash: string): Promise<{
    id: string;
    userId: string;
    tokenHash: string;
    expiresAt: Date;
    revokedAt: Date | null;
  } | null> {
    const row = await this.prisma.refreshToken.findFirst({
      where: { tokenHash, deletedAt: null },
      orderBy: { createdAt: 'desc' },
    });
    return row ? this.mapRefreshToken(row) : null;
  }

  async revokeRefreshTokenById(tokenId: string): Promise<void> {
    await this.prisma.refreshToken.update({
      where: { id: tokenId },
      data: { revokedAt: new Date() },
    });
  }

  async revokeAllRefreshTokensForUser(userId: string): Promise<void> {
    await this.prisma.refreshToken.updateMany({
      where: {
        userId,
        revokedAt: null,
        deletedAt: null,
      },
      data: { revokedAt: new Date() },
    });
  }

  async createSession(payload: {
    userId: string;
    ipAddress?: string | null;
    userAgent?: string | null;
  }): Promise<void> {
    await this.prisma.session.create({
      data: {
        userId: payload.userId,
        ipAddress: payload.ipAddress ?? null,
        userAgent: payload.userAgent ?? null,
      },
    });
  }

  async findManyAndCountForList(
    params: IListQueryParams,
  ): Promise<[IUserPublicEntity[] | null, number]> {
    const adapter: IFindManyAndCountRepo = {
      findMany: (opts) => this.runPublicListFindMany(opts ?? {}),
      findManyWithRequiredIds: (inner, opts) =>
        this.runFindManyWithRequiredIdsForPublicList(
          inner as {
            where: Record<string, unknown>;
            requiredIds: string[];
            limit: number;
            offset: number;
          },
          opts ?? {},
        ),
      count: (where) => this.count(where),
    };

    return GetManyHelper.findManyAndCount<IUserPublicEntity>(adapter, params);
  }

  async softDeleteById(userId: string): Promise<boolean> {
    const entity = await this.softDelete(userId);
    return entity != null && entity.deletedAt != null;
  }

  private async runPublicListFindMany(
    options: Record<string, unknown>,
  ): Promise<IUserPublicEntity[] | null> {
    const rows = await this.fetchManyRows(options);
    return rows.map<IUserPublicEntity>((r) =>
      this.mapRowToListItem(this.toRecordRow(r)),
    );
  }

  private toRecordRow(row: unknown): Record<string, unknown> {
    if (typeof row !== 'object' || row === null) {
      throw new TypeError('Expected object row from persistence');
    }
    return row as Record<string, unknown>;
  }

  private async runFindManyWithRequiredIdsForPublicList(
    inner: {
      where: Record<string, unknown>;
      requiredIds: string[];
      limit: number;
      offset: number;
    },
    options: Record<string, unknown>,
  ): Promise<IUserPublicEntity[] | null> {
    const findMany = async (
      opts: FindManyOptions,
    ): Promise<IUserPublicEntity[] | null> => {
      const merged = { ...options, ...opts } as Record<string, unknown>;
      return this.runPublicListFindMany(merged);
    };

    return FindManyWithRequiredIdsHelper.findManyWithRequiredIds(
      findMany,
      inner,
      options,
    );
  }

  private mapRowToListItem(row: Record<string, unknown>): IUserPublicEntity {
    const rawId = row['id'];
    if (typeof rawId !== 'string') {
      throw new TypeError('User list row must have string id');
    }

    const email = row['email'];
    const phone = row['phone'];
    const username = row['username'];
    const role = row['role'];
    const status = row['status'];
    const language = row['language'];
    const name = row['name'];
    const surname = row['surname'];
    const patronymic = row['patronymic'];
    const createdAt = row['createdAt'];
    const updatedAt = row['updatedAt'];
    const deletedAt = row['deletedAt'];

    if (typeof email !== 'string') {
      throw new TypeError('User list row must have string email');
    }
    if (typeof username !== 'string') {
      throw new TypeError('User list row must have string username');
    }
    if (typeof name !== 'string') {
      throw new TypeError('User list row must have string name');
    }
    if (typeof surname !== 'string') {
      throw new TypeError('User list row must have string surname');
    }
    if (!(createdAt instanceof Date)) {
      throw new TypeError('User list row must have Date createdAt');
    }
    if (!(updatedAt instanceof Date)) {
      throw new TypeError('User list row must have Date updatedAt');
    }
    if (typeof role !== 'string') {
      throw new TypeError('User list row must have role');
    }
    if (typeof status !== 'string') {
      throw new TypeError('User list row must have status');
    }
    if (typeof language !== 'string') {
      throw new TypeError('User list row must have language');
    }

    return {
      id: rawId,
      email,
      ...(phone === null
        ? { phone: null }
        : typeof phone === 'string'
          ? { phone }
          : {}),
      username,
      role: this.toDomainRole(role as Role),
      status: this.toDomainStatus(status as Status),
      language: this.toDomainLanguage(language as Language),
      name,
      surname,
      ...(patronymic === null
        ? { patronymic: null }
        : typeof patronymic === 'string'
          ? { patronymic }
          : {}),
      createdAt,
      updatedAt,
      ...(deletedAt === null
        ? { deletedAt: null }
        : deletedAt instanceof Date
          ? { deletedAt }
          : {}),
    };
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

  private mapRefreshToken(row: RefreshToken): {
    id: string;
    userId: string;
    tokenHash: string;
    expiresAt: Date;
    revokedAt: Date | null;
  } {
    return {
      id: row.id,
      userId: row.userId,
      tokenHash: row.tokenHash,
      expiresAt: row.expiresAt,
      revokedAt: row.revokedAt,
    };
  }
}
