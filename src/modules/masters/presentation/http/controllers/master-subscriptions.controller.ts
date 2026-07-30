import { AuthenticatedUser } from '@modules/auth/presentation/decorators/authenticated-user.decorator';
import { JwtAuthGuard } from '@modules/auth/presentation/guards/jwt-auth.guard';
import { Authorize } from '@modules/authorization/presentation/decorators/authorize.decorator';
import { AuthorizeGuard } from '@modules/authorization/presentation/guards/authorize.guard';
import { CreateMasterSubscriptionUseCase } from '@modules/masters/application/use-cases/master-subscription/create-master-subscription.use-case';
import { DeleteMasterSubscriptionByIdUseCase } from '@modules/masters/application/use-cases/master-subscription/delete-master-subscription-by-id.use-case';
import { GetMasterSubscriptionByIdUseCase } from '@modules/masters/application/use-cases/master-subscription/get-master-subscription-by-id.use-case';
import { GetMasterSubscriptionsUseCase } from '@modules/masters/application/use-cases/master-subscription/get-master-subscriptions.use-case';
import { createMasterSubscriptionPayloadSchema } from '@modules/masters/presentation/http/validation/schemas/create-master-subscription-payload.schema';
import type { ICreateMasterSubscriptionPayload } from '@modules/masters/presentation/http/validation/schemas/create-master-subscription-payload.types';
import { getByIdQuerySchema } from '@modules/masters/presentation/http/validation/schemas/get-by-id-query.schema';
import type { IGetByIdQueryPayload } from '@modules/masters/presentation/http/validation/schemas/get-by-id-query.types';
import { getMasterSubscriptionsQuerySchema } from '@modules/masters/presentation/http/validation/schemas/get-master-subscriptions-query.schema';
import type { IGetMasterSubscriptionsQueryPayload } from '@modules/masters/presentation/http/validation/schemas/get-master-subscriptions-query.types';
import { idParamSchema } from '@modules/masters/presentation/http/validation/schemas/id-param.schema';
import type { IIdParamPayload } from '@modules/masters/presentation/http/validation/schemas/id-param.types';
import { Controller, Delete, Get, Post, UseGuards } from '@nestjs/common';
import type { IGetMetadata } from '@shared/domain/decorators/i-get-metadata';
import type { ISessionUser } from '@shared/domain/i-session-user';
import { GetMetadata } from '@shared/presentation/decorators/get-metadata';
import { PublicEndpoint } from '@shared/presentation/decorators/public-endpoint.decorator';
import {
  HttpBody,
  HttpParams,
  HttpQuery,
} from '@shared/presentation/http/decorators';
import { normalizeIdParam } from '@shared/presentation/http/helpers/normalize-id-param';
import { normalizeListQueryRaw } from '@shared/presentation/http/helpers/normalize-list-query-raw';
import { requestBodyToCreateMasterSubscriptionUseCaseInput } from '../request-mappers/master-subscription/request-body-to-create-master-subscription-use-case-input';
import { requestParamsToDeleteMasterSubscriptionUseCaseInput } from '../request-mappers/master-subscription/request-params-to-delete-master-subscription-use-case-input';
import { requestQueryParamsToFindManyParams } from '../request-mappers/master-subscription/request-query-params-to-find-many-params.mapper';
import { requestQueryParamsToGetMasterSubscriptionByIdUseCaseInput } from '../request-mappers/master-subscription/request-query-params-to-get-master-subscription-by-id-use-case-input';
import { mapCreateMasterSubscriptionHttpResponse } from '../http-responses/map-create-master-subscription-response';
import { mapDeleteMasterSubscriptionHttpResponse } from '../http-responses/map-delete-master-subscription-response';
import { mapGetMasterSubscriptionByIdHttpResponse } from '../http-responses/map-get-master-subscription-by-id-response';
import { mapGetMasterSubscriptionsHttpResponse } from '../http-responses/map-get-master-subscriptions-response';

@Controller({ path: 'master-subscriptions', version: '1' })
export class MasterSubscriptionsController {
  constructor(
    private readonly getMasterSubscriptionsUseCase: GetMasterSubscriptionsUseCase,
    private readonly getMasterSubscriptionByIdUseCase: GetMasterSubscriptionByIdUseCase,
    private readonly createMasterSubscriptionUseCase: CreateMasterSubscriptionUseCase,
    private readonly deleteMasterSubscriptionByIdUseCase: DeleteMasterSubscriptionByIdUseCase,
  ) {}

  @Get()
  @PublicEndpoint()
  async getMasterSubscriptions(
    @HttpQuery(getMasterSubscriptionsQuerySchema, {
      preprocess: normalizeListQueryRaw,
      errorMessage:
        'Некорректные параметры запроса списка подписок на мастеров',
    })
    queryParams: IGetMasterSubscriptionsQueryPayload,
    @GetMetadata() metadata: IGetMetadata,
  ) {
    const params = requestQueryParamsToFindManyParams(queryParams, metadata);
    const output = await this.getMasterSubscriptionsUseCase.execute(params);
    return mapGetMasterSubscriptionsHttpResponse(output, queryParams);
  }

  @Get(':id')
  @PublicEndpoint()
  async getMasterSubscriptionById(
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
    const input = requestQueryParamsToGetMasterSubscriptionByIdUseCaseInput(
      params.id,
      queryPayload,
      metadata.isStaffUser,
    );
    const item = await this.getMasterSubscriptionByIdUseCase.execute(input);
    return mapGetMasterSubscriptionByIdHttpResponse(item);
  }

  @Post()
  @UseGuards(JwtAuthGuard, AuthorizeGuard)
  @Authorize({ kind: 'authenticated' })
  async createMasterSubscription(
    @HttpBody(createMasterSubscriptionPayloadSchema, {
      errorMessage: 'Некорректный payload создания подписки на мастера',
    })
    payload: ICreateMasterSubscriptionPayload,
    @AuthenticatedUser() user: ISessionUser,
    @GetMetadata() metadata: IGetMetadata,
  ) {
    const input = requestBodyToCreateMasterSubscriptionUseCaseInput(
      payload,
      user,
      metadata.isStaffUser,
    );
    const output = await this.createMasterSubscriptionUseCase.execute(input);
    return mapCreateMasterSubscriptionHttpResponse(output);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, AuthorizeGuard)
  @Authorize({ kind: 'authenticated' })
  async deleteMasterSubscription(
    @HttpParams(idParamSchema, {
      preprocess: normalizeIdParam,
      errorMessage: 'Некорректный идентификатор',
    })
    params: IIdParamPayload,
    @AuthenticatedUser() user: ISessionUser,
    @GetMetadata() metadata: IGetMetadata,
  ) {
    const input = requestParamsToDeleteMasterSubscriptionUseCaseInput(
      params.id,
      user,
      metadata.isStaffUser,
    );
    await this.deleteMasterSubscriptionByIdUseCase.execute(input);
    return mapDeleteMasterSubscriptionHttpResponse();
  }
}
