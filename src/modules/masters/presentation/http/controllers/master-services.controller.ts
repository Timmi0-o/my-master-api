import { Controller, Delete, Get, Patch, Post, UseGuards } from '@nestjs/common';
import { AuthenticatedUser } from '@modules/auth/presentation/decorators/authenticated-user.decorator';
import { JwtAuthGuard } from '@modules/auth/presentation/guards/jwt-auth.guard';
import { Authorize } from '@modules/authorization/presentation/decorators/authorize.decorator';
import { AuthorizeGuard } from '@modules/authorization/presentation/guards/authorize.guard';
import { CreateMasterServiceUseCase } from '@modules/masters/application/use-cases/master-service/create-master-service.use-case';
import { DeleteImagesUseCase } from '@modules/masters/application/use-cases/image/delete-images.use-case';
import { DeleteMasterServiceByIdUseCase } from '@modules/masters/application/use-cases/master-service/delete-master-service-by-id.use-case';
import { GetMasterServiceAvailableSlotsUseCase } from '@modules/masters/application/use-cases/master-service/get-master-service-available-slots.use-case';
import { GetMasterServiceByIdUseCase } from '@modules/masters/application/use-cases/master-service/get-master-service-by-id.use-case';
import { GetMasterServicesUseCase } from '@modules/masters/application/use-cases/master-service/get-master-services.use-case';
import { GetMyServicesUseCase } from '@modules/masters/application/use-cases/master-service/get-my-services.use-case';
import { PresignImagesUseCase } from '@modules/masters/application/use-cases/image/presign-images.use-case';
import { UpdateMasterServiceByIdUseCase } from '@modules/masters/application/use-cases/master-service/update-master-service-by-id.use-case';
import { createMasterServicePayloadSchema } from '@modules/masters/presentation/http/validation/schemas/create-master-service-payload.schema';
import type { ICreateMasterServicePayload } from '@modules/masters/presentation/http/validation/schemas/create-master-service-payload.types';
import { deleteMasterServiceImagesPayloadSchema } from '@modules/masters/presentation/http/validation/schemas/delete-master-service-images-payload.schema';
import type { IDeleteMasterServiceImagesPayload } from '@modules/masters/presentation/http/validation/schemas/delete-master-service-images-payload.types';
import { getByIdQuerySchema } from '@modules/masters/presentation/http/validation/schemas/get-by-id-query.schema';
import type { IGetByIdQueryPayload } from '@modules/masters/presentation/http/validation/schemas/get-by-id-query.types';
import { getMasterServiceAvailableSlotsQuerySchema } from '@modules/masters/presentation/http/validation/schemas/get-master-service-available-slots-query.schema';
import type { IGetMasterServiceAvailableSlotsQueryPayload } from '@modules/masters/presentation/http/validation/schemas/get-master-service-available-slots-query.types';
import { getMasterServicesQuerySchema } from '@modules/masters/presentation/http/validation/schemas/get-master-services-query.schema';
import type { IGetMasterServicesQueryPayload } from '@modules/masters/presentation/http/validation/schemas/get-master-services-query.types';
import { getMyServicesQuerySchema } from '@modules/masters/presentation/http/validation/schemas/get-my-services-query.schema';
import type { IGetMyServicesQueryPayload } from '@modules/masters/presentation/http/validation/schemas/get-my-services-query.types';
import { idParamSchema } from '@modules/masters/presentation/http/validation/schemas/id-param.schema';
import type { IIdParamPayload } from '@modules/masters/presentation/http/validation/schemas/id-param.types';
import { presignMasterServiceImagesPayloadSchema } from '@modules/masters/presentation/http/validation/schemas/presign-master-service-images-payload.schema';
import type { IPresignMasterServiceImagesPayload } from '@modules/masters/presentation/http/validation/schemas/presign-master-service-images-payload.types';
import { updateMasterServicePayloadSchema } from '@modules/masters/presentation/http/validation/schemas/update-master-service-payload.schema';
import type { IUpdateMasterServicePayload } from '@modules/masters/presentation/http/validation/schemas/update-master-service-payload.types';
import type { IGetMetadata } from '@shared/domain/decorators/i-get-metadata';
import type { ISessionUser } from '@shared/domain/i-session-user';
import { GetMetadata } from '@shared/presentation/decorators/get-metadata';
import { PublicEndpoint } from '@shared/presentation/decorators/public-endpoint.decorator';
import { HttpBody, HttpParams, HttpQuery } from '@shared/presentation/http/decorators';
import { normalizeIdParam } from '@shared/presentation/http/helpers/normalize-id-param';
import { normalizeListQueryRaw } from '@shared/presentation/http/helpers/normalize-list-query-raw';
import { requestBodyToCreateMasterServiceUseCaseInput } from '../request-mappers/master-service/request-body-to-create-master-service-use-case-input';
import { requestBodyToDeleteMasterServiceImagesUseCaseInput } from '../request-mappers/master-service/request-body-to-delete-master-service-images-use-case-input';
import { requestParamsToDeleteMasterServiceUseCaseInput } from '../request-mappers/master-service/request-params-to-delete-master-service-use-case-input';
import { requestQueryParamsToFindManyParams } from '../request-mappers/master-service/request-query-params-to-find-many-params.mapper';
import { requestQueryParamsToFindMyServicesParams } from '../request-mappers/master-service/request-query-params-to-find-my-services-params.mapper';
import { requestQueryParamsToGetMasterServiceByIdUseCaseInput } from '../request-mappers/master-service/request-query-params-to-get-master-service-by-id-use-case-input';
import { findManyParamsToGetMyServicesUseCaseInput } from '../request-mappers/master-service/find-many-params-to-get-my-services-use-case-input';
import { requestBodyToPresignMasterServiceImagesUseCaseInput } from '../request-mappers/master-service/request-body-to-presign-master-service-images-use-case-input';
import { requestBodyToUpdateMasterServiceUseCaseInput } from '../request-mappers/master-service/request-body-to-update-master-service-use-case-input';
import { mapCreateMasterServiceHttpResponse } from '../http-responses/map-create-master-service-response';
import { mapDeleteMasterServiceImagesHttpResponse } from '../http-responses/map-delete-master-service-images-response';
import { mapDeleteMasterServiceHttpResponse } from '../http-responses/map-delete-master-service-response';
import { mapGetMasterServiceAvailableSlotsHttpResponse } from '../http-responses/map-get-master-service-available-slots-response';
import { mapGetMasterServiceByIdHttpResponse } from '../http-responses/map-get-master-service-by-id-response';
import { mapGetMasterServicesHttpResponse } from '../http-responses/map-get-master-services-response';
import { mapGetMyServicesHttpResponse } from '../http-responses/map-get-my-services-response';
import { mapPresignMasterServiceImagesHttpResponse } from '../http-responses/map-presign-master-service-images-response';
import { mapUpdateMasterServiceHttpResponse } from '../http-responses/map-update-master-service-response';

@Controller({ path: 'master-services', version: '1' })
export class MasterServicesController {
  constructor(
    private readonly getMasterServicesUseCase: GetMasterServicesUseCase,
    private readonly getMasterServiceByIdUseCase: GetMasterServiceByIdUseCase,
    private readonly createMasterServiceUseCase: CreateMasterServiceUseCase,
    private readonly updateMasterServiceByIdUseCase: UpdateMasterServiceByIdUseCase,
    private readonly deleteMasterServiceByIdUseCase: DeleteMasterServiceByIdUseCase,
    private readonly getMasterServiceAvailableSlotsUseCase: GetMasterServiceAvailableSlotsUseCase,
    private readonly getMyServicesUseCase: GetMyServicesUseCase,
    private readonly presignImagesUseCase: PresignImagesUseCase,
    private readonly deleteImagesUseCase: DeleteImagesUseCase,
  ) {}

  @Get()
  @PublicEndpoint()
  async getMasterServices(
    @HttpQuery(getMasterServicesQuerySchema, {
      preprocess: normalizeListQueryRaw,
      errorMessage: 'Некорректные параметры запроса списка услуг мастеров',
    })
    queryParams: IGetMasterServicesQueryPayload,
    @GetMetadata() metadata: IGetMetadata,
  ) {
    const params = requestQueryParamsToFindManyParams(queryParams, metadata);
    const output = await this.getMasterServicesUseCase.execute(params);
    return mapGetMasterServicesHttpResponse(output, queryParams);
  }

  @Get('my')
  @UseGuards(JwtAuthGuard, AuthorizeGuard)
  @Authorize({ kind: 'authenticated' })
  async getMyServices(
    @HttpQuery(getMyServicesQuerySchema, {
      preprocess: normalizeListQueryRaw,
      errorMessage: 'Некорректные параметры запроса списка моих услуг',
    })
    payload: IGetMyServicesQueryPayload,
    @AuthenticatedUser() user: ISessionUser,
    @GetMetadata() metadata: IGetMetadata,
  ) {
    const params = requestQueryParamsToFindMyServicesParams(payload, metadata);
    const input = findManyParamsToGetMyServicesUseCaseInput(
      params,
      user,
      metadata.isStaffUser,
    );
    const output = await this.getMyServicesUseCase.execute(input);
    return mapGetMyServicesHttpResponse(output, payload);
  }

  @Get(':id/available-slots')
  @UseGuards(JwtAuthGuard, AuthorizeGuard)
  @Authorize({ kind: 'authenticated' })
  async getMasterServiceAvailableSlots(
    @HttpParams(idParamSchema, {
      preprocess: normalizeIdParam,
      errorMessage: 'Некорректный идентификатор',
    })
    params: IIdParamPayload,
    @HttpQuery(getMasterServiceAvailableSlotsQuerySchema, {
      errorMessage: 'Некорректные параметры запроса свободных слотов',
    })
    queryPayload: IGetMasterServiceAvailableSlotsQueryPayload,
  ) {
    const output = await this.getMasterServiceAvailableSlotsUseCase.execute({
      masterServiceId: params.id,
      date: queryPayload.date,
    });
    return mapGetMasterServiceAvailableSlotsHttpResponse(output);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, AuthorizeGuard)
  @Authorize({ kind: 'authenticated' })
  async getMasterServiceById(
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
    const input = requestQueryParamsToGetMasterServiceByIdUseCaseInput(
      params.id,
      queryPayload,
      user,
      metadata.isStaffUser,
    );
    const item = await this.getMasterServiceByIdUseCase.execute(input);
    return mapGetMasterServiceByIdHttpResponse(item);
  }

  @Post()
  @UseGuards(JwtAuthGuard, AuthorizeGuard)
  @Authorize({ kind: 'authenticated' })
  async createMasterService(
    @HttpBody(createMasterServicePayloadSchema, {
      errorMessage: 'Некорректный payload создания услуги мастера',
    })
    payload: ICreateMasterServicePayload,
    @AuthenticatedUser() user: ISessionUser,
    @GetMetadata() metadata: IGetMetadata,
  ) {
    const input = requestBodyToCreateMasterServiceUseCaseInput(
      payload,
      user,
      metadata.isStaffUser,
    );
    const output = await this.createMasterServiceUseCase.execute(input);
    return mapCreateMasterServiceHttpResponse(output);
  }

  @Post(':id/images/presign')
  @UseGuards(JwtAuthGuard, AuthorizeGuard)
  @Authorize({ kind: 'authenticated' })
  async presignMasterServiceImages(
    @HttpParams(idParamSchema, {
      preprocess: normalizeIdParam,
      errorMessage: 'Некорректный идентификатор',
    })
    params: IIdParamPayload,
    @HttpBody(presignMasterServiceImagesPayloadSchema, {
      errorMessage: 'Некорректный payload presign фотографий услуги',
    })
    payload: IPresignMasterServiceImagesPayload,
    @AuthenticatedUser() user: ISessionUser,
    @GetMetadata() metadata: IGetMetadata,
  ) {
    const input = requestBodyToPresignMasterServiceImagesUseCaseInput(
      params.id,
      payload,
      user,
      metadata.isStaffUser,
    );
    const output = await this.presignImagesUseCase.execute(input);
    return mapPresignMasterServiceImagesHttpResponse(output);
  }

  @Delete(':id/images')
  @UseGuards(JwtAuthGuard, AuthorizeGuard)
  @Authorize({ kind: 'authenticated' })
  async deleteMasterServiceImages(
    @HttpParams(idParamSchema, {
      preprocess: normalizeIdParam,
      errorMessage: 'Некорректный идентификатор',
    })
    params: IIdParamPayload,
    @HttpBody(deleteMasterServiceImagesPayloadSchema, {
      errorMessage: 'Некорректный payload удаления фотографий услуги',
    })
    payload: IDeleteMasterServiceImagesPayload,
    @AuthenticatedUser() user: ISessionUser,
    @GetMetadata() metadata: IGetMetadata,
  ) {
    const input = requestBodyToDeleteMasterServiceImagesUseCaseInput(
      params.id,
      payload,
      user,
      metadata.isStaffUser,
    );
    const output = await this.deleteImagesUseCase.execute(input);
    return mapDeleteMasterServiceImagesHttpResponse(output);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, AuthorizeGuard)
  @Authorize({ kind: 'authenticated' })
  async updateMasterService(
    @HttpParams(idParamSchema, {
      preprocess: normalizeIdParam,
      errorMessage: 'Некорректный идентификатор',
    })
    params: IIdParamPayload,
    @HttpBody(updateMasterServicePayloadSchema, {
      errorMessage: 'Некорректный payload обновления услуги мастера',
    })
    payload: IUpdateMasterServicePayload,
    @AuthenticatedUser() user: ISessionUser,
    @GetMetadata() metadata: IGetMetadata,
  ) {
    const input = requestBodyToUpdateMasterServiceUseCaseInput(
      params.id,
      payload,
      user,
      metadata.isStaffUser,
    );
    const output = await this.updateMasterServiceByIdUseCase.execute(input);
    return mapUpdateMasterServiceHttpResponse(output);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, AuthorizeGuard)
  @Authorize({ kind: 'authenticated' })
  async deleteMasterService(
    @HttpParams(idParamSchema, {
      preprocess: normalizeIdParam,
      errorMessage: 'Некорректный идентификатор',
    })
    params: IIdParamPayload,
    @AuthenticatedUser() user: ISessionUser,
    @GetMetadata() metadata: IGetMetadata,
  ) {
    const input = requestParamsToDeleteMasterServiceUseCaseInput(
      params.id,
      user,
      metadata.isStaffUser,
    );
    await this.deleteMasterServiceByIdUseCase.execute(input);
    return mapDeleteMasterServiceHttpResponse();
  }
}
