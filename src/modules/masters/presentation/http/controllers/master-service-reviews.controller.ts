import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthenticatedUser } from 'src/modules/auth/presentation/decorators/authenticated-user.decorator';
import { JwtAuthGuard } from 'src/modules/auth/presentation/guards/jwt-auth.guard';
import { CreateMasterServiceReviewUseCase } from 'src/modules/masters/application/use-cases/master-service-review/create-master-service-review.use-case';
import { DeleteMasterServiceReviewByIdUseCase } from 'src/modules/masters/application/use-cases/master-service-review/delete-master-service-review-by-id.use-case';
import { GetMasterServiceReviewByIdUseCase } from 'src/modules/masters/application/use-cases/master-service-review/get-master-service-review-by-id.use-case';
import { GetMasterServiceReviewsUseCase } from 'src/modules/masters/application/use-cases/master-service-review/get-master-service-reviews.use-case';
import { UpdateMasterServiceReviewByIdUseCase } from 'src/modules/masters/application/use-cases/master-service-review/update-master-service-review-by-id.use-case';
import type { IGetMetadata } from 'src/modules/shared/domain/decorators/i-get-metadata';
import type { IRawQuery } from 'src/modules/shared/domain/i-query.dto';
import type { ISessionUser } from 'src/modules/shared/domain/i-session-user';
import { GetMetadata } from 'src/modules/shared/presentation/decorators/get-metadata';
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
import { MasterServiceReviewValidator } from '../validation/master-service-review.validator';

@Controller({ path: 'master-service-reviews', version: '1' })
export class MasterServiceReviewsController {
  constructor(
    private readonly getMasterServiceReviewsUseCase: GetMasterServiceReviewsUseCase,
    private readonly getMasterServiceReviewByIdUseCase: GetMasterServiceReviewByIdUseCase,
    private readonly createMasterServiceReviewUseCase: CreateMasterServiceReviewUseCase,
    private readonly updateMasterServiceReviewByIdUseCase: UpdateMasterServiceReviewByIdUseCase,
    private readonly deleteMasterServiceReviewByIdUseCase: DeleteMasterServiceReviewByIdUseCase,
    private readonly masterServiceReviewValidator: MasterServiceReviewValidator,
  ) {}

  @Get()
  async getMasterServiceReviews(
    @Query() query: IRawQuery,
    @GetMetadata() metadata: IGetMetadata,
  ) {
    const payload =
      this.masterServiceReviewValidator.validateGetMasterServiceReviewsQuery(
        query,
      );
    const params = payloadToFindManyParams(payload, metadata);
    const output = await this.getMasterServiceReviewsUseCase.execute(params);
    return mapGetMasterServiceReviewsHttpResponse(output, payload);
  }

  @Get(':id')
  async getMasterServiceReviewById(
    @Param() params: Record<string, unknown>,
    @Query() query: IRawQuery,
    @GetMetadata() metadata: IGetMetadata,
  ) {
    const { id } = this.masterServiceReviewValidator.validateIdParam(params);
    const queryPayload =
      this.masterServiceReviewValidator.validateGetByIdQuery(query);
    const input = payloadToGetMasterServiceReviewByIdInput(
      id,
      queryPayload,
      metadata.isStaffUser,
    );
    const item = await this.getMasterServiceReviewByIdUseCase.execute(input);
    return mapGetMasterServiceReviewByIdHttpResponse(item);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async createMasterServiceReview(
    @Body() body: Record<string, unknown>,
    @AuthenticatedUser() user: ISessionUser,
    @GetMetadata() metadata: IGetMetadata,
  ) {
    const payload =
      this.masterServiceReviewValidator.validateCreatePayload(body);
    const input = payloadToCreateMasterServiceReviewInput(
      payload,
      user,
      metadata.isStaffUser,
    );
    const output = await this.createMasterServiceReviewUseCase.execute(input);
    return mapCreateMasterServiceReviewHttpResponse(output);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async updateMasterServiceReview(
    @Param() params: Record<string, unknown>,
    @Body() body: Record<string, unknown>,
    @AuthenticatedUser() user: ISessionUser,
    @GetMetadata() metadata: IGetMetadata,
  ) {
    const { id } = this.masterServiceReviewValidator.validateIdParam(params);
    const payload =
      this.masterServiceReviewValidator.validateUpdatePayload(body);
    const input = payloadToUpdateMasterServiceReviewInput(
      id,
      payload,
      user,
      metadata.isStaffUser,
    );
    const output =
      await this.updateMasterServiceReviewByIdUseCase.execute(input);
    return mapUpdateMasterServiceReviewHttpResponse(output);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async deleteMasterServiceReview(
    @Param() params: Record<string, unknown>,
    @AuthenticatedUser() user: ISessionUser,
    @GetMetadata() metadata: IGetMetadata,
  ) {
    const { id } = this.masterServiceReviewValidator.validateIdParam(params);
    const input = payloadToDeleteMasterServiceReviewInput(
      id,
      user,
      metadata.isStaffUser,
    );
    await this.deleteMasterServiceReviewByIdUseCase.execute(input);
    return mapDeleteMasterServiceReviewHttpResponse();
  }
}
