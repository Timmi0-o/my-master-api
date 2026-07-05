import { Controller, Delete, Get, Patch, Post, UseGuards } from '@nestjs/common';
import { AuthenticatedUser } from '@modules/auth/presentation/decorators/authenticated-user.decorator';
import { JwtAuthGuard } from '@modules/auth/presentation/guards/jwt-auth.guard';
import { Authorize } from '@modules/authorization/presentation/decorators/authorize.decorator';
import { AuthorizeGuard } from '@modules/authorization/presentation/guards/authorize.guard';
import { CreateRootFolderUseCase } from '@modules/files/application/use-cases/folder/create-root-folder.use-case';
import { CreateMasterProfileUseCase } from '@modules/masters/application/use-cases/master-profile/create-master-profile.use-case';
import { DeleteMasterProfileByIdUseCase } from '@modules/masters/application/use-cases/master-profile/delete-master-profile-by-id.use-case';
import { GetMasterProfileByIdUseCase } from '@modules/masters/application/use-cases/master-profile/get-master-profile-by-id.use-case';
import { GetMasterProfilesUseCase } from '@modules/masters/application/use-cases/master-profile/get-master-profiles.use-case';
import { GetMyMasterProfileUseCase } from '@modules/masters/application/use-cases/master-profile/get-my-master-profile.use-case';
import { UpdateMasterProfileByIdUseCase } from '@modules/masters/application/use-cases/master-profile/update-master-profile-by-id.use-case';
import { createMasterProfilePayloadSchema } from '@modules/masters/presentation/http/validation/schemas/create-master-profile-payload.schema';
import type { ICreateMasterProfilePayload } from '@modules/masters/presentation/http/validation/schemas/create-master-profile-payload.types';
import { getByIdQuerySchema } from '@modules/masters/presentation/http/validation/schemas/get-by-id-query.schema';
import type { IGetByIdQueryPayload } from '@modules/masters/presentation/http/validation/schemas/get-by-id-query.types';
import { getMasterProfilesQuerySchema } from '@modules/masters/presentation/http/validation/schemas/get-master-profiles-query.schema';
import type { IGetMasterProfilesQueryPayload } from '@modules/masters/presentation/http/validation/schemas/get-master-profiles-query.types';
import { idParamSchema } from '@modules/masters/presentation/http/validation/schemas/id-param.schema';
import type { IIdParamPayload } from '@modules/masters/presentation/http/validation/schemas/id-param.types';
import { updateMasterProfilePayloadSchema } from '@modules/masters/presentation/http/validation/schemas/update-master-profile-payload.schema';
import type { IUpdateMasterProfilePayload } from '@modules/masters/presentation/http/validation/schemas/update-master-profile-payload.types';
import type { IGetMetadata } from '@shared/domain/decorators/i-get-metadata';
import type { ISessionUser } from '@shared/domain/i-session-user';
import { GetMetadata } from '@shared/presentation/decorators/get-metadata';
import { PublicEndpoint } from '@shared/presentation/decorators/public-endpoint.decorator';
import { HttpBody, HttpParams, HttpQuery } from '@shared/presentation/http/decorators';
import { normalizeIdParam } from '@shared/presentation/http/helpers/normalize-id-param';
import { normalizeListQueryRaw } from '@shared/presentation/http/helpers/normalize-list-query-raw';
import { outputCreateMasterProfileToCreateRootFolderInput } from '../mappers/master-profile/output-create-master-profile-to-create-root-folder-input';
import { payloadToCreateMasterProfileInput } from '../mappers/master-profile/payload-to-create-master-profile-input';
import { payloadToDeleteMasterProfileInput } from '../mappers/master-profile/payload-to-delete-master-profile-input';
import { payloadToFindManyParams } from '../mappers/master-profile/payload-to-find-many-params.mapper';
import { payloadToGetMasterProfileByIdInput } from '../mappers/master-profile/payload-to-get-master-profile-by-id-input';
import { payloadToGetMyMasterProfileInput } from '../mappers/master-profile/payload-to-get-my-master-profile-input';
import { payloadToUpdateMasterProfileInput } from '../mappers/master-profile/payload-to-update-master-profile-input';
import { mapCreateMasterProfileHttpResponse } from '../response/map-create-master-profile-response';
import { mapDeleteMasterProfileHttpResponse } from '../response/map-delete-master-profile-response';
import { mapGetMasterProfileByIdHttpResponse } from '../response/map-get-master-profile-by-id-response';
import { mapGetMasterProfilesHttpResponse } from '../response/map-get-master-profiles-response';
import { mapGetMyMasterProfileHttpResponse } from '../response/map-get-my-master-profile-response';
import { mapUpdateMasterProfileHttpResponse } from '../response/map-update-master-profile-response';

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
  ) {}

  @Get()
  @PublicEndpoint()
  async getMasterProfiles(
    @HttpQuery(getMasterProfilesQuerySchema, {
      preprocess: normalizeListQueryRaw,
      errorMessage:
        'Некорректные параметры запроса списка профилей мастеров',
    })
    payload: IGetMasterProfilesQueryPayload,
    @GetMetadata() metadata: IGetMetadata,
  ) {
    const params = payloadToFindManyParams(payload, metadata);
    const output = await this.getMasterProfilesUseCase.execute(params);
    return mapGetMasterProfilesHttpResponse(output, payload);
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
    const input = payloadToGetMyMasterProfileInput(
      queryPayload,
      user,
      metadata.isStaffUser,
    );
    const item = await this.getMyMasterProfileUseCase.execute(input);
    return mapGetMyMasterProfileHttpResponse(item);
  }

  @Get(':id')
  @PublicEndpoint()
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
  ) {
    const input = payloadToGetMasterProfileByIdInput(params.id, queryPayload);
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
    const input = payloadToCreateMasterProfileInput(
      payload,
      user,
      metadata.isStaffUser,
    );
    const output = await this.createMasterProfileUseCase.execute(input);

    await this.createRootFolderUseCase.execute(
      outputCreateMasterProfileToCreateRootFolderInput(output, input),
    );

    return mapCreateMasterProfileHttpResponse(output);
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
    const input = payloadToUpdateMasterProfileInput(
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
    const input = payloadToDeleteMasterProfileInput(
      params.id,
      user,
      metadata.isStaffUser,
    );
    await this.deleteMasterProfileByIdUseCase.execute(input);
    return mapDeleteMasterProfileHttpResponse();
  }
}
