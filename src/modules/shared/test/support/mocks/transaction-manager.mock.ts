import type { ITransactionManager, TransactionScope } from '@shared/domain/transactions';

export function createMockTransactionManager(): ITransactionManager {
  const scope = {} as TransactionScope;

  return {
    runInTransaction: async <T>(work: (s: TransactionScope) => Promise<T>) =>
      work(scope),
  };
}
