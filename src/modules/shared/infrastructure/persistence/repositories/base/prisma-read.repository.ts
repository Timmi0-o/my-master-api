import type {
  CountParams,
  FindManyParams,
  FindOneParams,
  ReadResult,
  WhereFilter,
} from 'src/modules/shared/domain/query';
import { resolveSlice } from 'src/modules/shared/domain/query';
import type { IReadRepository } from 'src/modules/shared/domain/repositories';
import type { ILogger } from 'src/modules/shared/domain/logging/logger.token';
import {
  FindManyWithRequiredIdsHelper,
  type FindManyOptions,
} from '../../helpers/find-many-with-required-ids.helper';
import { buildOrderBy } from './builders/order-by.builder';
import { buildSelection } from './builders/selection.builder';
import { buildWhere } from './builders/where.builder';
import type { ReadOptionsValidationConfig } from './config/read-validation.config';
import type { RelationConfig } from './config/relation.config';
import type { PrismaReadDelegate } from './prisma-delegate.types';
import { validateReadOptions } from './validators';

export abstract class PrismaReadRepository<
  TEntity extends object,
  TId,
  TRelations extends object = Record<never, never>,
  TPrismaRow extends object = object,
> implements IReadRepository<TEntity, TId, TRelations> {
  /**
   * Не инжектить logger через constructor базового класса:
   * Nest наследует param metadata родителя и подставляет LOGGER_TOKEN
   * в первый параметр дочернего конструктора (prismaService).
   */
  protected readonly logger: ILogger = {
    debug: () => undefined,
    log: () => undefined,
    warn: () => undefined,
    error: () => undefined,
    configuration: () => undefined,
  };

  protected abstract readonly validationConfig: ReadOptionsValidationConfig;
  protected abstract readonly relationConfig: Record<string, RelationConfig>;

  protected abstract getDelegate(): PrismaReadDelegate;
  protected abstract mapRow(row: TPrismaRow): ReadResult<TEntity, TRelations>;
  protected abstract toPrismaWhereUnique(id: TId): Record<string, unknown>;

  protected resolveSelectArgs(
    selectOptions?: FindOneParams<TEntity, TRelations>['selectOptions'],
  ): Record<string, unknown> {
    return buildSelection(
      selectOptions?.select,
      selectOptions?.include,
      this.relationConfig,
    );
  }

  protected resolveListWhere(
    where?: FindManyParams<TEntity, TRelations>['where'],
  ): Record<string, unknown> | undefined {
    return buildWhere(where as WhereFilter<TEntity, TRelations> | undefined);
  }

  async findOne(
    id: TId,
    params?: FindOneParams<TEntity, TRelations>,
  ): Promise<ReadResult<TEntity, TRelations> | null> {
    validateReadOptions(params?.selectOptions, this.validationConfig);

    const args = {
      where: this.toPrismaWhereUnique(id),
      ...this.resolveSelectArgs(params?.selectOptions),
    };

    const row = await this.getDelegate().findUnique(args);

    return row ? this.mapRow(row as TPrismaRow) : null;
  }

  async findMany(
    params?: FindManyParams<TEntity, TRelations>,
  ): Promise<ReadResult<TEntity, TRelations>[]> {
    validateReadOptions(params?.selectOptions, this.validationConfig);

    if (params?.requiredIds?.length) {
      return this.findManyWithRequiredIds(params);
    }

    const slice = resolveSlice(params?.slice);
    const args = {
      where: this.resolveListWhere(params?.where),
      orderBy: buildOrderBy(params?.orderBy),
      skip: slice.offset,
      take: slice.limit,
      ...this.resolveSelectArgs(params?.selectOptions),
    };

    const rows = await this.getDelegate().findMany(args);

    return rows.map((row) => this.mapRow(row as TPrismaRow));
  }

  async count(params?: CountParams<TEntity, TRelations>): Promise<number> {
    return this.getDelegate().count({
      where: this.resolveListWhere(params?.where),
    });
  }

  private async findManyWithRequiredIds(
    params: FindManyParams<TEntity, TRelations>,
  ): Promise<ReadResult<TEntity, TRelations>[]> {
    const slice = resolveSlice(params?.slice);
    const requiredIds = params.requiredIds ?? [];
    const baseWhere = this.resolveListWhere(params.where) ?? {};

    const findManyBound = async (
      opts: FindManyOptions,
    ): Promise<(ReadResult<TEntity, TRelations> & { id: string })[] | null> => {
      const args = {
        where: { ...baseWhere, ...opts.where },
        orderBy: buildOrderBy(params.orderBy),
        skip: opts.skip,
        take: opts.take,
        ...this.resolveSelectArgs(params.selectOptions),
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
        where: baseWhere,
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
