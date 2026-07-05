import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '@modules/auth/presentation/guards/jwt-auth.guard';
import { GetRoleByIdUseCase } from '@modules/authorization/application/use-cases/role/get-role-by-id.use-case';
import { GetRolesUseCase } from '@modules/authorization/application/use-cases/role/get-roles.use-case';
import { Permissions } from '@modules/authorization/domain/permissions/permission-names';
import { Authorize } from '@modules/authorization/presentation/decorators/authorize.decorator';
import { AuthorizeGuard } from '@modules/authorization/presentation/guards/authorize.guard';
import { roleIdParamSchema } from '@modules/authorization/presentation/http/validation/schemas/role-id-param.schema';
import type { IRoleIdParamPayload } from '@modules/authorization/presentation/http/validation/schemas/role-id-param.types';
import { HttpParams } from '@shared/presentation/http/decorators';
import { normalizeIdParam } from '@shared/presentation/http/helpers/normalize-id-param';
import { mapGetRoleByIdHttpResponse } from '../response/map-get-role-by-id-response';
import { mapGetRolesHttpResponse } from '../response/map-get-roles-response';

@Controller({ path: 'roles', version: '1' })
@UseGuards(JwtAuthGuard, AuthorizeGuard)
export class RolesController {
  constructor(
    private readonly getRolesUseCase: GetRolesUseCase,
    private readonly getRoleByIdUseCase: GetRoleByIdUseCase,
  ) {}

  @Get()
  @Authorize({ kind: 'permissions', permissions: [Permissions.rbac.read] })
  async getRoles() {
    const output = await this.getRolesUseCase.execute({ where: {} });
    return mapGetRolesHttpResponse(output);
  }

  @Get(':roleId')
  @Authorize({ kind: 'permissions', permissions: [Permissions.rbac.read] })
  async getRoleById(
    @HttpParams(roleIdParamSchema, {
      preprocess: (p) => normalizeIdParam(p, 'roleId'),
      errorMessage: 'Некорректный идентификатор роли',
    })
    params: IRoleIdParamPayload,
  ) {
    const output = await this.getRoleByIdUseCase.execute({
      roleId: params.roleId,
    });
    return mapGetRoleByIdHttpResponse(output);
  }
}
