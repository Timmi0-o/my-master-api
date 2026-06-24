import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/modules/auth/presentation/guards/jwt-auth.guard';
import { GetPermissionsUseCase } from 'src/modules/authorization/application/use-cases/permission/get-permissions.use-case';
import { Permissions } from 'src/modules/authorization/domain/permissions/permission-names';
import { Authorize } from 'src/modules/authorization/presentation/decorators/authorize.decorator';
import { AuthorizeGuard } from 'src/modules/authorization/presentation/guards/authorize.guard';
import { mapGetPermissionsHttpResponse } from '../response/map-get-permissions-response';

@Controller({ path: 'permissions', version: '1' })
@UseGuards(JwtAuthGuard, AuthorizeGuard)
export class PermissionsController {
  constructor(private readonly getPermissionsUseCase: GetPermissionsUseCase) {}

  @Get()
  @Authorize({ kind: 'permissions', permissions: [Permissions.rbac.read] })
  async getPermissions() {
    const output = await this.getPermissionsUseCase.execute({ where: {} });
    return mapGetPermissionsHttpResponse(output);
  }
}
