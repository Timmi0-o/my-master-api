import type { ITransactionManager } from '@shared/domain/transactions';
import * as bcrypt from 'bcrypt';
import type { IUserRepository } from 'src/modules/users/domain/repositories/user/i-user.repository';
import type { IPasswordResetTokenRepository } from '../../domain/repositories/i-password-reset-token.repository';
import type { IRefreshTokenRepository } from '../../domain/repositories/i-refresh-token.repository';
import type { ValidateResetPasswordTokenUseCase } from './validate-reset-password-token.use-case';

const BCRYPT_ROUNDS = 10;

export class ResetPasswordUseCase {
  constructor(
    private readonly transactionManager: ITransactionManager,
    private readonly userRepository: IUserRepository,
    private readonly refreshTokenRepository: IRefreshTokenRepository,
    private readonly passwordResetTokenRepository: IPasswordResetTokenRepository,
    private readonly validateResetPasswordTokenUseCase: ValidateResetPasswordTokenUseCase,
  ) {}

  async execute(input: {
    token: string;
    password: string;
  }): Promise<{ ok: true }> {
    const resetToken =
      await this.validateResetPasswordTokenUseCase.resolveValidToken(
        input.token,
      );

    const passwordHash = await bcrypt.hash(input.password, BCRYPT_ROUNDS);

    await this.transactionManager.runInTransaction(async (scope) => {
      await this.userRepository.update(
        resetToken.userId,
        { passwordHash },
        scope,
      );
      await this.refreshTokenRepository.revokeAllForUser(
        resetToken.userId,
        scope,
      );
      await this.passwordResetTokenRepository.markUsed(resetToken.id, scope);
    });

    return { ok: true };
  }
}
