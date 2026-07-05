import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { ERoleIdentifier } from '@modules/authorization/domain/entities/role';
import { isStaffRoleIdentifier } from '@modules/authorization/domain/policies/is-staff-role-identifier.policy';
import type { IGetMetadata } from '@shared/domain/decorators/i-get-metadata';
import type { ISessionUser } from '@shared/domain/i-session-user';

export const GetMetadata = createParamDecorator<unknown, IGetMetadata>(
  (_data, ctx: ExecutionContext) => {
    const user = ctx.switchToHttp().getRequest<{ user: ISessionUser }>()?.user;

    if (!user) {
      return DEFAULT_METADATA;
    }

    return {
      isStaffUser: isStaffRoleIdentifier(user.roleIdentifier),
      roleIdentifier: user.roleIdentifier,
      permissions: user.permissions,
    };
  },
);

const DEFAULT_METADATA: IGetMetadata = {
  isStaffUser: false,
  roleIdentifier: ERoleIdentifier.USER,
  permissions: [],
};
