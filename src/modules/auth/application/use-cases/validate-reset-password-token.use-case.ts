import { InvalidResetPasswordTokenError } from '../../domain/entities/password-reset-token';
import type { IPasswordResetTokenRecord } from '../../domain/repositories/i-password-reset-token.repository';
import type { IPasswordResetTokenRepository } from '../../domain/repositories/i-password-reset-token.repository';
import type { TokenService } from '../../infrastructure/services/token.service';

export class ValidateResetPasswordTokenUseCase {
  constructor(
    private readonly passwordResetTokenRepository: IPasswordResetTokenRepository,
    private readonly tokenService: TokenService,
  ) {}

  async execute(token: string): Promise<{ valid: true }> {
    await this.resolveValidToken(token);
    return { valid: true };
  }

  async resolveValidToken(token: string): Promise<IPasswordResetTokenRecord> {
    const tokenHash = this.tokenService.hashToken(token);
    const record =
      await this.passwordResetTokenRepository.findByHash(tokenHash);

    if (!record || record.usedAt || record.expiresAt.getTime() <= Date.now()) {
      throw new InvalidResetPasswordTokenError();
    }

    return record;
  }
}
