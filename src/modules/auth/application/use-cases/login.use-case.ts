import type { IUserEntity } from 'src/modules/users/domain/entities/user';
import type { IUserRepository } from 'src/modules/users/domain/repositories/user/i-user.repository';
import { UserNotFoundError } from 'src/modules/users/domain/errors/user-not-found.error';
import type { IRefreshTokenRepository } from 'src/modules/auth/domain/repositories/i-refresh-token.repository';
import type { ISessionRepository } from 'src/modules/auth/domain/repositories/i-session.repository';
import type { IAuthResponse } from '../../domain/auth.types';
import type { TokenService } from '../../infrastructure/services/token.service';

interface ILoginMetadata {
  ipAddress?: string | null;
  userAgent?: string | null;
}

export class LoginUseCase {
  constructor(
    private readonly tokenService: TokenService,
    private readonly userRepository: IUserRepository,
    private readonly refreshTokenRepository: IRefreshTokenRepository,
    private readonly sessionRepository: ISessionRepository,
  ) {}

  async execute(
    user: IUserEntity,
    metadata?: ILoginMetadata,
  ): Promise<{ data: IAuthResponse; success: boolean }> {
    const sessionUser = await this.userRepository.findSessionUserById(user.id);
    if (!sessionUser) {
      throw new UserNotFoundError(user.id);
    }

    const tokens = this.tokenService.issueTokenPair({
      sub: sessionUser.id,
      email: sessionUser.email,
    });

    await this.refreshTokenRepository.create({
      userId: sessionUser.id,
      tokenHash: this.tokenService.hashToken(tokens.refreshToken),
      expiresAt: this.tokenService.getRefreshTokenExpiresAt(),
    });

    await this.sessionRepository.create({
      userId: sessionUser.id,
      ipAddress: metadata?.ipAddress ?? null,
      userAgent: metadata?.userAgent ?? null,
    });

    return { data: { user: sessionUser, tokens }, success: true };
  }
}
