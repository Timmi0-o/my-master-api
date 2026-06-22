import type { TransactionScope } from '@shared/domain/transactions';
import type { IRefreshTokenEntity } from '../entities/refresh-token';

export type IRefreshTokenRecord = IRefreshTokenEntity;

export interface IRefreshTokenRepository {
  create(
    payload: {
      userId: string;
      tokenHash: string;
      expiresAt: Date;
    },
    scope: TransactionScope,
  ): Promise<IRefreshTokenRecord>;

  findByHash(tokenHash: string): Promise<IRefreshTokenRecord | null>;

  revokeById(tokenId: string, scope: TransactionScope): Promise<void>;

  revokeAllForUser(userId: string, scope: TransactionScope): Promise<void>;
}
