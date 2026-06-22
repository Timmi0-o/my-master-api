import type { TransactionScope } from '../transactions';

/**
 * Узкий контракт исключительно для операций создания.
 * Все методы строго требуют `TransactionScope`: write-операция должна
 * явно выполняться внутри транзакции use-case'а.
 */
export interface ICreateRepository<
  TEntity extends object,
  TCreateInput extends object,
> {
  create(input: TCreateInput, scope: TransactionScope): Promise<TEntity>;
  createMany(
    inputs: readonly TCreateInput[],
    scope: TransactionScope,
  ): Promise<TEntity[]>;
}
