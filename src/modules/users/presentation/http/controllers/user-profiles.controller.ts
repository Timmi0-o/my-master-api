import { AuthenticatedUser } from '@modules/auth/presentation/decorators/authenticated-user.decorator';
import { JwtAuthGuard } from '@modules/auth/presentation/guards/jwt-auth.guard';
import { Permissions } from '@modules/authorization/domain/permissions/permission-names';
import { Authorize } from '@modules/authorization/presentation/decorators/authorize.decorator';
import { AuthorizeGuard } from '@modules/authorization/presentation/guards/authorize.guard';
import { CreateRootFolderUseCase } from '@modules/files/application/use-cases/folder/create-root-folder.use-case';
import { DeleteImagesUseCase } from '@modules/masters/application/use-cases/image/delete-images.use-case';
import { PresignImagesUseCase } from '@modules/masters/application/use-cases/image/presign-images.use-case';
import { CreateUserProfileUseCase } from '@modules/users/application/use-cases/user-profile/create-user-profile.use-case';
import { DeleteUserProfileByIdUseCase } from '@modules/users/application/use-cases/user-profile/delete-user-profile-by-id.use-case';
import { GetMyUserProfileUseCase } from '@modules/users/application/use-cases/user-profile/get-my-user-profile.use-case';
import { GetUserProfileByIdUseCase } from '@modules/users/application/use-cases/user-profile/get-user-profile-by-id.use-case';
import { GetUserProfilesUseCase } from '@modules/users/application/use-cases/user-profile/get-user-profiles.use-case';
import { UpdateUserProfileByIdUseCase } from '@modules/users/application/use-cases/user-profile/update-user-profile-by-id.use-case';
import { createUserProfilePayloadSchema } from '@modules/users/presentation/http/validation/schemas/create-user-profile-payload.schema';
import type { ICreateUserProfilePayload } from '@modules/users/presentation/http/validation/schemas/create-user-profile-payload.types';
import { deleteUserProfileImagesPayloadSchema } from '@modules/users/presentation/http/validation/schemas/delete-user-profile-images-payload.schema';
import type { IDeleteUserProfileImagesPayload } from '@modules/users/presentation/http/validation/schemas/delete-user-profile-images-payload.types';
import { getByIdQuerySchema } from '@modules/users/presentation/http/validation/schemas/get-by-id-query.schema';
import type { IGetByIdQueryPayload } from '@modules/users/presentation/http/validation/schemas/get-by-id-query.types';
import { getUserProfilesQuerySchema } from '@modules/users/presentation/http/validation/schemas/get-user-profiles-query.schema';
import type { IGetUserProfilesQueryPayload } from '@modules/users/presentation/http/validation/schemas/get-user-profiles-query.types';
import { idParamSchema } from '@modules/users/presentation/http/validation/schemas/id-param.schema';
import type { IIdParamPayload } from '@modules/users/presentation/http/validation/schemas/id-param.types';
import { presignUserProfileImagesPayloadSchema } from '@modules/users/presentation/http/validation/schemas/presign-user-profile-images-payload.schema';
import type { IPresignUserProfileImagesPayload } from '@modules/users/presentation/http/validation/schemas/presign-user-profile-images-payload.types';
import { updateUserProfilePayloadSchema } from '@modules/users/presentation/http/validation/schemas/update-user-profile-payload.schema';
import type { IUpdateUserProfilePayload } from '@modules/users/presentation/http/validation/schemas/update-user-profile-payload.types';
import {
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import type { IGetMetadata } from '@shared/domain/decorators/i-get-metadata';
import type { ISessionUser } from '@shared/domain/i-session-user';
import { RateLimiter } from '@shared/infrastructure/throttler/http-rate-limit.decorators';
import { GetMetadata } from '@shared/presentation/decorators/get-metadata';
import {
  HttpBody,
  HttpParams,
  HttpQuery,
} from '@shared/presentation/http/decorators';
import { normalizeIdParam } from '@shared/presentation/http/helpers/normalize-id-param';
import { normalizeListQueryRaw } from '@shared/presentation/http/helpers/normalize-list-query-raw';
import { mapCreateUserProfileHttpResponse } from '../http-responses/map-create-user-profile-response';
import { mapDeleteUserProfileImagesHttpResponse } from '../http-responses/map-delete-user-profile-images-response';
import { mapDeleteUserProfileHttpResponse } from '../http-responses/map-delete-user-profile-response';
import { mapGetMyUserProfileHttpResponse } from '../http-responses/map-get-my-user-profile-response';
import { mapGetUserProfileByIdHttpResponse } from '../http-responses/map-get-user-profile-by-id-response';
import { mapGetUserProfilesHttpResponse } from '../http-responses/map-get-user-profiles-response';
import { mapPresignUserProfileImagesHttpResponse } from '../http-responses/map-presign-user-profile-images-response';
import { mapUpdateUserProfileHttpResponse } from '../http-responses/map-update-user-profile-response';
import { outputCreateUserProfileToCreateRootFolderUseCaseInput } from '../request-mappers/user-profile/output-create-user-profile-to-create-root-folder-use-case-input';
import { requestBodyToCreateUserProfileUseCaseInput } from '../request-mappers/user-profile/request-body-to-create-user-profile-use-case-input';
import { requestBodyToDeleteUserProfileBannerImagesUseCaseInput } from '../request-mappers/user-profile/request-body-to-delete-user-profile-banner-images-use-case-input';
import { requestBodyToDeleteUserProfileImagesUseCaseInput } from '../request-mappers/user-profile/request-body-to-delete-user-profile-images-use-case-input';
import { requestBodyToPresignUserProfileBannerImagesUseCaseInput } from '../request-mappers/user-profile/request-body-to-presign-user-profile-banner-images-use-case-input';
import { requestBodyToPresignUserProfileImagesUseCaseInput } from '../request-mappers/user-profile/request-body-to-presign-user-profile-images-use-case-input';
import { requestBodyToUpdateUserProfileUseCaseInput } from '../request-mappers/user-profile/request-body-to-update-user-profile-use-case-input';
import { requestParamsToDeleteUserProfileUseCaseInput } from '../request-mappers/user-profile/request-params-to-delete-user-profile-use-case-input';
import { requestQueryParamsToFindManyParams } from '../request-mappers/user-profile/request-query-params-to-find-many-params.mapper';
import { requestQueryParamsToGetMyUserProfileUseCaseInput } from '../request-mappers/user-profile/request-query-params-to-get-my-user-profile-use-case-input';
import { requestQueryParamsToGetUserProfileByIdUseCaseInput } from '../request-mappers/user-profile/request-query-params-to-get-user-profile-by-id-use-case-input';

@RateLimiter('standard')
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
    private readonly presignImagesUseCase: PresignImagesUseCase,
    private readonly deleteImagesUseCase: DeleteImagesUseCase,
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
    queryParams: IGetUserProfilesQueryPayload,
    @GetMetadata() metadata: IGetMetadata,
    @AuthenticatedUser() user: ISessionUser,
  ) {
    const params = requestQueryParamsToFindManyParams(queryParams, metadata);
    const output = await this.getUserProfilesUseCase.execute(params, user.id);
    return mapGetUserProfilesHttpResponse(output, queryParams);
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
    const input = requestQueryParamsToGetMyUserProfileUseCaseInput(
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
    const input = requestQueryParamsToGetUserProfileByIdUseCaseInput(
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
    const input = requestBodyToCreateUserProfileUseCaseInput(
      payload,
      user,
      metadata.isStaffUser,
    );
    const output = await this.createUserProfileUseCase.execute(input);
    await this.createRootFolderUseCase.execute(
      outputCreateUserProfileToCreateRootFolderUseCaseInput(output, input),
    );
    return mapCreateUserProfileHttpResponse(output);
  }

  @Post(':id/images/presign')
  @Authorize({ kind: 'authenticated' })
  async presignUserProfileImages(
    @HttpParams(idParamSchema, {
      preprocess: normalizeIdParam,
      errorMessage: 'Некорректный идентификатор',
    })
    params: IIdParamPayload,
    @HttpBody(presignUserProfileImagesPayloadSchema, {
      errorMessage: 'Некорректный payload presign аватара профиля пользователя',
    })
    payload: IPresignUserProfileImagesPayload,
    @AuthenticatedUser() user: ISessionUser,
    @GetMetadata() metadata: IGetMetadata,
  ) {
    const input = requestBodyToPresignUserProfileImagesUseCaseInput(
      params.id,
      payload,
      user,
      metadata.isStaffUser,
    );
    const output = await this.presignImagesUseCase.execute(input);
    return mapPresignUserProfileImagesHttpResponse(output);
  }

  @Delete(':id/images')
  @Authorize({ kind: 'authenticated' })
  async deleteUserProfileImages(
    @HttpParams(idParamSchema, {
      preprocess: normalizeIdParam,
      errorMessage: 'Некорректный идентификатор',
    })
    params: IIdParamPayload,
    @HttpBody(deleteUserProfileImagesPayloadSchema, {
      errorMessage:
        'Некорректный payload удаления аватара профиля пользователя',
    })
    payload: IDeleteUserProfileImagesPayload,
    @AuthenticatedUser() user: ISessionUser,
    @GetMetadata() metadata: IGetMetadata,
  ) {
    const input = requestBodyToDeleteUserProfileImagesUseCaseInput(
      params.id,
      payload,
      user,
      metadata.isStaffUser,
    );
    const output = await this.deleteImagesUseCase.execute(input);
    return mapDeleteUserProfileImagesHttpResponse(output);
  }

  @Post(':id/banner/images/presign')
  @Authorize({ kind: 'authenticated' })
  async presignUserProfileBannerImages(
    @HttpParams(idParamSchema, {
      preprocess: normalizeIdParam,
      errorMessage: 'Некорректный идентификатор',
    })
    params: IIdParamPayload,
    @HttpBody(presignUserProfileImagesPayloadSchema, {
      errorMessage: 'Некорректный payload presign баннера профиля пользователя',
    })
    payload: IPresignUserProfileImagesPayload,
    @AuthenticatedUser() user: ISessionUser,
    @GetMetadata() metadata: IGetMetadata,
  ) {
    const input = requestBodyToPresignUserProfileBannerImagesUseCaseInput(
      params.id,
      payload,
      user,
      metadata.isStaffUser,
    );
    const output = await this.presignImagesUseCase.execute(input);
    return mapPresignUserProfileImagesHttpResponse(output);
  }

  @Delete(':id/banner/images')
  @Authorize({ kind: 'authenticated' })
  async deleteUserProfileBannerImages(
    @HttpParams(idParamSchema, {
      preprocess: normalizeIdParam,
      errorMessage: 'Некорректный идентификатор',
    })
    params: IIdParamPayload,
    @HttpBody(deleteUserProfileImagesPayloadSchema, {
      errorMessage:
        'Некорректный payload удаления баннера профиля пользователя',
    })
    payload: IDeleteUserProfileImagesPayload,
    @AuthenticatedUser() user: ISessionUser,
    @GetMetadata() metadata: IGetMetadata,
  ) {
    const input = requestBodyToDeleteUserProfileBannerImagesUseCaseInput(
      params.id,
      payload,
      user,
      metadata.isStaffUser,
    );
    const output = await this.deleteImagesUseCase.execute(input);
    return mapDeleteUserProfileImagesHttpResponse(output);
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
    const input = requestBodyToUpdateUserProfileUseCaseInput(
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
    const input = requestParamsToDeleteUserProfileUseCaseInput(
      params.id,
      user,
      metadata.isStaffUser,
    );
    await this.deleteUserProfileByIdUseCase.execute(input);
    return mapDeleteUserProfileHttpResponse();
  }
}
