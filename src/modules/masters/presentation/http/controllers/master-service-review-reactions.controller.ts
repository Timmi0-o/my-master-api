import { Controller, Delete, Get, Post, UseGuards } from '@nestjs/common';
import { AuthenticatedUser } from '@modules/auth/presentation/decorators/authenticated-user.decorator';
import { JwtAuthGuard } from '@modules/auth/presentation/guards/jwt-auth.guard';
import { Authorize } from '@modules/authorization/presentation/decorators/authorize.decorator';
import { AuthorizeGuard } from '@modules/authorization/presentation/guards/authorize.guard';
import { DeleteMasterServiceReviewReactionByIdUseCase } from '@modules/masters/application/use-cases/master-service-review-reaction/delete-master-service-review-reaction-by-id.use-case';
import { GetMasterServiceReviewReactionsUseCase } from '@modules/masters/application/use-cases/master-service-review-reaction/get-master-service-review-reactions.use-case';
import { UpsertMasterServiceReviewReactionUseCase } from '@modules/masters/application/use-cases/master-service-review-reaction/upsert-master-service-review-reaction.use-case';
import { createMasterServiceReviewReactionPayloadSchema } from '@modules/masters/presentation/http/validation/schemas/create-master-service-review-reaction-payload.schema';
import type { ICreateMasterServiceReviewReactionPayload } from '@modules/masters/presentation/http/validation/schemas/create-master-service-review-reaction-payload.types';
import { getMasterServiceReviewReactionsQuerySchema } from '@modules/masters/presentation/http/validation/schemas/get-master-service-review-reactions-query.schema';
import type { IGetMasterServiceReviewReactionsQueryPayload } from '@modules/masters/presentation/http/validation/schemas/get-master-service-review-reactions-query.types';
import { idParamSchema } from '@modules/masters/presentation/http/validation/schemas/id-param.schema';
import type { IIdParamPayload } from '@modules/masters/presentation/http/validation/schemas/id-param.types';
import type { IGetMetadata } from '@shared/domain/decorators/i-get-metadata';
import type { ISessionUser } from '@shared/domain/i-session-user';
import { GetMetadata } from '@shared/presentation/decorators/get-metadata';
import { PublicEndpoint } from '@shared/presentation/decorators/public-endpoint.decorator';
import { HttpBody, HttpParams, HttpQuery } from '@shared/presentation/http/decorators';
import { normalizeIdParam } from '@shared/presentation/http/helpers/normalize-id-param';
import { normalizeListQueryRaw } from '@shared/presentation/http/helpers/normalize-list-query-raw';
import { payloadToDeleteMasterServiceReviewReactionInput } from '../mappers/master-service-review-reaction/payload-to-delete-master-service-review-reaction-input';
import { payloadToFindManyParams } from '../mappers/master-service-review-reaction/payload-to-find-many-params.mapper';
import { payloadToUpsertMasterServiceReviewReactionInput } from '../mappers/master-service-review-reaction/payload-to-upsert-master-service-review-reaction-input';
import { mapDeleteMasterServiceReviewReactionHttpResponse } from '../response/map-delete-master-service-review-reaction-response';
import { mapGetMasterServiceReviewReactionsHttpResponse } from '../response/map-get-master-service-review-reactions-response';
import { mapUpsertMasterServiceReviewReactionHttpResponse } from '../response/map-upsert-master-service-review-reaction-response';

@Controller({ path: 'master-service-review-reactions', version: '1' })
export class MasterServiceReviewReactionsController {
  constructor(
    private readonly getMasterServiceReviewReactionsUseCase: GetMasterServiceReviewReactionsUseCase,
    private readonly upsertMasterServiceReviewReactionUseCase: UpsertMasterServiceReviewReactionUseCase,
    private readonly deleteMasterServiceReviewReactionByIdUseCase: DeleteMasterServiceReviewReactionByIdUseCase,
  ) {}

  @Get()
  @PublicEndpoint()
  async getMasterServiceReviewReactions(
    @HttpQuery(getMasterServiceReviewReactionsQuerySchema, {
      preprocess: normalizeListQueryRaw,
      errorMessage:
        'Некорректные параметры запроса списка реакций на отзывы',
    })
    payload: IGetMasterServiceReviewReactionsQueryPayload,
    @GetMetadata() metadata: IGetMetadata,
  ) {
    const params = payloadToFindManyParams(payload, metadata);
    const output =
      await this.getMasterServiceReviewReactionsUseCase.execute(params);
    return mapGetMasterServiceReviewReactionsHttpResponse(output, payload);
  }

  @Post()
  @UseGuards(JwtAuthGuard, AuthorizeGuard)
  @Authorize({ kind: 'authenticated' })
  async upsertMasterServiceReviewReaction(
    @HttpBody(createMasterServiceReviewReactionPayloadSchema, {
      errorMessage: 'Некорректный payload реакции на отзыв',
    })
    payload: ICreateMasterServiceReviewReactionPayload,
    @AuthenticatedUser() user: ISessionUser,
    @GetMetadata() metadata: IGetMetadata,
  ) {
    const input = payloadToUpsertMasterServiceReviewReactionInput(
      payload,
      user,
      metadata.isStaffUser,
    );
    const output =
      await this.upsertMasterServiceReviewReactionUseCase.execute(input);
    return mapUpsertMasterServiceReviewReactionHttpResponse(output);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, AuthorizeGuard)
  @Authorize({ kind: 'authenticated' })
  async deleteMasterServiceReviewReaction(
    @HttpParams(idParamSchema, {
      preprocess: normalizeIdParam,
      errorMessage: 'Некорректный идентификатор',
    })
    params: IIdParamPayload,
    @AuthenticatedUser() user: ISessionUser,
    @GetMetadata() metadata: IGetMetadata,
  ) {
    const input = payloadToDeleteMasterServiceReviewReactionInput(
      params.id,
      user,
      metadata.isStaffUser,
    );
    await this.deleteMasterServiceReviewReactionByIdUseCase.execute(input);
    return mapDeleteMasterServiceReviewReactionHttpResponse();
  }
}
