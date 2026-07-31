import type { TransactionScope } from '@shared/domain/transactions';
import type { IEmailVerificationTokenEntity } from '../entities/email-verification-token';

export type IEmailVerificationTokenRecord = IEmailVerificationTokenEntity;

export interface IEmailVerificationTokenRepository {
  create(
    payload: {
      userId: string;
      tokenHash: string;
      expiresAt: Date;
    },
    scope?: TransactionScope,
  ): Promise<IEmailVerificationTokenRecord>;

  findByHash(tokenHash: string): Promise<IEmailVerificationTokenRecord | null>;

  deleteUnusedForUser(
    userId: string,
    scope?: TransactionScope,
  ): Promise<void>;

  markUsed(tokenId: string, scope?: TransactionScope): Promise<void>;
}
