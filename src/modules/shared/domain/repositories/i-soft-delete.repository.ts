import type { TransactionScope } from '../transactions';

/**
 * Узкий контракт исключительно для мягкого удаления.
 * Метод строго требует `TransactionScope`.
 */
export interface ISoftDeleteRepository<TEntity extends object, TId> {
  softDelete(id: TId, scope: TransactionScope): Promise<TEntity>;
}
