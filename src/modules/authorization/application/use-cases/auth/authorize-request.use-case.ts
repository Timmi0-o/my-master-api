import type {
  IAuthorizeRequestApplicationInput,
  IAuthorizeRequestApplicationOutput,
} from '../../dtos/auth/authorize-request.output';
import {
  InsufficientPermissionsError,
  StaffAccessRequiredError,
  UnauthenticatedError,
} from 'src/modules/authorization/domain/auth/errors/authorization.errors';
import { ERoleIdentifier } from 'src/modules/authorization/domain/entities/role';
import { hasAnyPermission } from 'src/modules/authorization/domain/policies/has-any-permission.policy';
import { isStaffRoleIdentifier } from 'src/modules/authorization/domain/policies/is-staff-role-identifier.policy';
import type { IAuthorizationContextRepository } from 'src/modules/authorization/domain/repositories/authorization-context/i-authorization-context.repository';
import { EUserStatus } from 'src/modules/users/domain/entities/user';

export class AuthorizeRequestUseCase {
  constructor(
    private readonly authorizationContextRepository: IAuthorizationContextRepository,
  ) {}

  async execute(
    input: IAuthorizeRequestApplicationInput,
  ): Promise<IAuthorizeRequestApplicationOutput> {
    if (!input.userId) {
      throw new UnauthenticatedError();
    }

    const context = await this.authorizationContextRepository.findByUserId(
      input.userId,
    );

    if (!context || context.status !== EUserStatus.ACTIVE) {
      throw new UnauthenticatedError();
    }

    const caller: IAuthorizeRequestApplicationOutput = {
      userId: context.userId,
      roleId: context.roleId,
      roleIdentifier: context.roleIdentifier,
      permissions: context.permissions,
    };

    if (input.options.kind === 'authenticated') {
      return caller;
    }

    if (input.options.kind === 'staff-only') {
      if (!isStaffRoleIdentifier(context.roleIdentifier)) {
        throw new StaffAccessRequiredError();
      }

      return caller;
    }

    if (
      context.roleIdentifier !== ERoleIdentifier.SUPER_ADMIN &&
      !hasAnyPermission(context.permissions, input.options.permissions)
    ) {
      throw new InsufficientPermissionsError(input.options.permissions);
    }

    return caller;
  }
}
