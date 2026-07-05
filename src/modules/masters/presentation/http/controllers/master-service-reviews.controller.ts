import { Controller, Delete, Get, Patch, Post, UseGuards } from '@nestjs/common';
import { AuthenticatedUser } from '@modules/auth/presentation/decorators/authenticated-user.decorator';
import { JwtAuthGuard } from '@modules/auth/presentation/guards/jwt-auth.guard';
import { Authorize } from '@modules/authorization/presentation/decorators/authorize.decorator';
import { AuthorizeGuard } from '@modules/authorization/presentation/guards/authorize.guard';
import { CreateMasterServiceReviewUseCase } from '@modules/masters/application/use-cases/master-service-review/create-master-service-review.use-case';
import { DeleteMasterServiceReviewByIdUseCase } from '@modules/masters/application/use-cases/master-service-review/delete-master-service-review-by-id.use-case';
import { GetMasterServiceReviewByIdUseCase } from '@modules/masters/application/use-cases/master-service-review/get-master-service-review-by-id.use-case';
import { GetMasterServiceReviewsUseCase } from '@modules/masters/application/use-cases/master-service-review/get-master-service-reviews.use-case';
import { UpdateMasterServiceReviewByIdUseCase } from '@modules/masters/application/use-cases/master-service-review/update-master-service-review-by-id.use-case';
import { createMasterServiceReviewPayloadSchema } from '@modules/masters/presentation/http/validation/schemas/create-master-service-review-payload.schema';
import type { ICreateMasterServiceReviewPayload } from '@modules/masters/presentation/http/validation/schemas/create-master-service-review-payload.types';
import { getByIdQuerySchema } from '@modules/masters/presentation/http/validation/schemas/get-by-id-query.schema';
import type { IGetByIdQueryPayload } from '@modules/masters/presentation/http/validation/schemas/get-by-id-query.types';
import { getMasterServiceReviewsQuerySchema } from '@modules/masters/presentation/http/validation/schemas/get-master-service-reviews-query.schema';
import type { IGetMasterServiceReviewsQueryPayload } from '@modules/masters/presentation/http/validation/schemas/get-master-service-reviews-query.types';
import { idParamSchema } from '@modules/masters/presentation/http/validation/schemas/id-param.schema';
import type { IIdParamPayload } from '@modules/masters/presentation/http/validation/schemas/id-param.types';
import { updateMasterServiceReviewPayloadSchema } from '@modules/masters/presentation/http/validation/schemas/update-master-service-review-payload.schema';
import type { IUpdateMasterServiceReviewPayload } from '@modules/masters/presentation/http/validation/schemas/update-master-service-review-payload.types';
import type { IGetMetadata } from '@shared/domain/decorators/i-get-metadata';
import type { ISessionUser } from '@shared/domain/i-session-user';
import { GetMetadata } from '@shared/presentation/decorators/get-metadata';
import { PublicEndpoint } from '@shared/presentation/decorators/public-endpoint.decorator';
import { HttpBody, HttpParams, HttpQuery } from '@shared/presentation/http/decorators';
import { normalizeIdParam } from '@shared/presentation/http/helpers/normalize-id-param';
import { normalizeListQueryRaw } from '@shared/presentation/http/helpers/normalize-list-query-raw';
import { payloadToCreateMasterServiceReviewInput } from '../mappers/master-service-review/payload-to-create-master-service-review-input';
import { payloadToDeleteMasterServiceReviewInput } from '../mappers/master-service-review/payload-to-delete-master-service-review-input';
import { payloadToFindManyParams } from '../mappers/master-service-review/payload-to-find-many-params.mapper';
import { payloadToGetMasterServiceReviewByIdInput } from '../mappers/master-service-review/payload-to-get-master-service-review-by-id-input';
import { payloadToUpdateMasterServiceReviewInput } from '../mappers/master-service-review/payload-to-update-master-service-review-input';
import { mapCreateMasterServiceReviewHttpResponse } from '../response/map-create-master-service-review-response';
import { mapDeleteMasterServiceReviewHttpResponse } from '../response/map-delete-master-service-review-response';
import { mapGetMasterServiceReviewByIdHttpResponse } from '../response/map-get-master-service-review-by-id-response';
import { mapGetMasterServiceReviewsHttpResponse } from '../response/map-get-master-service-reviews-response';
import { mapUpdateMasterServiceReviewHttpResponse } from '../response/map-update-master-service-review-response';

@Controller({ path: 'master-service-reviews', version: '1' })
export class MasterServiceReviewsController {
  constructor(
    private readonly getMasterServiceReviewsUseCase: GetMasterServiceReviewsUseCase,
    private readonly getMasterServiceReviewByIdUseCase: GetMasterServiceReviewByIdUseCase,
    private readonly createMasterServiceReviewUseCase: CreateMasterServiceReviewUseCase,
    private readonly updateMasterServiceReviewByIdUseCase: UpdateMasterServiceReviewByIdUseCase,
    private readonly deleteMasterServiceReviewByIdUseCase: DeleteMasterServiceReviewByIdUseCase,
  ) {}

  @Get()
  @PublicEndpoint()
  async getMasterServiceReviews(
    @HttpQuery(getMasterServiceReviewsQuerySchema, {
      preprocess: normalizeListQueryRaw,
      errorMessage:
        'Некорректные параметры запроса списка отзывов на услуги мастера',
    })
    payload: IGetMasterServiceReviewsQueryPayload,
    @GetMetadata() metadata: IGetMetadata,
  ) {
    const params = payloadToFindManyParams(payload, metadata);
    const output = await this.getMasterServiceReviewsUseCase.execute(params);
    return mapGetMasterServiceReviewsHttpResponse(output, payload);
  }

  @Get(':id')
  @PublicEndpoint()
  async getMasterServiceReviewById(
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
    const input = payloadToGetMasterServiceReviewByIdInput(
      params.id,
      queryPayload,
      metadata.isStaffUser,
    );
    const item = await this.getMasterServiceReviewByIdUseCase.execute(input);
    return mapGetMasterServiceReviewByIdHttpResponse(item);
  }

  @Post()
  @UseGuards(JwtAuthGuard, AuthorizeGuard)
  @Authorize({ kind: 'authenticated' })
  async createMasterServiceReview(
    @HttpBody(createMasterServiceReviewPayloadSchema, {
      errorMessage: 'Некорректный payload создания отзыва на услугу мастера',
    })
    payload: ICreateMasterServiceReviewPayload,
    @AuthenticatedUser() user: ISessionUser,
    @GetMetadata() metadata: IGetMetadata,
  ) {
    const input = payloadToCreateMasterServiceReviewInput(
      payload,
      user,
      metadata.isStaffUser,
    );
    const output = await this.createMasterServiceReviewUseCase.execute(input);
    return mapCreateMasterServiceReviewHttpResponse(output);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, AuthorizeGuard)
  @Authorize({ kind: 'authenticated' })
  async updateMasterServiceReview(
    @HttpParams(idParamSchema, {
      preprocess: normalizeIdParam,
      errorMessage: 'Некорректный идентификатор',
    })
    params: IIdParamPayload,
    @HttpBody(updateMasterServiceReviewPayloadSchema, {
      errorMessage: 'Некорректный payload обновления отзыва на услугу мастера',
    })
    payload: IUpdateMasterServiceReviewPayload,
    @AuthenticatedUser() user: ISessionUser,
    @GetMetadata() metadata: IGetMetadata,
  ) {
    const input = payloadToUpdateMasterServiceReviewInput(
      params.id,
      payload,
      user,
      metadata.isStaffUser,
    );
    const output =
      await this.updateMasterServiceReviewByIdUseCase.execute(input);
    return mapUpdateMasterServiceReviewHttpResponse(output);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, AuthorizeGuard)
  @Authorize({ kind: 'authenticated' })
  async deleteMasterServiceReview(
    @HttpParams(idParamSchema, {
      preprocess: normalizeIdParam,
      errorMessage: 'Некорректный идентификатор',
    })
    params: IIdParamPayload,
    @AuthenticatedUser() user: ISessionUser,
    @GetMetadata() metadata: IGetMetadata,
  ) {
    const input = payloadToDeleteMasterServiceReviewInput(
      params.id,
      user,
      metadata.isStaffUser,
    );
    await this.deleteMasterServiceReviewByIdUseCase.execute(input);
    return mapDeleteMasterServiceReviewHttpResponse();
  }
}
