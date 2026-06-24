import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import type { ISessionUser } from '@shared/domain/i-session-user';
import { AuthorizeRequestUseCase } from 'src/modules/authorization/application/use-cases/auth/authorize-request.use-case';
import { AUTHORIZE_OPTIONS_KEY } from '../decorators/authorize.decorator';

@Injectable()
export class AuthorizeGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly authorizeRequestUseCase: AuthorizeRequestUseCase,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const options = this.reflector.get(
      AUTHORIZE_OPTIONS_KEY,
      context.getHandler(),
    ) ?? { kind: 'authenticated' };

    const request = context.switchToHttp().getRequest<{
      user?: ISessionUser;
      authorizedCaller?: unknown;
    }>();

    request.authorizedCaller = await this.authorizeRequestUseCase.execute({
      userId: request.user?.id,
      options,
    });

    return true;
  }
}
