import { Controller, Delete, Get, Post, UseGuards } from '@nestjs/common';
import { AuthenticatedUser } from '@modules/auth/presentation/decorators/authenticated-user.decorator';
import { JwtAuthGuard } from '@modules/auth/presentation/guards/jwt-auth.guard';
import { Authorize } from '@modules/authorization/presentation/decorators/authorize.decorator';
import { AuthorizeGuard } from '@modules/authorization/presentation/guards/authorize.guard';
import { CreateFavoriteMasterServiceUseCase } from '@modules/masters/application/use-cases/favorite-master-service/create-favorite-master-service.use-case';
import { DeleteFavoriteMasterServiceByIdUseCase } from '@modules/masters/application/use-cases/favorite-master-service/delete-favorite-master-service-by-id.use-case';
import { GetFavoriteMasterServiceByIdUseCase } from '@modules/masters/application/use-cases/favorite-master-service/get-favorite-master-service-by-id.use-case';
import { GetFavoriteMasterServicesUseCase } from '@modules/masters/application/use-cases/favorite-master-service/get-favorite-master-services.use-case';
import { createFavoriteMasterServicePayloadSchema } from '@modules/masters/presentation/http/validation/schemas/create-favorite-master-service-payload.schema';
import type { ICreateFavoriteMasterServicePayload } from '@modules/masters/presentation/http/validation/schemas/create-favorite-master-service-payload.types';
import { getByIdQuerySchema } from '@modules/masters/presentation/http/validation/schemas/get-by-id-query.schema';
import type { IGetByIdQueryPayload } from '@modules/masters/presentation/http/validation/schemas/get-by-id-query.types';
import { getFavoriteMasterServicesQuerySchema } from '@modules/masters/presentation/http/validation/schemas/get-favorite-master-services-query.schema';
import type { IGetFavoriteMasterServicesQueryPayload } from '@modules/masters/presentation/http/validation/schemas/get-favorite-master-services-query.types';
import { idParamSchema } from '@modules/masters/presentation/http/validation/schemas/id-param.schema';
import type { IIdParamPayload } from '@modules/masters/presentation/http/validation/schemas/id-param.types';
import type { IGetMetadata } from '@shared/domain/decorators/i-get-metadata';
import type { ISessionUser } from '@shared/domain/i-session-user';
import { GetMetadata } from '@shared/presentation/decorators/get-metadata';
import { PublicEndpoint } from '@shared/presentation/decorators/public-endpoint.decorator';
import { HttpBody, HttpParams, HttpQuery } from '@shared/presentation/http/decorators';
import { normalizeIdParam } from '@shared/presentation/http/helpers/normalize-id-param';
import { normalizeListQueryRaw } from '@shared/presentation/http/helpers/normalize-list-query-raw';
import { payloadToCreateFavoriteMasterServiceInput } from '../mappers/favorite-master-service/payload-to-create-favorite-master-service-input';
import { payloadToDeleteFavoriteMasterServiceInput } from '../mappers/favorite-master-service/payload-to-delete-favorite-master-service-input';
import { payloadToFindManyParams } from '../mappers/favorite-master-service/payload-to-find-many-params.mapper';
import { payloadToGetFavoriteMasterServiceByIdInput } from '../mappers/favorite-master-service/payload-to-get-favorite-master-service-by-id-input';
import { mapCreateFavoriteMasterServiceHttpResponse } from '../response/map-create-favorite-master-service-response';
import { mapDeleteFavoriteMasterServiceHttpResponse } from '../response/map-delete-favorite-master-service-response';
import { mapGetFavoriteMasterServiceByIdHttpResponse } from '../response/map-get-favorite-master-service-by-id-response';
import { mapGetFavoriteMasterServicesHttpResponse } from '../response/map-get-favorite-master-services-response';

@Controller({ path: 'favorite-master-services', version: '1' })
export class FavoriteMasterServicesController {
  constructor(
    private readonly getFavoriteMasterServicesUseCase: GetFavoriteMasterServicesUseCase,
    private readonly getFavoriteMasterServiceByIdUseCase: GetFavoriteMasterServiceByIdUseCase,
    private readonly createFavoriteMasterServiceUseCase: CreateFavoriteMasterServiceUseCase,
    private readonly deleteFavoriteMasterServiceByIdUseCase: DeleteFavoriteMasterServiceByIdUseCase,
  ) {}

  @Get()
  @PublicEndpoint()
  async getFavoriteMasterServices(
    @HttpQuery(getFavoriteMasterServicesQuerySchema, {
      preprocess: normalizeListQueryRaw,
      errorMessage:
        'Некорректные параметры запроса списка избранных услуг мастера',
    })
    payload: IGetFavoriteMasterServicesQueryPayload,
    @GetMetadata() metadata: IGetMetadata,
  ) {
    const params = payloadToFindManyParams(payload, metadata);
    const output = await this.getFavoriteMasterServicesUseCase.execute(params);
    return mapGetFavoriteMasterServicesHttpResponse(output, payload);
  }

  @Get(':id')
  @PublicEndpoint()
  async getFavoriteMasterServiceById(
    @HttpParams(idParamSchema, {
      preprocess: normalizeIdParam,
      errorMessage: 'Некорректный идентификатор',
    })
    params: IIdParamPayload,
    @HttpQuery(getByIdQuerySchema, {
      errorMessage: 'Некорректные параметры запроса',
    })
    queryPayload: IGetByIdQueryPayload,
    @GetMetadata() metadata: IGetMetadata,
  ) {
    const input = payloadToGetFavoriteMasterServiceByIdInput(
      params.id,
      queryPayload,
      metadata.isStaffUser,
    );
    const item = await this.getFavoriteMasterServiceByIdUseCase.execute(input);
    return mapGetFavoriteMasterServiceByIdHttpResponse(item);
  }

  @Post()
  @UseGuards(JwtAuthGuard, AuthorizeGuard)
  @Authorize({ kind: 'authenticated' })
  async createFavoriteMasterService(
    @HttpBody(createFavoriteMasterServicePayloadSchema, {
      errorMessage: 'Некорректный payload добавления услуги в избранное',
    })
    payload: ICreateFavoriteMasterServicePayload,
    @AuthenticatedUser() user: ISessionUser,
    @GetMetadata() metadata: IGetMetadata,
  ) {
    const input = payloadToCreateFavoriteMasterServiceInput(
      payload,
      user,
      metadata.isStaffUser,
    );
    const output = await this.createFavoriteMasterServiceUseCase.execute(input);
    return mapCreateFavoriteMasterServiceHttpResponse(output);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, AuthorizeGuard)
  @Authorize({ kind: 'authenticated' })
  async deleteFavoriteMasterService(
    @HttpParams(idParamSchema, {
      preprocess: normalizeIdParam,
      errorMessage: 'Некорректный идентификатор',
    })
    params: IIdParamPayload,
    @AuthenticatedUser() user: ISessionUser,
    @GetMetadata() metadata: IGetMetadata,
  ) {
    const input = payloadToDeleteFavoriteMasterServiceInput(
      params.id,
      user,
      metadata.isStaffUser,
    );
    await this.deleteFavoriteMasterServiceByIdUseCase.execute(input);
    return mapDeleteFavoriteMasterServiceHttpResponse();
  }
}
