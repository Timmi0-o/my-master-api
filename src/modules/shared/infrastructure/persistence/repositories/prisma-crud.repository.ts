import {
  FindManyWithRequiredIdsHelper,
  type FindManyOptions,
} from '../helpers/find-many-with-required-ids.helper';
import { PrismaService } from '../prisma/prisma.service';

type PrismaDelegateLike = {
  findUnique: (args: unknown) => Promise<unknown>;
  findMany: (args: unknown) => Promise<unknown[]>;
  create: (args: unknown) => Promise<unknown>;
  update: (args: unknown) => Promise<unknown>;
  delete: (args: unknown) => Promise<unknown>;
  count: (args?: unknown) => Promise<number>;
};

export type PrismaCrudFindManyOptions = {
  where?: Record<string, unknown>;
  take?: number;
  skip?: number;
  orderBy?: Record<string, 'asc' | 'desc'>;
  select?: unknown;
  include?: Record<string, unknown>;
};

export type PrismaCrudWriteOptions = {
  select?: unknown;
  include?: Record<string, unknown>;
};

/**
 * Базовый CRUD для Prisma-delegate (по мотивам finance-service, без внешних пакетов общих типов).
 */
export abstract class PrismaCrudRepository<
  TEntity extends { id: string },
  TCreateInput,
  TUpdateInput,
  TDelegate extends PrismaDelegateLike,
> {
  constructor(protected readonly prisma: PrismaService) {}

  protected abstract getDelegate(): TDelegate;

  protected abstract mapRowToEntity(row: unknown): TEntity;

  protected getPrismaClient(): PrismaService {
    return this.prisma;
  }

  protected mapResult(row: unknown): TEntity | null {
    if (row == null) return null;
    return this.mapRowToEntity(row);
  }

  protected mapResults(rows: unknown[]): TEntity[] {
    return rows.map((r) => this.mapRowToEntity(r));
  }

  /**
   * Нормализация верхнего уровня: select string[] → объект Prisma.
   */
  protected normalizeTopLevelSelectInclude(
    args: Record<string, unknown>,
  ): Record<string, unknown> {
    const { select, include, ...rest } = args;
    const out: Record<string, unknown> = { ...rest };

    if (Array.isArray(select) && select.length > 0) {
      out.select = Object.fromEntries(
        (select as string[]).map((k) => [k, true]),
      );
    } else if (select !== undefined) {
      out.select = select;
    }

    if (
      include !== undefined &&
      include !== null &&
      typeof include === 'object'
    ) {
      out.include = include;
    }

    return out;
  }

  protected prepareFindManyArgs(
    where: Record<string, unknown> | undefined,
    options?: PrismaCrudFindManyOptions,
  ): Record<string, unknown> {
    const out: Record<string, unknown> = {};
    if (where !== undefined && Object.keys(where).length > 0) {
      out.where = where;
    }
    if (options?.take !== undefined) out.take = options.take;
    if (options?.skip !== undefined) out.skip = options.skip;
    if (options?.orderBy !== undefined) out.orderBy = options.orderBy;
    if (options?.select !== undefined) out.select = options.select;
    if (options?.include !== undefined) out.include = options.include;
    return out;
  }

  /** Сырые строки после findMany (всегда массив, в т.ч. пустой). */
  protected async fetchManyRows(
    options: Record<string, unknown>,
  ): Promise<unknown[]> {
    const prepared = this.normalizeTopLevelSelectInclude(options);
    return await this.getDelegate().findMany(prepared);
  }

  async findOne(
    id: string,
    options?: PrismaCrudWriteOptions,
  ): Promise<TEntity | null> {
    const args = this.normalizeTopLevelSelectInclude({
      where: { id },
      ...(options?.select !== undefined && { select: options.select }),
      ...(options?.include !== undefined && { include: options.include }),
    });
    const row = await this.getDelegate().findUnique(args);
    return this.mapResult(row);
  }

  async findMany(
    options?: PrismaCrudFindManyOptions,
  ): Promise<TEntity[] | null> {
    const args = this.prepareFindManyArgs(options?.where, options);
    const rows = await this.fetchManyRows(args);
    if (!rows.length) return null;
    return this.mapResults(rows);
  }

  async findManyWithRequiredIds(
    params: {
      where: Record<string, unknown>;
      requiredIds: string[];
      limit: number;
      offset: number;
    },
    findOptions?: {
      orderBy?: Record<string, 'asc' | 'desc'>;
      select?: unknown;
      include?: Record<string, unknown>;
    },
  ): Promise<TEntity[] | null> {
    const findManyBound = async (
      opts: FindManyOptions,
    ): Promise<(TEntity & { id: string })[] | null> => {
      const merged = { ...findOptions, ...opts } as Record<string, unknown>;
      const rows = await this.fetchManyRows(merged);
      if (!rows.length) return null;
      return this.mapResults(rows);
    };

    const result = await FindManyWithRequiredIdsHelper.findManyWithRequiredIds(
      findManyBound,
      params,
      {
        orderBy: findOptions?.orderBy,
        select: findOptions?.select,
        include: findOptions?.include,
      },
    );
    return result.length === 0 ? null : result;
  }

  async create(
    data: TCreateInput,
    options?: PrismaCrudWriteOptions,
  ): Promise<TEntity> {
    const args = this.normalizeTopLevelSelectInclude({
      data: data,
      ...(options?.select !== undefined && { select: options.select }),
      ...(options?.include !== undefined && { include: options.include }),
    });
    const row = await this.getDelegate().create(args);
    return this.mapRowToEntity(row);
  }

  async update(
    id: string,
    data: TUpdateInput,
    options?: PrismaCrudWriteOptions,
  ): Promise<TEntity> {
    const args = this.normalizeTopLevelSelectInclude({
      where: { id },
      data: data,
      ...(options?.select !== undefined && { select: options.select }),
      ...(options?.include !== undefined && { include: options.include }),
    });
    const row = await this.getDelegate().update(args);
    return this.mapRowToEntity(row);
  }

  async delete(
    id: string,
    options?: PrismaCrudWriteOptions,
  ): Promise<TEntity | null> {
    const args = this.normalizeTopLevelSelectInclude({
      where: { id },
      ...(options?.select !== undefined && { select: options.select }),
      ...(options?.include !== undefined && { include: options.include }),
    });
    const row = await this.getDelegate().delete(args);
    return this.mapResult(row);
  }

  async softDelete(
    id: string,
    options?: PrismaCrudWriteOptions,
  ): Promise<TEntity | null> {
    const args = this.normalizeTopLevelSelectInclude({
      where: { id },
      data: { deletedAt: new Date() },
      ...(options?.select !== undefined && { select: options.select }),
      ...(options?.include !== undefined && { include: options.include }),
    });
    const row = await this.getDelegate().update(args);
    return this.mapResult(row);
  }

  async count(where?: Record<string, unknown>): Promise<number> {
    const payload =
      where !== undefined && Object.keys(where).length > 0
        ? { where }
        : undefined;
    return this.getDelegate().count(payload);
  }
}
