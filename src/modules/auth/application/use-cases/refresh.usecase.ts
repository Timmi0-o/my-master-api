import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { EUserStatus } from 'src/modules/users/domain/entities/user';
import type { IUserRepository } from 'src/modules/users/domain/repositories/user/i-user.repository';
import { USER_REPOSITORY } from 'src/modules/users/infrastructure/repositories/user.repository';
import type { IAuthResponse } from '../../domain/auth.types';
import { TokenService } from '../../infrastructure/services/token.service';

@Injectable()
export class RefreshUseCase {
  constructor(
    private readonly tokenService: TokenService,
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(refreshToken: string): Promise<IAuthResponse> {
    const payload = this.tokenService.verifyRefreshToken(refreshToken);
    const refreshHash = this.tokenService.hashToken(refreshToken);
    const storedToken =
      await this.userRepository.findRefreshTokenByHash(refreshHash);

    if (!storedToken || storedToken.userId !== payload.sub) {
      if (payload.sub) {
        await this.userRepository.revokeAllRefreshTokensForUser(payload.sub);
      }
      throw new UnauthorizedException('Refresh token is invalid');
    }

    if (
      storedToken.revokedAt ||
      storedToken.expiresAt.getTime() <= Date.now()
    ) {
      await this.userRepository.revokeAllRefreshTokensForUser(
        storedToken.userId,
      );
      throw new UnauthorizedException('Refresh token is expired or revoked');
    }

    const sessionUser = await this.userRepository.findSessionUserById(
      storedToken.userId,
    );
    if (!sessionUser || sessionUser.status !== EUserStatus.ACTIVE) {
      await this.userRepository.revokeAllRefreshTokensForUser(
        storedToken.userId,
      );
      throw new UnauthorizedException('User is not active');
    }

    const tokens = this.tokenService.issueTokenPair({
      sub: sessionUser.id,
      email: sessionUser.email,
    });

    await this.userRepository.revokeRefreshTokenById(storedToken.id);
    await this.userRepository.createRefreshToken({
      userId: sessionUser.id,
      tokenHash: this.tokenService.hashToken(tokens.refreshToken),
      expiresAt: this.tokenService.getRefreshTokenExpiresAt(),
    });

    return { user: sessionUser, tokens };
  }
}
