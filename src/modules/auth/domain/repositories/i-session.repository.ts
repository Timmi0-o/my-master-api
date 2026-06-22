import type { TransactionScope } from '@shared/domain/transactions';

export interface ISessionRepository {
  create(
    payload: {
      userId: string;
      ipAddress?: string | null;
      userAgent?: string | null;
    },
    scope: TransactionScope,
  ): Promise<void>;
}
