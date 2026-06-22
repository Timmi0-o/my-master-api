import type { TransactionScope } from './transaction-scope';

/**
 * Менеджер транзакций — единственное место, где открывается транзакция БД.
 *
 * Use-case на write вызывает `runInTransaction(...)` и внутри callback'а
 * получает `TransactionScope`, который прокидывает в репозитории.
 * Все участники транзакции используют **этот** scope, чтобы их операции
 * закоммитились/откатились атомарно.
 */
export interface ITransactionManager {
  runInTransaction<T>(
    work: (scope: TransactionScope) => Promise<T>,
  ): Promise<T>;
}

export const TRANSACTION_MANAGER_TOKEN = Symbol('ITransactionManager');
