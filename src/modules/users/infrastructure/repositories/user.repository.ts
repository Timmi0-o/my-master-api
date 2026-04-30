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
    return rows.map<IUserListRow>((r) =>
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

  private mapRowToListItem(row: Record<string, unknown>): IUserListRow {
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

    return {
      id: rawId,
      ...(typeof email === 'string' ? { email } : {}),
      ...(phone === null
        ? { phone: null }
        : typeof phone === 'string'
          ? { phone }
          : {}),
      ...(typeof username === 'string' ? { username } : {}),
      ...(role !== undefined ? { role: this.toDomainRole(role as Role) } : {}),
      ...(status !== undefined
        ? { status: this.toDomainStatus(status as Status) }
        : {}),
      ...(language !== undefined
        ? { language: this.toDomainLanguage(language as Language) }
        : {}),
      ...(typeof name === 'string' ? { name } : {}),
      ...(typeof surname === 'string' ? { surname } : {}),
      ...(patronymic === null
        ? { patronymic: null }
        : typeof patronymic === 'string'
          ? { patronymic }
          : {}),
      ...(createdAt instanceof Date ? { createdAt } : {}),
      ...(updatedAt instanceof Date ? { updatedAt } : {}),
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
}
