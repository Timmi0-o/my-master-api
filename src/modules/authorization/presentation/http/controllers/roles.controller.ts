import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/modules/auth/presentation/guards/jwt-auth.guard';
import { GetRoleByIdUseCase } from 'src/modules/authorization/application/use-cases/role/get-role-by-id.use-case';
import { GetRolesUseCase } from 'src/modules/authorization/application/use-cases/role/get-roles.use-case';
import { Permissions } from 'src/modules/authorization/domain/permissions/permission-names';
import { Authorize } from 'src/modules/authorization/presentation/decorators/authorize.decorator';
import { AuthorizeGuard } from 'src/modules/authorization/presentation/guards/authorize.guard';
import { AuthorizationValidator } from '../validation/authorization.validator';
import { mapGetRoleByIdHttpResponse } from '../response/map-get-role-by-id-response';
import { mapGetRolesHttpResponse } from '../response/map-get-roles-response';

@Controller({ path: 'roles', version: '1' })
@UseGuards(JwtAuthGuard, AuthorizeGuard)
export class RolesController {
  constructor(
    private readonly getRolesUseCase: GetRolesUseCase,
    private readonly getRoleByIdUseCase: GetRoleByIdUseCase,
    private readonly authorizationValidator: AuthorizationValidator,
  ) {}

  @Get()
  @Authorize({ kind: 'permissions', permissions: [Permissions.rbac.read] })
  async getRoles() {
    const output = await this.getRolesUseCase.execute({ where: {} });
    return mapGetRolesHttpResponse(output);
  }

  @Get(':roleId')
  @Authorize({ kind: 'permissions', permissions: [Permissions.rbac.read] })
  async getRoleById(@Param() params: Record<string, unknown>) {
    const { roleId } = this.authorizationValidator.validateRoleIdParam(params);
    const output = await this.getRoleByIdUseCase.execute({ roleId });
    return mapGetRoleByIdHttpResponse(output);
  }
}
