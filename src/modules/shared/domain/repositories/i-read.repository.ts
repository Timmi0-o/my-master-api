import type {
  CountParams,
  FindManyParams,
  FindOneParams,
  ReadResult,
} from '../query';
import type { TransactionScope } from '../transactions';

export interface IReadRepository<
  TEntity extends object,
  TId,
  TRelations extends object = Record<never, never>,
> {
  findOne(
    id: TId,
    params?: FindOneParams<TEntity, TRelations>,
    scope?: TransactionScope,
  ): Promise<ReadResult<TEntity, TRelations> | null>;

  findMany(
    params?: FindManyParams<TEntity, TRelations>,
    scope?: TransactionScope,
  ): Promise<ReadResult<TEntity, TRelations>[]>;

  count(
    params?: CountParams<TEntity, TRelations>,
    scope?: TransactionScope,
  ): Promise<number>;
}
