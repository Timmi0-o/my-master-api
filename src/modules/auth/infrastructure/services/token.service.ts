import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { createHash, randomBytes } from 'crypto';
import type { IJwtAccessPayload, ITokenPair } from '../../domain/auth.types';

const ACCESS_TOKEN_TTL_MINUTES = 15;
const REFRESH_TOKEN_TTL_DAYS = 30;

@Injectable()
export class TokenService {
  constructor(private readonly jwtService: JwtService) {}

  issueTokenPair(payload: IJwtAccessPayload): ITokenPair {
    const accessToken = this.jwtService.sign(payload, {
      secret: this.getAccessTokenSecret(),
      expiresIn: `${ACCESS_TOKEN_TTL_MINUTES}m`,
    });
    const refreshToken = this.jwtService.sign(
      { sub: payload.sub, nonce: randomBytes(12).toString('hex') },
      {
        secret: this.getRefreshTokenSecret(),
        expiresIn: `${REFRESH_TOKEN_TTL_DAYS}d`,
      },
    );

    return { accessToken, refreshToken };
  }

  verifyRefreshToken(token: string): { sub: string } {
    return this.jwtService.verify(token, {
      secret: this.getRefreshTokenSecret(),
    });
  }

  hashToken(token: string): string {
    return createHash('sha256').update(token).digest('hex');
  }

  getRefreshTokenExpiresAt(): Date {
    const refreshTokenTtlSeconds = REFRESH_TOKEN_TTL_DAYS * 24 * 60 * 60;
    return new Date(Date.now() + refreshTokenTtlSeconds * 1000);
  }

  getAccessTokenSecret(): string {
    const secret = process.env.JWT_ACCESS_SECRET;
    if (!secret) {
      throw new Error('JWT_ACCESS_SECRET is required');
    }
    return secret;
  }

  private getRefreshTokenSecret(): string {
    const secret = process.env.JWT_REFRESH_SECRET;
    if (!secret) {
      throw new Error('JWT_REFRESH_SECRET is required');
    }
    return secret;
  }
}
