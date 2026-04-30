import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { EUserRole } from 'src/modules/users/domain/entities/user';
import { IGetMetadata } from '../../domain/decorators/i-get-metadata';
import { ISessionUser } from '../../domain/i-session-user';

export const GetMetadata = createParamDecorator<unknown, IGetMetadata>(
  (data, ctx: ExecutionContext) => {
    const user = ctx.switchToHttp().getRequest<{ user: ISessionUser }>()?.user;

    if (!user) return DEFAULT_METADATA;

    return {
      isStaffUser:
        user.role === EUserRole.ADMIN || user.role === EUserRole.SUPER_ADMIN,
    };
  },
);

const DEFAULT_METADATA: IGetMetadata = {
  isStaffUser: false,
};
