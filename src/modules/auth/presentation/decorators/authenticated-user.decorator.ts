import {
  createParamDecorator,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import type { ISessionUser } from 'src/modules/shared/domain/i-session-user';

/**
 * Use on routes protected by JwtAuthGuard — returns a non-null session user.
 */
export const AuthenticatedUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): ISessionUser => {
    const user = ctx.switchToHttp().getRequest<{ user?: ISessionUser }>().user;
    if (!user) {
      throw new UnauthorizedException('User is not authenticated');
    }
    return user;
  },
);
