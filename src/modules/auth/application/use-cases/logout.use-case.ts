import type { IRefreshTokenRepository } from 'src/modules/auth/domain/repositories/i-refresh-token.repository';
import type { TokenService } from '../../infrastructure/services/token.service';

export class LogoutUseCase {
  constructor(
    private readonly tokenService: TokenService,
    private readonly refreshTokenRepository: IRefreshTokenRepository,
  ) {}

  async execute(refreshToken: string): Promise<{ success: boolean }> {
    const refreshHash = this.tokenService.hashToken(refreshToken);
    const storedToken = await this.refreshTokenRepository.findByHash(refreshHash);

    if (!storedToken || storedToken.revokedAt) {
      return { success: true };
    }

    await this.refreshTokenRepository.revokeById(storedToken.id);
    return { success: true };
  }
}
