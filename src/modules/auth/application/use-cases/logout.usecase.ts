import { Inject, Injectable } from '@nestjs/common';
import type { IUserRepository } from 'src/modules/users/domain/repositories/user/i-user.repository';
import { USER_REPOSITORY } from 'src/modules/users/infrastructure/repositories/user.repository';
import { TokenService } from '../../infrastructure/services/token.service';

@Injectable()
export class LogoutUseCase {
  constructor(
    private readonly tokenService: TokenService,
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(refreshToken: string): Promise<{ success: boolean }> {
    const refreshHash = this.tokenService.hashToken(refreshToken);
    const storedToken =
      await this.userRepository.findRefreshTokenByHash(refreshHash);

    if (!storedToken || storedToken.revokedAt) {
      return { success: true };
    }

    await this.userRepository.revokeRefreshTokenById(storedToken.id);
    return { success: true };
  }
}
