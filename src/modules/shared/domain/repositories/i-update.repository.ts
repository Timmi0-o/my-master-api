import type { TransactionScope } from '../transactions';

/**
 * Узкий контракт исключительно для операций обновления.
 * Метод строго требует `TransactionScope`.
 */
export interface IUpdateRepository<
  TEntity extends object,
  TId,
  TUpdateInput extends object,
> {
  update(
    id: TId,
    patch: TUpdateInput,
    scope: TransactionScope,
  ): Promise<TEntity>;
}
