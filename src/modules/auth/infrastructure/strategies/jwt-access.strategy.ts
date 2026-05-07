import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { EUserStatus } from 'src/modules/users/domain/entities/user';
import { USER_REPOSITORY } from 'src/modules/users/infrastructure/repositories/user.repository';
import type { IUserRepository } from 'src/modules/users/domain/repositories/user/i-user.repository';
import { Inject } from '@nestjs/common';
import type { IJwtAccessPayload } from '../../domain/auth.types';

@Injectable()
export class JwtAccessStrategy extends PassportStrategy(
  Strategy,
  'jwt-access',
) {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
  ) {
    const secret = process.env.JWT_ACCESS_SECRET;
    if (!secret) {
      throw new Error('JWT_ACCESS_SECRET is required');
    }

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: secret,
    });
  }

  async validate(payload: IJwtAccessPayload) {
    const user = await this.userRepository.findSessionUserById(payload.sub);
    if (!user || user.status !== EUserStatus.ACTIVE) {
      throw new UnauthorizedException('User is not active');
    }
    return user;
  }
}
