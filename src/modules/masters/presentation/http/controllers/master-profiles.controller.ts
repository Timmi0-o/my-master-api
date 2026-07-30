import { Controller, Delete, Get, Patch, Post, UseGuards } from '@nestjs/common';
import { AuthenticatedUser } from '@modules/auth/presentation/decorators/authenticated-user.decorator';
import { CurrentUser } from '@modules/auth/presentation/decorators/current-user.decorator';
import { JwtAuthGuard } from '@modules/auth/presentation/guards/jwt-auth.guard';
import { OptionalJwtAuthGuard } from '@modules/auth/presentation/guards/optional-jwt-auth.guard';
import { Authorize } from '@modules/authorization/presentation/decorators/authorize.decorator';
import { AuthorizeGuard } from '@modules/authorization/presentation/guards/authorize.guard';
import { CreateRootFolderUseCase } from '@modules/files/application/use-cases/folder/create-root-folder.use-case';
import { DeleteImagesUseCase } from '@modules/masters/application/use-cases/image/delete-images.use-case';
import { PresignImagesUseCase } from '@modules/masters/application/use-cases/image/presign-images.use-case';
import { CreateMasterProfileUseCase } from '@modules/masters/application/use-cases/master-profile/create-master-profile.use-case';
import { DeleteMasterProfileByIdUseCase } from '@modules/masters/application/use-cases/master-profile/delete-master-profile-by-id.use-case';
import { GetMasterProfileByIdUseCase } from '@modules/masters/application/use-cases/master-profile/get-master-profile-by-id.use-case';
import { GetMasterProfilesUseCase } from '@modules/masters/application/use-cases/master-profile/get-master-profiles.use-case';
import { GetMyMasterProfileUseCase } from '@modules/masters/application/use-cases/master-profile/get-my-master-profile.use-case';
import { UpdateMasterProfileByIdUseCase } from '@modules/masters/application/use-cases/master-profile/update-master-profile-by-id.use-case';
import { createMasterProfilePayloadSchema } from '@modules/masters/presentation/http/validation/schemas/create-master-profile-payload.schema';
import type { ICreateMasterProfilePayload } from '@modules/masters/presentation/http/validation/schemas/create-master-profile-payload.types';
import { deleteMasterProfileImagesPayloadSchema } from '@modules/masters/presentation/http/validation/schemas/delete-master-profile-images-payload.schema';
import type { IDeleteMasterProfileImagesPayload } from '@modules/masters/presentation/http/validation/schemas/delete-master-profile-images-payload.types';
import { getByIdQuerySchema } from '@modules/masters/presentation/http/validation/schemas/get-by-id-query.schema';
import type { IGetByIdQueryPayload } from '@modules/masters/presentation/http/validation/schemas/get-by-id-query.types';
import { getMasterProfilesQuerySchema } from '@modules/masters/presentation/http/validation/schemas/get-master-profiles-query.schema';
import type { IGetMasterProfilesQueryPayload } from '@modules/masters/presentation/http/validation/schemas/get-master-profiles-query.types';
import { idParamSchema } from '@modules/masters/presentation/http/validation/schemas/id-param.schema';
import type { IIdParamPayload } from '@modules/masters/presentation/http/validation/schemas/id-param.types';
import { presignMasterProfileImagesPayloadSchema } from '@modules/masters/presentation/http/validation/schemas/presign-master-profile-images-payload.schema';
import type { IPresignMasterProfileImagesPayload } from '@modules/masters/presentation/http/validation/schemas/presign-master-profile-images-payload.types';
import { updateMasterProfilePayloadSchema } from '@modules/masters/presentation/http/validation/schemas/update-master-profile-payload.schema';
import type { IUpdateMasterProfilePayload } from '@modules/masters/presentation/http/validation/schemas/update-master-profile-payload.types';
import type { IGetMetadata } from '@shared/domain/decorators/i-get-metadata';
import type { ISessionUser } from '@shared/domain/i-session-user';
import { GetMetadata } from '@shared/presentation/decorators/get-metadata';
import { PublicEndpoint } from '@shared/presentation/decorators/public-endpoint.decorator';
import { HttpBody, HttpParams, HttpQuery } from '@shared/presentation/http/decorators';
import { normalizeIdParam } from '@shared/presentation/http/helpers/normalize-id-param';
import { normalizeListQueryRaw } from '@shared/presentation/http/helpers/normalize-list-query-raw';
import { outputCreateMasterProfileToCreateRootFolderUseCaseInput } from '../request-mappers/master-profile/output-create-master-profile-to-create-root-folder-use-case-input';
import { requestBodyToCreateMasterProfileUseCaseInput } from '../request-mappers/master-profile/request-body-to-create-master-profile-use-case-input';
import { requestBodyToDeleteMasterProfileImagesUseCaseInput } from '../request-mappers/master-profile/request-body-to-delete-master-profile-images-use-case-input';
import { requestBodyToDeleteMasterProfileBannerImagesUseCaseInput } from '../request-mappers/master-profile/request-body-to-delete-master-profile-banner-images-use-case-input';
import { requestParamsToDeleteMasterProfileUseCaseInput } from '../request-mappers/master-profile/request-params-to-delete-master-profile-use-case-input';
import { requestQueryParamsToFindManyParams } from '../request-mappers/master-profile/request-query-params-to-find-many-params.mapper';
import { requestQueryParamsToGetMasterProfileByIdUseCaseInput } from '../request-mappers/master-profile/request-query-params-to-get-master-profile-by-id-use-case-input';
import { requestQueryParamsToGetMyMasterProfileUseCaseInput } from '../request-mappers/master-profile/request-query-params-to-get-my-master-profile-use-case-input';
import { requestBodyToPresignMasterProfileImagesUseCaseInput } from '../request-mappers/master-profile/request-body-to-presign-master-profile-images-use-case-input';
import { requestBodyToPresignMasterProfileBannerImagesUseCaseInput } from '../request-mappers/master-profile/request-body-to-presign-master-profile-banner-images-use-case-input';
import { requestBodyToUpdateMasterProfileUseCaseInput } from '../request-mappers/master-profile/request-body-to-update-master-profile-use-case-input';
import { mapCreateMasterProfileHttpResponse } from '../http-responses/map-create-master-profile-response';
import { mapDeleteMasterProfileHttpResponse } from '../http-responses/map-delete-master-profile-response';
import { mapDeleteMasterProfileImagesHttpResponse } from '../http-responses/map-delete-master-profile-images-response';
import { mapGetMasterProfileByIdHttpResponse } from '../http-responses/map-get-master-profile-by-id-response';
import { mapGetMasterProfilesHttpResponse } from '../http-responses/map-get-master-profiles-response';
import { mapGetMyMasterProfileHttpResponse } from '../http-responses/map-get-my-master-profile-response';
import { mapPresignMasterProfileImagesHttpResponse } from '../http-responses/map-presign-master-profile-images-response';
import { mapUpdateMasterProfileHttpResponse } from '../http-responses/map-update-master-profile-response';

@Controller({ path: 'master-profiles', version: '1' })
export class MasterProfilesController {
  constructor(
    private readonly getMasterProfilesUseCase: GetMasterProfilesUseCase,
    private readonly getMasterProfileByIdUseCase: GetMasterProfileByIdUseCase,
    private readonly getMyMasterProfileUseCase: GetMyMasterProfileUseCase,
    private readonly createMasterProfileUseCase: CreateMasterProfileUseCase,
    private readonly createRootFolderUseCase: CreateRootFolderUseCase,
    private readonly updateMasterProfileByIdUseCase: UpdateMasterProfileByIdUseCase,
    private readonly deleteMasterProfileByIdUseCase: DeleteMasterProfileByIdUseCase,
    private readonly presignImagesUseCase: PresignImagesUseCase,
    private readonly deleteImagesUseCase: DeleteImagesUseCase,
  ) {}

  @Get()
  @PublicEndpoint()
  @UseGuards(OptionalJwtAuthGuard)
  async getMasterProfiles(
    @HttpQuery(getMasterProfilesQuerySchema, {
      preprocess: normalizeListQueryRaw,
      errorMessage:
        'Некорректные параметры запроса списка профилей мастеров',
    })
    queryParams: IGetMasterProfilesQueryPayload,
    @GetMetadata() metadata: IGetMetadata,
    @CurrentUser() user: ISessionUser | null,
  ) {
    const params = requestQueryParamsToFindManyParams(queryParams, metadata);
    const output = await this.getMasterProfilesUseCase.execute(
      params,
      user?.id,
    );
    return mapGetMasterProfilesHttpResponse(output, queryParams);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard, AuthorizeGuard)
  @Authorize({ kind: 'authenticated' })
  async getMyMasterProfile(
    @HttpQuery(getByIdQuerySchema, {
      errorMessage: 'Некорректные параметры запроса',
    })
    queryPayload: IGetByIdQueryPayload,
    @AuthenticatedUser() user: ISessionUser,
    @GetMetadata() metadata: IGetMetadata,
  ) {
    const input = requestQueryParamsToGetMyMasterProfileUseCaseInput(
      queryPayload,
      user,
      metadata.isStaffUser,
    );
    const item = await this.getMyMasterProfileUseCase.execute(input);
    return mapGetMyMasterProfileHttpResponse(item);
  }

  @Get(':id')
  @PublicEndpoint()
  @UseGuards(OptionalJwtAuthGuard)
  async getMasterProfileById(
    @HttpParams(idParamSchema, {
      preprocess: normalizeIdParam,
      errorMessage: 'Некорректный идентификатор',
    })
    params: IIdParamPayload,
    @HttpQuery(getByIdQuerySchema, {
      errorMessage: 'Некорректные параметры запроса',
    })
    queryPayload: IGetByIdQueryPayload,
    @CurrentUser() user: ISessionUser | null,
    @GetMetadata() metadata: IGetMetadata,
  ) {
    const input = requestQueryParamsToGetMasterProfileByIdUseCaseInput(
      params.id,
      queryPayload,
      user,
      metadata.isStaffUser,
    );
    const item = await this.getMasterProfileByIdUseCase.execute(input);
    return mapGetMasterProfileByIdHttpResponse(item);
  }

  @Post()
  @UseGuards(JwtAuthGuard, AuthorizeGuard)
  @Authorize({ kind: 'authenticated' })
  async createMasterProfile(
    @HttpBody(createMasterProfilePayloadSchema, {
      errorMessage: 'Некорректный payload создания профиля мастера',
    })
    payload: ICreateMasterProfilePayload,
    @AuthenticatedUser() user: ISessionUser,
    @GetMetadata() metadata: IGetMetadata,
  ) {
    const input = requestBodyToCreateMasterProfileUseCaseInput(
      payload,
      user,
      metadata.isStaffUser,
    );
    const output = await this.createMasterProfileUseCase.execute(input);

    await this.createRootFolderUseCase.execute(
      outputCreateMasterProfileToCreateRootFolderUseCaseInput(output, input),
    );

    return mapCreateMasterProfileHttpResponse(output);
  }

  @Post(':id/images/presign')
  @UseGuards(JwtAuthGuard, AuthorizeGuard)
  @Authorize({ kind: 'authenticated' })
  async presignMasterProfileImages(
    @HttpParams(idParamSchema, {
      preprocess: normalizeIdParam,
      errorMessage: 'Некорректный идентификатор',
    })
    params: IIdParamPayload,
    @HttpBody(presignMasterProfileImagesPayloadSchema, {
      errorMessage: 'Некорректный payload presign аватара профиля мастера',
    })
    payload: IPresignMasterProfileImagesPayload,
    @AuthenticatedUser() user: ISessionUser,
    @GetMetadata() metadata: IGetMetadata,
  ) {
    const input = requestBodyToPresignMasterProfileImagesUseCaseInput(
      params.id,
      payload,
      user,
      metadata.isStaffUser,
    );
    const output = await this.presignImagesUseCase.execute(input);
    return mapPresignMasterProfileImagesHttpResponse(output);
  }

  @Delete(':id/images')
  @UseGuards(JwtAuthGuard, AuthorizeGuard)
  @Authorize({ kind: 'authenticated' })
  async deleteMasterProfileImages(
    @HttpParams(idParamSchema, {
      preprocess: normalizeIdParam,
      errorMessage: 'Некорректный идентификатор',
    })
    params: IIdParamPayload,
    @HttpBody(deleteMasterProfileImagesPayloadSchema, {
      errorMessage: 'Некорректный payload удаления аватара профиля мастера',
    })
    payload: IDeleteMasterProfileImagesPayload,
    @AuthenticatedUser() user: ISessionUser,
    @GetMetadata() metadata: IGetMetadata,
  ) {
    const input = requestBodyToDeleteMasterProfileImagesUseCaseInput(
      params.id,
      payload,
      user,
      metadata.isStaffUser,
    );
    const output = await this.deleteImagesUseCase.execute(input);
    return mapDeleteMasterProfileImagesHttpResponse(output);
  }

  @Post(':id/banner/images/presign')
  @UseGuards(JwtAuthGuard, AuthorizeGuard)
  @Authorize({ kind: 'authenticated' })
  async presignMasterProfileBannerImages(
    @HttpParams(idParamSchema, {
      preprocess: normalizeIdParam,
      errorMessage: 'Некорректный идентификатор',
    })
    params: IIdParamPayload,
    @HttpBody(presignMasterProfileImagesPayloadSchema, {
      errorMessage: 'Некорректный payload presign баннера профиля мастера',
    })
    payload: IPresignMasterProfileImagesPayload,
    @AuthenticatedUser() user: ISessionUser,
    @GetMetadata() metadata: IGetMetadata,
  ) {
    const input = requestBodyToPresignMasterProfileBannerImagesUseCaseInput(
      params.id,
      payload,
      user,
      metadata.isStaffUser,
    );
    const output = await this.presignImagesUseCase.execute(input);
    return mapPresignMasterProfileImagesHttpResponse(output);
  }

  @Delete(':id/banner/images')
  @UseGuards(JwtAuthGuard, AuthorizeGuard)
  @Authorize({ kind: 'authenticated' })
  async deleteMasterProfileBannerImages(
    @HttpParams(idParamSchema, {
      preprocess: normalizeIdParam,
      errorMessage: 'Некорректный идентификатор',
    })
    params: IIdParamPayload,
    @HttpBody(deleteMasterProfileImagesPayloadSchema, {
      errorMessage: 'Некорректный payload удаления баннера профиля мастера',
    })
    payload: IDeleteMasterProfileImagesPayload,
    @AuthenticatedUser() user: ISessionUser,
    @GetMetadata() metadata: IGetMetadata,
  ) {
    const input = requestBodyToDeleteMasterProfileBannerImagesUseCaseInput(
      params.id,
      payload,
      user,
      metadata.isStaffUser,
    );
    const output = await this.deleteImagesUseCase.execute(input);
    return mapDeleteMasterProfileImagesHttpResponse(output);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, AuthorizeGuard)
  @Authorize({ kind: 'authenticated' })
  async updateMasterProfile(
    @HttpParams(idParamSchema, {
      preprocess: normalizeIdParam,
      errorMessage: 'Некорректный идентификатор',
    })
    params: IIdParamPayload,
    @HttpBody(updateMasterProfilePayloadSchema, {
      errorMessage: 'Некорректный payload обновления профиля мастера',
    })
    payload: IUpdateMasterProfilePayload,
    @AuthenticatedUser() user: ISessionUser,
    @GetMetadata() metadata: IGetMetadata,
  ) {
    const input = requestBodyToUpdateMasterProfileUseCaseInput(
      params.id,
      payload,
      user,
      metadata.isStaffUser,
    );
    const output = await this.updateMasterProfileByIdUseCase.execute(input);
    return mapUpdateMasterProfileHttpResponse(output);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, AuthorizeGuard)
  @Authorize({ kind: 'authenticated' })
  async deleteMasterProfile(
    @HttpParams(idParamSchema, {
      preprocess: normalizeIdParam,
      errorMessage: 'Некорректный идентификатор',
    })
    params: IIdParamPayload,
    @AuthenticatedUser() user: ISessionUser,
    @GetMetadata() metadata: IGetMetadata,
  ) {
    const input = requestParamsToDeleteMasterProfileUseCaseInput(
      params.id,
      user,
      metadata.isStaffUser,
    );
    await this.deleteMasterProfileByIdUseCase.execute(input);
    return mapDeleteMasterProfileHttpResponse();
  }
}
