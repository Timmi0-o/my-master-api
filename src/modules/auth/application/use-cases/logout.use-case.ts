import type { IRefreshTokenRepository } from 'src/modules/auth/domain/repositories/i-refresh-token.repository';
import type { TokenService } from '../../infrastructure/services/token.service';
import type { ITransactionManager } from '@shared/domain/transactions';

export class LogoutUseCase {
  constructor(
    private readonly tokenService: TokenService,
    private readonly transactionManager: ITransactionManager,
    private readonly refreshTokenRepository: IRefreshTokenRepository,
  ) {}

  async execute(refreshToken: string): Promise<{ success: boolean }> {
    const refreshHash = this.tokenService.hashToken(refreshToken);
    const storedToken = await this.refreshTokenRepository.findByHash(refreshHash);

    if (!storedToken || storedToken.revokedAt) {
      return { success: true };
    }

    await this.transactionManager.runInTransaction((scope) =>
      this.refreshTokenRepository.revokeById(storedToken.id, scope),
    );
    return { success: true };
  }
}
