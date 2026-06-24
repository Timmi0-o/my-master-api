import {
  Body,
  Controller,
  Get,
  Patch,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/modules/auth/presentation/guards/jwt-auth.guard';
import { AuthenticatedUser } from 'src/modules/auth/presentation/decorators/authenticated-user.decorator';
import { Permissions } from 'src/modules/authorization/domain/permissions/permission-names';
import { Authorize } from 'src/modules/authorization/presentation/decorators/authorize.decorator';
import { AuthorizeGuard } from 'src/modules/authorization/presentation/guards/authorize.guard';
import type { IGetMetadata } from 'src/modules/shared/domain/decorators/i-get-metadata';
import type { IRawQuery } from 'src/modules/shared/domain/i-query.dto';
import type { ISessionUser } from 'src/modules/shared/domain/i-session-user';
import { GetMetadata } from 'src/modules/shared/presentation/decorators/get-metadata';
import { AssignUserRoleUseCase } from 'src/modules/users/application/use-cases/user/assign-user-role.use-case';
import { GetUsersUseCase } from 'src/modules/users/application/use-cases/user/get-users.use-case';
import { payloadToAssignUserRoleInput } from '../mappers/user/payload-to-assign-user-role-input';
import { payloadToFindManyParams } from '../mappers/user/payload-to-find-many-params.mapper';
import { mapGetUsersHttpResponse } from '../response/map-get-users-response';
import { mapAssignUserRoleHttpResponse } from '../response/map-assign-user-role-response';
import { UserValidator } from '../validation/user.validator';

@Controller({ path: 'users', version: '1' })
@UseGuards(JwtAuthGuard, AuthorizeGuard)
export class UsersController {
  constructor(
    private readonly getUsersUseCase: GetUsersUseCase,
    private readonly assignUserRoleUseCase: AssignUserRoleUseCase,
    private readonly userValidator: UserValidator,
  ) {}

  @Get()
  @Authorize({ kind: 'permissions', permissions: [Permissions.users.read] })
  async getUsers(
    @Query() query: IRawQuery,
    @GetMetadata() metadata: IGetMetadata,
  ) {
    const payload = this.userValidator.validateGetUsersQuery(query);
    const params = payloadToFindManyParams(payload, metadata);
    const output = await this.getUsersUseCase.execute(params);
    return mapGetUsersHttpResponse(output, payload);
  }

  @Patch(':id/role')
  @Authorize({ kind: 'permissions', permissions: [Permissions.rbac.update] })
  async assignUserRole(
    @Param() params: Record<string, unknown>,
    @Body() body: Record<string, unknown>,
    @AuthenticatedUser() user: ISessionUser,
    @GetMetadata() metadata: IGetMetadata,
  ) {
    const { id } = this.userValidator.validateIdParam(params);
    const payload = this.userValidator.validateAssignUserRolePayload(body);
    const input = payloadToAssignUserRoleInput(
      id,
      payload,
      user,
      metadata.isStaffUser,
    );
    const output = await this.assignUserRoleUseCase.execute(input);
    return mapAssignUserRoleHttpResponse(output);
  }
}
