declare const __transactionScopeBrand: unique symbol;

/**
 * Непрозрачный handle транзакции, который `ITransactionManager` выдаёт в callback
 * и который дальше прокидывается во все участники транзакции (репозитории и т.д.).
 *
 * Domain не знает, что лежит внутри — это деталь infrastructure-реализации
 * (для Prisma — transactional client). Любая попытка интроспекции из
 * domain — это нарушение слоёв.
 */
export type TransactionScope = {
  readonly [__transactionScopeBrand]: 'TransactionScope';
};
