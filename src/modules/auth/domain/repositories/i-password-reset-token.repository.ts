import type { TransactionScope } from '@shared/domain/transactions';
import type { IPasswordResetTokenEntity } from '../entities/password-reset-token';

export type IPasswordResetTokenRecord = IPasswordResetTokenEntity;

export interface IPasswordResetTokenRepository {
  create(
    payload: {
      userId: string;
      tokenHash: string;
      expiresAt: Date;
    },
    scope?: TransactionScope,
  ): Promise<IPasswordResetTokenRecord>;

  findByHash(tokenHash: string): Promise<IPasswordResetTokenRecord | null>;

  deleteUnusedForUser(
    userId: string,
    scope?: TransactionScope,
  ): Promise<void>;

  markUsed(tokenId: string, scope: TransactionScope): Promise<void>;
}
