import type {
  CountParams,
  FindManyParams,
  FindOneParams,
  ReadResult,
} from '../query';

export interface IReadRepository<
  TEntity extends object,
  TId,
  TRelations extends object = Record<never, never>,
> {
  findOne(
    id: TId,
    params?: FindOneParams<TEntity, TRelations>,
  ): Promise<ReadResult<TEntity, TRelations> | null>;

  findMany(
    params?: FindManyParams<TEntity, TRelations>,
  ): Promise<ReadResult<TEntity, TRelations>[]>;

  count(params?: CountParams<TEntity, TRelations>): Promise<number>;
}
