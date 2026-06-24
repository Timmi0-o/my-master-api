import {
  createParamDecorator,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import type { IAuthorizedCaller } from 'src/modules/authorization/domain/auth/authorized-caller.types';

export const AuthorizedCaller = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): IAuthorizedCaller => {
    const caller = ctx
      .switchToHttp()
      .getRequest<{ authorizedCaller?: IAuthorizedCaller }>().authorizedCaller;

    if (!caller) {
      throw new UnauthorizedException('Authorization context is missing');
    }

    return caller;
  },
);
