import { Controller, Get, Patch, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '@modules/auth/presentation/guards/jwt-auth.guard';
import { AuthenticatedUser } from '@modules/auth/presentation/decorators/authenticated-user.decorator';
import { Permissions } from '@modules/authorization/domain/permissions/permission-names';
import { Authorize } from '@modules/authorization/presentation/decorators/authorize.decorator';
import { AuthorizeGuard } from '@modules/authorization/presentation/guards/authorize.guard';
import { AssignUserRoleUseCase } from '@modules/users/application/use-cases/user/assign-user-role.use-case';
import { GetUsersUseCase } from '@modules/users/application/use-cases/user/get-users.use-case';
import { assignUserRolePayloadSchema } from '@modules/users/presentation/http/validation/schemas/assign-user-role-payload.schema';
import type { IAssignUserRolePayload } from '@modules/users/presentation/http/validation/schemas/assign-user-role-payload.types';
import { getUsersQuerySchema } from '@modules/users/presentation/http/validation/schemas/get-users-query.schema';
import type { IGetUsersQueryPayload } from '@modules/users/presentation/http/validation/schemas/get-users-query.types';
import { idParamSchema } from '@modules/users/presentation/http/validation/schemas/id-param.schema';
import type { IIdParamPayload } from '@modules/users/presentation/http/validation/schemas/id-param.types';
import type { IGetMetadata } from '@shared/domain/decorators/i-get-metadata';
import type { ISessionUser } from '@shared/domain/i-session-user';
import { GetMetadata } from '@shared/presentation/decorators/get-metadata';
import { HttpBody, HttpParams, HttpQuery } from '@shared/presentation/http/decorators';
import { normalizeIdParam } from '@shared/presentation/http/helpers/normalize-id-param';
import { normalizeListQueryRaw } from '@shared/presentation/http/helpers/normalize-list-query-raw';
import { requestBodyToAssignUserRoleUseCaseInput } from '../request-mappers/user/request-body-to-assign-user-role-use-case-input';
import { requestQueryParamsToFindManyParams } from '../request-mappers/user/request-query-params-to-find-many-params.mapper';
import { mapGetUsersHttpResponse } from '../http-responses/map-get-users-response';
import { mapAssignUserRoleHttpResponse } from '../http-responses/map-assign-user-role-response';

@Controller({ path: 'users', version: '1' })
@UseGuards(JwtAuthGuard, AuthorizeGuard)
export class UsersController {
  constructor(
    private readonly getUsersUseCase: GetUsersUseCase,
    private readonly assignUserRoleUseCase: AssignUserRoleUseCase,
  ) {}

  @Get()
  @Authorize({ kind: 'permissions', permissions: [Permissions.users.read] })
  async getUsers(
    @HttpQuery(getUsersQuerySchema, {
      preprocess: normalizeListQueryRaw,
      errorMessage: 'Некорректные параметры запроса списка пользователей',
    })
    queryParams: IGetUsersQueryPayload,
    @GetMetadata() metadata: IGetMetadata,
  ) {
    const params = requestQueryParamsToFindManyParams(queryParams, metadata);
    const output = await this.getUsersUseCase.execute(params);
    return mapGetUsersHttpResponse(output, queryParams);
  }

  @Patch(':id/role')
  @Authorize({ kind: 'permissions', permissions: [Permissions.rbac.update] })
  async assignUserRole(
    @HttpParams(idParamSchema, {
      preprocess: normalizeIdParam,
      errorMessage: 'Некорректный идентификатор пользователя',
    })
    params: IIdParamPayload,
    @HttpBody(assignUserRolePayloadSchema, {
      errorMessage: 'Некорректное тело запроса смены роли',
    })
    payload: IAssignUserRolePayload,
    @AuthenticatedUser() user: ISessionUser,
    @GetMetadata() metadata: IGetMetadata,
  ) {
    const input = requestBodyToAssignUserRoleUseCaseInput(
      params.id,
      payload,
      user,
      metadata.isStaffUser,
    );
    const output = await this.assignUserRoleUseCase.execute(input);
    return mapAssignUserRoleHttpResponse(output);
  }
}
