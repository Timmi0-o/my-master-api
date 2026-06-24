import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/modules/auth/presentation/guards/jwt-auth.guard';
import { GrantRolePermissionUseCase } from 'src/modules/authorization/application/use-cases/role-permission/grant-role-permission.use-case';
import { GetRolePermissionsUseCase } from 'src/modules/authorization/application/use-cases/role-permission/get-role-permissions.use-case';
import { RevokeRolePermissionUseCase } from 'src/modules/authorization/application/use-cases/role-permission/revoke-role-permission.use-case';
import { Permissions } from 'src/modules/authorization/domain/permissions/permission-names';
import { Authorize } from 'src/modules/authorization/presentation/decorators/authorize.decorator';
import { AuthorizeGuard } from 'src/modules/authorization/presentation/guards/authorize.guard';
import { payloadToGrantRolePermissionInput } from '../mappers/role-permission/payload-to-grant-role-permission-input';
import { paramsToRevokeRolePermissionInput } from '../mappers/role-permission/params-to-revoke-role-permission-input';
import { AuthorizationValidator } from '../validation/authorization.validator';
import { mapGetRolePermissionsHttpResponse } from '../response/map-get-role-permissions-response';
import { mapGrantRolePermissionHttpResponse } from '../response/map-grant-role-permission-response';
import { mapRevokeRolePermissionHttpResponse } from '../response/map-revoke-role-permission-response';

@Controller({ path: 'roles/:roleId/permissions', version: '1' })
@UseGuards(JwtAuthGuard, AuthorizeGuard)
export class RolePermissionsController {
  constructor(
    private readonly getRolePermissionsUseCase: GetRolePermissionsUseCase,
    private readonly grantRolePermissionUseCase: GrantRolePermissionUseCase,
    private readonly revokeRolePermissionUseCase: RevokeRolePermissionUseCase,
    private readonly authorizationValidator: AuthorizationValidator,
  ) {}

  @Get()
  @Authorize({ kind: 'permissions', permissions: [Permissions.rbac.read] })
  async getRolePermissions(@Param() params: Record<string, unknown>) {
    const { roleId } = this.authorizationValidator.validateRoleIdParam(params);
    const output = await this.getRolePermissionsUseCase.execute({ roleId });
    return mapGetRolePermissionsHttpResponse(output);
  }

  @Post()
  @Authorize({ kind: 'permissions', permissions: [Permissions.rbac.update] })
  async grantRolePermission(
    @Param() params: Record<string, unknown>,
    @Body() body: Record<string, unknown>,
  ) {
    const { roleId } = this.authorizationValidator.validateRoleIdParam(params);
    const payload =
      this.authorizationValidator.validateGrantRolePermissionPayload(body);
    const input = payloadToGrantRolePermissionInput(roleId, payload);
    const output = await this.grantRolePermissionUseCase.execute(input);
    return mapGrantRolePermissionHttpResponse(output);
  }

  @Delete(':permissionId')
  @Authorize({ kind: 'permissions', permissions: [Permissions.rbac.update] })
  async revokeRolePermission(@Param() params: Record<string, unknown>) {
    const { roleId, permissionId } =
      this.authorizationValidator.validateRolePermissionParams(params);
    const input = paramsToRevokeRolePermissionInput(roleId, permissionId);
    await this.revokeRolePermissionUseCase.execute(input);
    return mapRevokeRolePermissionHttpResponse();
  }
}
