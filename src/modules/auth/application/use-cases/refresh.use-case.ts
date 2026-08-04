import type { ITransactionManager } from '@shared/domain/transactions';
import { RefreshTokenInvalidError } from 'src/modules/auth/domain/entities/refresh-token';
import type { IRefreshTokenRepository } from 'src/modules/auth/domain/repositories/i-refresh-token.repository';
import {
  EUserStatus,
  UserNotActiveError,
} from 'src/modules/users/domain/entities/user';
import type { IUserRepository } from 'src/modules/users/domain/repositories/user/i-user.repository';
import type { IAuthResponse } from '../../domain/auth.types';
import type { TokenService } from '../../infrastructure/services/token.service';

export class RefreshUseCase {
  constructor(
    private readonly tokenService: TokenService,
    private readonly transactionManager: ITransactionManager,
    private readonly userRepository: IUserRepository,
    private readonly refreshTokenRepository: IRefreshTokenRepository,
  ) {}

  async execute(refreshToken: string): Promise<IAuthResponse> {
    let payload: { sub: string };
    try {
      payload = this.tokenService.verifyRefreshToken(refreshToken);
    } catch {
      throw new RefreshTokenInvalidError();
    }

    const refreshHash = this.tokenService.hashToken(refreshToken);
    const storedToken =
      await this.refreshTokenRepository.findByHash(refreshHash);

    if (!storedToken || storedToken.userId !== payload.sub) {
      if (payload.sub) {
        await this.transactionManager.runInTransaction((scope) =>
          this.refreshTokenRepository.revokeAllForUser(payload.sub, scope),
        );
      }
      throw new RefreshTokenInvalidError();
    }

    // Already rotated elsewhere (concurrent refresh race) — do not wipe sibling sessions.
    if (storedToken.revokedAt) {
      throw new RefreshTokenInvalidError();
    }

    if (storedToken.expiresAt.getTime() <= Date.now()) {
      await this.transactionManager.runInTransaction((scope) =>
        this.refreshTokenRepository.revokeById(storedToken.id, scope),
      );
      throw new RefreshTokenInvalidError();
    }

    const sessionUser = await this.userRepository.findSessionUserById(
      storedToken.userId,
    );
    if (!sessionUser || sessionUser.status !== EUserStatus.ACTIVE) {
      await this.transactionManager.runInTransaction((scope) =>
        this.refreshTokenRepository.revokeAllForUser(storedToken.userId, scope),
      );
      throw new UserNotActiveError(storedToken.userId);
    }

    const tokens = this.tokenService.issueTokenPair({
      sub: sessionUser.id,
      email: sessionUser.email,
    });

    await this.transactionManager.runInTransaction(async (scope) => {
      await this.refreshTokenRepository.revokeById(storedToken.id, scope);
      await this.refreshTokenRepository.create(
        {
          userId: sessionUser.id,
          tokenHash: this.tokenService.hashToken(tokens.refreshToken),
          expiresAt: this.tokenService.getRefreshTokenExpiresAt(),
        },
        scope,
      );
    });

    return { user: sessionUser, tokens };
  }
}
