import type { TransactionScope } from '@shared/domain/transactions';
import type { PrismaTxClient } from './prisma-tx-client.types';

export const wrapPrismaTxAsScope = (tx: PrismaTxClient): TransactionScope =>
  tx as unknown as TransactionScope;

export const unwrapPrismaTxFromScope = (
  scope: TransactionScope,
): PrismaTxClient => scope as unknown as PrismaTxClient;
