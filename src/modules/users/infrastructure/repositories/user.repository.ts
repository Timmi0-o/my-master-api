import { Injectable } from '@nestjs/common';
import type { Language, Role, Status, User } from '@prisma/client';
import {
  GetManyHelper,
  type IFindManyAndCountRepo,
} from 'src/modules/shared/application/helpers/get-many.helper';
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
  IUserListRow,
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

  async findManyAndCountForList(
    params: IListQueryParams,
  ): Promise<[IUserListRow[] | null, number]> {
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

    return GetManyHelper.findManyAndCount<IUserListRow>(adapter, params);
  }

  async softDeleteById(userId: string): Promise<boolean> {
    const entity = await this.softDelete(userId);
    return entity != null && entity.deletedAt != null;
  }

  private async runPublicListFindMany(
    options: Record<string, unknown>,
  ): Promise<IUserListRow[] | null> {
    const rows = await this.fetchManyRows(options);
    return rows.map((r) => this.mapRowToListItem(r as User));
  }

  private async runFindManyWithRequiredIdsForPublicList(
    inner: {
      where: Record<string, unknown>;
      requiredIds: string[];
      limit: number;
      offset: number;
    },
    options: Record<string, unknown>,
  ): Promise<IUserListRow[] | null> {
    const findMany = async (
      opts: FindManyOptions,
    ): Promise<IUserListRow[] | null> => {
      const merged = { ...options, ...opts } as Record<string, unknown>;
      return this.runPublicListFindMany(merged);
    };

    return FindManyWithRequiredIdsHelper.findManyWithRequiredIds(
      findMany,
      inner,
      options,
    );
  }

  private mapRowToListItem(row: User): IUserListRow {
    const out: IUserListRow = { id: row.id };
    if ('email' in row && row.email !== undefined) out.email = row.email;
    if ('phone' in row && row.phone !== undefined) out.phone = row.phone;
    if ('username' in row && row.username !== undefined)
      out.username = row.username;
    if ('role' in row && row.role !== undefined)
      out.role = this.toDomainRole(row.role);
    if ('status' in row && row.status !== undefined)
      out.status = this.toDomainStatus(row.status);
    if ('language' in row && row.language !== undefined)
      out.language = this.toDomainLanguage(row.language);
    if ('name' in row && row.name !== undefined) out.name = row.name;
    if ('surname' in row && row.surname !== undefined)
      out.surname = row.surname;
    if ('patronymic' in row && row.patronymic !== undefined)
      out.patronymic = row.patronymic;
    if ('createdAt' in row && row.createdAt !== undefined)
      out.createdAt = row.createdAt;
    if ('updatedAt' in row && row.updatedAt !== undefined)
      out.updatedAt = row.updatedAt;
    if ('deletedAt' in row && row.deletedAt !== undefined)
      out.deletedAt = row.deletedAt;
    return out;
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
