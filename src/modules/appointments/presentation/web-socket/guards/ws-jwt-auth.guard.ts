import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { WsException } from '@nestjs/websockets';
import type { Socket } from 'socket.io';
import type { IJwtAccessPayload } from 'src/modules/auth/domain/auth.types';
import type { ISessionUser } from 'src/modules/shared/domain/i-session-user';
import { EUserStatus } from 'src/modules/users/domain/entities/user';
import type { IUserRepository } from 'src/modules/users/domain/repositories/user/i-user.repository';
import { USER_REPOSITORY_TOKEN } from 'src/modules/users/domain/repositories/user/user.repository.tokens';
import type { AppointmentChatAuthenticatedSocket } from './appointment-chat-authenticated-socket.types';

@Injectable()
export class WsJwtAuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    @Inject(USER_REPOSITORY_TOKEN)
    private readonly userRepository: IUserRepository,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const client = context
      .switchToWs()
      .getClient<AppointmentChatAuthenticatedSocket>();

    const user = await this.resolveUser(client);
    if (!user) {
      throw new WsException({
        error: {
          statusCode: 401,
          message: 'Unauthorized',
        },
      });
    }

    client.data.user = user;
    return true;
  }

  async resolveUser(client: Socket): Promise<ISessionUser | null> {
    const token = this.extractToken(client);
    if (!token) {
      return null;
    }

    try {
      const payload = this.jwtService.verify<IJwtAccessPayload>(token, {
        secret: this.getAccessTokenSecret(),
      });
      const user = await this.userRepository.findSessionUserById(payload.sub);
      if (!user || user.status !== EUserStatus.ACTIVE) {
        return null;
      }
      return user;
    } catch {
      return null;
    }
  }

  private extractToken(client: Socket): string | null {
    const authToken = client.handshake.auth?.token;
    if (typeof authToken === 'string' && authToken.length > 0) {
      return authToken;
    }

    const authorization = client.handshake.headers.authorization;
    if (
      typeof authorization === 'string' &&
      authorization.startsWith('Bearer ')
    ) {
      return authorization.slice('Bearer '.length);
    }

    return null;
  }

  private getAccessTokenSecret(): string {
    const secret = process.env.JWT_ACCESS_SECRET;
    if (!secret) {
      throw new Error('JWT_ACCESS_SECRET is required');
    }
    return secret;
  }
}
