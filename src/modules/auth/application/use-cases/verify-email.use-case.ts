import type { ITransactionManager } from '@shared/domain/transactions';
import type { IUserRepository } from 'src/modules/users/domain/repositories/user/i-user.repository';
import { InvalidEmailVerificationTokenError } from '../../domain/entities/email-verification-token';
import type { IEmailVerificationTokenRepository } from '../../domain/repositories/i-email-verification-token.repository';
import type { TokenService } from '../../infrastructure/services/token.service';

export class VerifyEmailUseCase {
  constructor(
    private readonly transactionManager: ITransactionManager,
    private readonly userRepository: IUserRepository,
    private readonly emailVerificationTokenRepository: IEmailVerificationTokenRepository,
    private readonly tokenService: TokenService,
  ) {}

  async execute(token: string): Promise<{ ok: true }> {
    const tokenHash = this.tokenService.hashToken(token);
    const record =
      await this.emailVerificationTokenRepository.findByHash(tokenHash);

    if (!record || record.usedAt || record.expiresAt.getTime() <= Date.now()) {
      throw new InvalidEmailVerificationTokenError();
    }

    await this.transactionManager.runInTransaction(async (scope) => {
      await this.userRepository.update(
        record.userId,
        { emailVerifiedAt: new Date() },
        scope,
      );
      await this.emailVerificationTokenRepository.markUsed(record.id, scope);
      await this.emailVerificationTokenRepository.deleteUnusedForUser(
        record.userId,
        scope,
      );
    });

    return { ok: true };
  }
}
