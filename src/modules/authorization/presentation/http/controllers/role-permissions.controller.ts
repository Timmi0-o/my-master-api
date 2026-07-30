import { Controller, Delete, Get, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '@modules/auth/presentation/guards/jwt-auth.guard';
import { GrantRolePermissionUseCase } from '@modules/authorization/application/use-cases/role-permission/grant-role-permission.use-case';
import { GetRolePermissionsUseCase } from '@modules/authorization/application/use-cases/role-permission/get-role-permissions.use-case';
import { RevokeRolePermissionUseCase } from '@modules/authorization/application/use-cases/role-permission/revoke-role-permission.use-case';
import { Permissions } from '@modules/authorization/domain/permissions/permission-names';
import { Authorize } from '@modules/authorization/presentation/decorators/authorize.decorator';
import { AuthorizeGuard } from '@modules/authorization/presentation/guards/authorize.guard';
import { grantRolePermissionPayloadSchema } from '@modules/authorization/presentation/http/validation/schemas/grant-role-permission-payload.schema';
import type { IGrantRolePermissionPayload } from '@modules/authorization/presentation/http/validation/schemas/grant-role-permission-payload.types';
import { roleIdParamSchema } from '@modules/authorization/presentation/http/validation/schemas/role-id-param.schema';
import type { IRoleIdParamPayload } from '@modules/authorization/presentation/http/validation/schemas/role-id-param.types';
import { rolePermissionParamsSchema } from '@modules/authorization/presentation/http/validation/schemas/role-permission-params.schema';
import type { IRolePermissionParamsPayload } from '@modules/authorization/presentation/http/validation/schemas/role-permission-params.types';
import { HttpBody, HttpParams } from '@shared/presentation/http/decorators';
import {
  normalizeIdParam,
  normalizeParams,
} from '@shared/presentation/http/helpers/normalize-id-param';
import { requestBodyToGrantRolePermissionUseCaseInput } from '../request-mappers/role-permission/request-body-to-grant-role-permission-use-case-input';
import { paramsToRevokeRolePermissionUseCaseInput } from '../request-mappers/role-permission/params-to-revoke-role-permission-use-case-input';
import { mapGetRolePermissionsHttpResponse } from '../http-responses/map-get-role-permissions-response';
import { mapGrantRolePermissionHttpResponse } from '../http-responses/map-grant-role-permission-response';
import { mapRevokeRolePermissionHttpResponse } from '../http-responses/map-revoke-role-permission-response';

@Controller({ path: 'roles/:roleId/permissions', version: '1' })
@UseGuards(JwtAuthGuard, AuthorizeGuard)
export class RolePermissionsController {
  constructor(
    private readonly getRolePermissionsUseCase: GetRolePermissionsUseCase,
    private readonly grantRolePermissionUseCase: GrantRolePermissionUseCase,
    private readonly revokeRolePermissionUseCase: RevokeRolePermissionUseCase,
  ) {}

  @Get()
  @Authorize({ kind: 'permissions', permissions: [Permissions.rbac.read] })
  async getRolePermissions(
    @HttpParams(roleIdParamSchema, {
      preprocess: (p) => normalizeIdParam(p, 'roleId'),
      errorMessage: 'Некорректный идентификатор роли',
    })
    params: IRoleIdParamPayload,
  ) {
    const output = await this.getRolePermissionsUseCase.execute({
      roleId: params.roleId,
    });
    return mapGetRolePermissionsHttpResponse(output);
  }

  @Post()
  @Authorize({ kind: 'permissions', permissions: [Permissions.rbac.update] })
  async grantRolePermission(
    @HttpParams(roleIdParamSchema, {
      preprocess: (p) => normalizeIdParam(p, 'roleId'),
      errorMessage: 'Некорректный идентификатор роли',
    })
    params: IRoleIdParamPayload,
    @HttpBody(grantRolePermissionPayloadSchema, {
      errorMessage: 'Некорректное тело запроса назначения permission роли',
    })
    payload: IGrantRolePermissionPayload,
  ) {
    const input = requestBodyToGrantRolePermissionUseCaseInput(params.roleId, payload);
    const output = await this.grantRolePermissionUseCase.execute(input);
    return mapGrantRolePermissionHttpResponse(output);
  }

  @Delete(':permissionId')
  @Authorize({ kind: 'permissions', permissions: [Permissions.rbac.update] })
  async revokeRolePermission(
    @HttpParams(rolePermissionParamsSchema, {
      preprocess: (p) => normalizeParams(p, ['roleId', 'permissionId']),
      errorMessage: 'Некорректные параметры role-permission',
    })
    params: IRolePermissionParamsPayload,
  ) {
    const input = paramsToRevokeRolePermissionUseCaseInput(
      params.roleId,
      params.permissionId,
    );
    await this.revokeRolePermissionUseCase.execute(input);
    return mapRevokeRolePermissionHttpResponse();
  }
}
