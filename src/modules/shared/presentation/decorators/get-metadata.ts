import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { isStaffRoleIdentifier } from 'src/modules/authorization/domain/policies/is-staff-role-identifier.policy';
import { ERoleIdentifier } from 'src/modules/authorization/domain/entities/role';
import { IGetMetadata } from '../../domain/decorators/i-get-metadata';
import { ISessionUser } from '../../domain/i-session-user';

export const GetMetadata = createParamDecorator<unknown, IGetMetadata>(
  (data, ctx: ExecutionContext) => {
    const user = ctx.switchToHttp().getRequest<{ user: ISessionUser }>()?.user;

    if (!user) return DEFAULT_METADATA;

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
