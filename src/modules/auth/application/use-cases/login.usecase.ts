import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import type { IUserEntity } from 'src/modules/users/domain/entities/user';
import type { IUserRepository } from 'src/modules/users/domain/repositories/user/i-user.repository';
import { USER_REPOSITORY } from 'src/modules/users/infrastructure/repositories/user.repository';
import type { IAuthResponse } from '../../domain/auth.types';
import { TokenService } from '../../infrastructure/services/token.service';

interface ILoginMetadata {
  ipAddress?: string | null;
  userAgent?: string | null;
}

@Injectable()
export class LoginUseCase {
  constructor(
    private readonly tokenService: TokenService,
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(
    user: IUserEntity,
    metadata?: ILoginMetadata,
  ): Promise<{ data: IAuthResponse; success: boolean }> {
    const ipAddress = metadata?.ipAddress ?? null;
    const userAgent = metadata?.userAgent ?? null;

    const sessionUser = await this.userRepository.findSessionUserById(user.id);
    if (!sessionUser) {
      throw new UnauthorizedException('User is not found');
    }

    const tokens = this.tokenService.issueTokenPair({
      sub: sessionUser.id,
      email: sessionUser.email,
    });

    await this.userRepository.createRefreshToken({
      userId: sessionUser.id,
      tokenHash: this.tokenService.hashToken(tokens.refreshToken),
      expiresAt: this.tokenService.getRefreshTokenExpiresAt(),
    });

    await this.userRepository.createSession({
      userId: sessionUser.id,
      ipAddress,
      userAgent,
    });

    return { data: { user: sessionUser, tokens }, success: true };
  }
}
