import type {
  CountParams,
  FindManyParams,
  FindOneParams,
  ReadResult,
} from 'src/modules/shared/domain/query';
import { resolveSlice } from 'src/modules/shared/domain/query';
import type { IReadRepository } from 'src/modules/shared/domain/repositories';
import {
  FindManyWithRequiredIdsHelper,
  type FindManyOptions,
} from '../../helpers/find-many-with-required-ids.helper';
import { buildOrderBy } from './builders/order-by.builder';
import { buildSelect } from './builders/select.builder';
import type { PrismaReadDelegate } from './prisma-delegate.types';
import { resolvePrismaWhere } from './resolve-prisma-where.util';

export abstract class PrismaReadRepository<
  TEntity extends object,
  TId,
  TRelations extends object = Record<never, never>,
  TPrismaRow extends object = object,
> implements IReadRepository<TEntity, TId, TRelations>
{
  protected abstract getDelegate(): PrismaReadDelegate;
  protected abstract mapRow(row: TPrismaRow): ReadResult<TEntity, TRelations>;
  protected abstract toPrismaWhereUnique(id: TId): Record<string, unknown>;

  async findOne(
    id: TId,
    params?: FindOneParams<TEntity, TRelations>,
  ): Promise<ReadResult<TEntity, TRelations> | null> {
    const args = {
      where: this.toPrismaWhereUnique(id),
      ...buildSelect(params?.selectOptions?.select),
    };

    const row = await this.getDelegate().findUnique(args);

    return row ? this.mapRow(row as TPrismaRow) : null;
  }

  async findMany(
    params?: FindManyParams<TEntity, TRelations>,
  ): Promise<ReadResult<TEntity, TRelations>[]> {
    if (params?.requiredIds?.length) {
      return this.findManyWithRequiredIds(params);
    }

    const slice = resolveSlice(params?.slice);
    const args = {
      where: resolvePrismaWhere(params?.where),
      orderBy: buildOrderBy(params?.orderBy),
      skip: slice.offset,
      take: slice.limit,
      ...buildSelect(params?.selectOptions?.select),
    };

    const rows = await this.getDelegate().findMany(args);

    return rows.map((row) => this.mapRow(row as TPrismaRow));
  }

  async count(
    params?: CountParams<TEntity, TRelations>,
  ): Promise<number> {
    return this.getDelegate().count({
      where: resolvePrismaWhere(params?.where),
    });
  }

  private async findManyWithRequiredIds(
    params: FindManyParams<TEntity, TRelations>,
  ): Promise<ReadResult<TEntity, TRelations>[]> {
    const slice = resolveSlice(params?.slice);
    const requiredIds = params.requiredIds ?? [];

    const findManyBound = async (
      opts: FindManyOptions,
    ): Promise<(ReadResult<TEntity, TRelations> & { id: string })[] | null> => {
      const args = {
        where: resolvePrismaWhere({ ...params.where, ...opts.where }),
        orderBy: buildOrderBy(params.orderBy),
        skip: opts.skip,
        take: opts.take,
        ...buildSelect(params.selectOptions?.select),
      };

      const rows = await this.getDelegate().findMany(args);
      if (!rows.length) return null;

      return rows.map((row) => this.mapRow(row as TPrismaRow)) as (ReadResult<
        TEntity,
        TRelations
      > & { id: string })[];
    };

    const result = await FindManyWithRequiredIdsHelper.findManyWithRequiredIds(
      findManyBound,
      {
        where: resolvePrismaWhere(params.where) ?? {},
        requiredIds,
        limit: slice.limit,
        offset: slice.offset,
      },
      {
        orderBy: buildOrderBy(params.orderBy)?.[0] as
          | Record<string, 'asc' | 'desc'>
          | undefined,
        select: params.selectOptions?.select,
      },
    );

    return result as ReadResult<TEntity, TRelations>[];
  }
}
