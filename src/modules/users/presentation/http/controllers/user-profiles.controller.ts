import { Controller, Delete, Get, Patch, Post, UseGuards } from '@nestjs/common';
import { AuthenticatedUser } from '@modules/auth/presentation/decorators/authenticated-user.decorator';
import { JwtAuthGuard } from '@modules/auth/presentation/guards/jwt-auth.guard';
import { Permissions } from '@modules/authorization/domain/permissions/permission-names';
import { Authorize } from '@modules/authorization/presentation/decorators/authorize.decorator';
import { AuthorizeGuard } from '@modules/authorization/presentation/guards/authorize.guard';
import { CreateRootFolderUseCase } from '@modules/files/application/use-cases/folder/create-root-folder.use-case';
import { CreateUserProfileUseCase } from '@modules/users/application/use-cases/user-profile/create-user-profile.use-case';
import { DeleteUserProfileByIdUseCase } from '@modules/users/application/use-cases/user-profile/delete-user-profile-by-id.use-case';
import { GetMyUserProfileUseCase } from '@modules/users/application/use-cases/user-profile/get-my-user-profile.use-case';
import { GetUserProfileByIdUseCase } from '@modules/users/application/use-cases/user-profile/get-user-profile-by-id.use-case';
import { GetUserProfilesUseCase } from '@modules/users/application/use-cases/user-profile/get-user-profiles.use-case';
import { UpdateUserProfileByIdUseCase } from '@modules/users/application/use-cases/user-profile/update-user-profile-by-id.use-case';
import { createUserProfilePayloadSchema } from '@modules/users/presentation/http/validation/schemas/create-user-profile-payload.schema';
import type { ICreateUserProfilePayload } from '@modules/users/presentation/http/validation/schemas/create-user-profile-payload.types';
import { getByIdQuerySchema } from '@modules/users/presentation/http/validation/schemas/get-by-id-query.schema';
import type { IGetByIdQueryPayload } from '@modules/users/presentation/http/validation/schemas/get-by-id-query.types';
import { getUserProfilesQuerySchema } from '@modules/users/presentation/http/validation/schemas/get-user-profiles-query.schema';
import type { IGetUserProfilesQueryPayload } from '@modules/users/presentation/http/validation/schemas/get-user-profiles-query.types';
import { idParamSchema } from '@modules/users/presentation/http/validation/schemas/id-param.schema';
import type { IIdParamPayload } from '@modules/users/presentation/http/validation/schemas/id-param.types';
import { updateUserProfilePayloadSchema } from '@modules/users/presentation/http/validation/schemas/update-user-profile-payload.schema';
import type { IUpdateUserProfilePayload } from '@modules/users/presentation/http/validation/schemas/update-user-profile-payload.types';
import type { IGetMetadata } from '@shared/domain/decorators/i-get-metadata';
import type { ISessionUser } from '@shared/domain/i-session-user';
import { GetMetadata } from '@shared/presentation/decorators/get-metadata';
import { HttpBody, HttpParams, HttpQuery } from '@shared/presentation/http/decorators';
import { normalizeIdParam } from '@shared/presentation/http/helpers/normalize-id-param';
import { normalizeListQueryRaw } from '@shared/presentation/http/helpers/normalize-list-query-raw';
import { outputCreateUserProfileToCreateRootFolderInput } from '../mappers/user-profile/output-create-user-profile-to-create-root-folder-input';
import { payloadToCreateUserProfileInput } from '../mappers/user-profile/payload-to-create-user-profile-input';
import { payloadToDeleteUserProfileInput } from '../mappers/user-profile/payload-to-delete-user-profile-input';
import { payloadToFindManyParams } from '../mappers/user-profile/payload-to-find-many-params.mapper';
import { payloadToGetMyUserProfileInput } from '../mappers/user-profile/payload-to-get-my-user-profile-input';
import { payloadToGetUserProfileByIdInput } from '../mappers/user-profile/payload-to-get-user-profile-by-id-input';
import { payloadToUpdateUserProfileInput } from '../mappers/user-profile/payload-to-update-user-profile-input';
import { mapCreateUserProfileHttpResponse } from '../response/map-create-user-profile-response';
import { mapDeleteUserProfileHttpResponse } from '../response/map-delete-user-profile-response';
import { mapGetMyUserProfileHttpResponse } from '../response/map-get-my-user-profile-response';
import { mapGetUserProfileByIdHttpResponse } from '../response/map-get-user-profile-by-id-response';
import { mapGetUserProfilesHttpResponse } from '../response/map-get-user-profiles-response';
import { mapUpdateUserProfileHttpResponse } from '../response/map-update-user-profile-response';

@Controller({ path: 'user-profiles', version: '1' })
@UseGuards(JwtAuthGuard, AuthorizeGuard)
export class UserProfilesController {
  constructor(
    private readonly getUserProfilesUseCase: GetUserProfilesUseCase,
    private readonly getUserProfileByIdUseCase: GetUserProfileByIdUseCase,
    private readonly getMyUserProfileUseCase: GetMyUserProfileUseCase,
    private readonly createUserProfileUseCase: CreateUserProfileUseCase,
    private readonly createRootFolderUseCase: CreateRootFolderUseCase,
    private readonly updateUserProfileByIdUseCase: UpdateUserProfileByIdUseCase,
    private readonly deleteUserProfileByIdUseCase: DeleteUserProfileByIdUseCase,
  ) {}

  @Get()
  @Authorize({
    kind: 'permissions',
    permissions: [Permissions.userProfiles.read],
  })
  async getUserProfiles(
    @HttpQuery(getUserProfilesQuerySchema, {
      preprocess: normalizeListQueryRaw,
      errorMessage:
        'Некорректные параметры запроса списка профилей пользователей',
    })
    payload: IGetUserProfilesQueryPayload,
    @GetMetadata() metadata: IGetMetadata,
  ) {
    const params = payloadToFindManyParams(payload, metadata);
    const output = await this.getUserProfilesUseCase.execute(params);
    return mapGetUserProfilesHttpResponse(output, payload);
  }

  @Get('me')
  @Authorize({ kind: 'authenticated' })
  async getMyUserProfile(
    @HttpQuery(getByIdQuerySchema, {
      errorMessage: 'Некорректные параметры запроса',
    })
    queryPayload: IGetByIdQueryPayload,
    @AuthenticatedUser() user: ISessionUser,
    @GetMetadata() metadata: IGetMetadata,
  ) {
    const input = payloadToGetMyUserProfileInput(
      queryPayload,
      user,
      metadata.isStaffUser,
    );
    const item = await this.getMyUserProfileUseCase.execute(input);
    return mapGetMyUserProfileHttpResponse(item);
  }

  @Get(':id')
  @Authorize({
    kind: 'permissions',
    permissions: [Permissions.userProfiles.read],
  })
  async getUserProfileById(
    @HttpParams(idParamSchema, {
      preprocess: normalizeIdParam,
      errorMessage: 'Некорректный идентификатор',
    })
    params: IIdParamPayload,
    @HttpQuery(getByIdQuerySchema, {
      errorMessage: 'Некорректные параметры запроса',
    })
    queryPayload: IGetByIdQueryPayload,
    @AuthenticatedUser() user: ISessionUser,
    @GetMetadata() metadata: IGetMetadata,
  ) {
    const input = payloadToGetUserProfileByIdInput(
      params.id,
      queryPayload,
      user,
      metadata.isStaffUser,
    );
    const item = await this.getUserProfileByIdUseCase.execute(input);
    return mapGetUserProfileByIdHttpResponse(item);
  }

  @Post()
  @Authorize({
    kind: 'permissions',
    permissions: [Permissions.userProfiles.create],
  })
  async createUserProfile(
    @HttpBody(createUserProfilePayloadSchema, {
      errorMessage: 'Некорректный payload создания профиля пользователя',
    })
    payload: ICreateUserProfilePayload,
    @AuthenticatedUser() user: ISessionUser,
    @GetMetadata() metadata: IGetMetadata,
  ) {
    const input = payloadToCreateUserProfileInput(
      payload,
      user,
      metadata.isStaffUser,
    );
    const output = await this.createUserProfileUseCase.execute(input);
    await this.createRootFolderUseCase.execute(
      outputCreateUserProfileToCreateRootFolderInput(output, input),
    );
    return mapCreateUserProfileHttpResponse(output);
  }

  @Patch(':id')
  @Authorize({
    kind: 'permissions',
    permissions: [Permissions.userProfiles.update],
  })
  async updateUserProfile(
    @HttpParams(idParamSchema, {
      preprocess: normalizeIdParam,
      errorMessage: 'Некорректный идентификатор',
    })
    params: IIdParamPayload,
    @HttpBody(updateUserProfilePayloadSchema, {
      errorMessage: 'Некорректный payload обновления профиля пользователя',
    })
    payload: IUpdateUserProfilePayload,
    @AuthenticatedUser() user: ISessionUser,
    @GetMetadata() metadata: IGetMetadata,
  ) {
    const input = payloadToUpdateUserProfileInput(
      params.id,
      payload,
      user,
      metadata.isStaffUser,
    );
    const output = await this.updateUserProfileByIdUseCase.execute(input);
    return mapUpdateUserProfileHttpResponse(output);
  }

  @Delete(':id')
  @Authorize({
    kind: 'permissions',
    permissions: [Permissions.userProfiles.delete],
  })
  async deleteUserProfile(
    @HttpParams(idParamSchema, {
      preprocess: normalizeIdParam,
      errorMessage: 'Некорректный идентификатор',
    })
    params: IIdParamPayload,
    @AuthenticatedUser() user: ISessionUser,
    @GetMetadata() metadata: IGetMetadata,
  ) {
    const input = payloadToDeleteUserProfileInput(
      params.id,
      user,
      metadata.isStaffUser,
    );
    await this.deleteUserProfileByIdUseCase.execute(input);
    return mapDeleteUserProfileHttpResponse();
  }
}
