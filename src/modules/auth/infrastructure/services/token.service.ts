import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { createHash, randomBytes } from 'crypto';
import type { IJwtAccessPayload, ITokenPair } from '../../domain/auth.types';

const ACCESS_TOKEN_TTL_SECONDS = 15 * 60;
const REFRESH_TOKEN_TTL_SECONDS = 30 * 24 * 60 * 60;

@Injectable()
export class TokenService {
  constructor(private readonly jwtService: JwtService) {}

  issueTokenPair(payload: IJwtAccessPayload): ITokenPair {
    const accessToken = this.jwtService.sign(payload, {
      secret: this.getAccessTokenSecret(),
      expiresIn: ACCESS_TOKEN_TTL_SECONDS,
    });
    const refreshToken = this.jwtService.sign(
      { sub: payload.sub, nonce: randomBytes(12).toString('hex') },
      {
        secret: this.getRefreshTokenSecret(),
        expiresIn: REFRESH_TOKEN_TTL_SECONDS,
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
    return new Date(Date.now() + REFRESH_TOKEN_TTL_SECONDS * 1000);
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
