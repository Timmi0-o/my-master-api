import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import type { ISessionUser } from 'src/modules/shared/domain/i-session-user';

export const CurrentUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): ISessionUser | null => {
    return (
      ctx.switchToHttp().getRequest<{ user?: ISessionUser }>().user ?? null
    );
  },
);
