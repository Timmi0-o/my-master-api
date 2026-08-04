import { CurrentUser } from '@modules/auth/presentation/decorators/current-user.decorator';
import { OptionalJwtAuthGuard } from '@modules/auth/presentation/guards/optional-jwt-auth.guard';
import { CreateBugReportUseCase } from '@modules/bug-reports/application/use-cases/bug-report/create-bug-report.use-case';
import { PresignBugReportImagesUseCase } from '@modules/bug-reports/application/use-cases/bug-report/presign-bug-report-images.use-case';
import { Controller, Post, UseGuards } from '@nestjs/common';
import type { ISessionUser } from '@shared/domain/i-session-user';
import { BugReportRateLimit } from '@shared/infrastructure/throttler/http-rate-limit.decorators';
import { PublicEndpoint } from '@shared/presentation/decorators/public-endpoint.decorator';
import { HttpBody, HttpParams } from '@shared/presentation/http/decorators';
import { normalizeIdParam } from '@shared/presentation/http/helpers/normalize-id-param';
import { mapCreateBugReportHttpResponse } from '../http-responses/map-create-bug-report-response';
import { mapPresignBugReportImagesHttpResponse } from '../http-responses/map-presign-bug-report-images-response';
import { requestBodyToCreateBugReportUseCaseInput } from '../request-mappers/bug-report/request-body-to-create-bug-report-use-case-input';
import { requestBodyToPresignBugReportImagesUseCaseInput } from '../request-mappers/bug-report/request-body-to-presign-bug-report-images-use-case-input';
import { createBugReportPayloadSchema } from '../validation/schemas/create-bug-report-payload.schema';
import type { ICreateBugReportPayload } from '../validation/schemas/create-bug-report-payload.types';
import { idParamSchema } from '../validation/schemas/id-param.schema';
import type { IIdParamPayload } from '../validation/schemas/id-param.types';
import { presignBugReportImagesPayloadSchema } from '../validation/schemas/presign-bug-report-images-payload.schema';
import type { IPresignBugReportImagesPayload } from '../validation/schemas/presign-bug-report-images-payload.types';

@Controller({ path: 'bug-reports', version: '1' })
export class BugReportsController {
  constructor(
    private readonly createBugReportUseCase: CreateBugReportUseCase,
    private readonly presignBugReportImagesUseCase: PresignBugReportImagesUseCase,
  ) {}

  @Post()
  @PublicEndpoint()
  @BugReportRateLimit()
  @UseGuards(OptionalJwtAuthGuard)
  async createBugReport(
    @HttpBody(createBugReportPayloadSchema, {
      errorMessage: 'Некорректный payload создания баг-репорта',
    })
    payload: ICreateBugReportPayload,
    @CurrentUser() user: ISessionUser | null,
  ) {
    const input = requestBodyToCreateBugReportUseCaseInput(payload, user);
    const output = await this.createBugReportUseCase.execute(input);
    return mapCreateBugReportHttpResponse(output);
  }

  @Post(':id/images/presign')
  @PublicEndpoint()
  @BugReportRateLimit()
  async presignBugReportImages(
    @HttpParams(idParamSchema, {
      preprocess: normalizeIdParam,
      errorMessage: 'Некорректный идентификатор',
    })
    params: IIdParamPayload,
    @HttpBody(presignBugReportImagesPayloadSchema, {
      errorMessage: 'Некорректный payload presign фотографий баг-репорта',
    })
    payload: IPresignBugReportImagesPayload,
  ) {
    const input = requestBodyToPresignBugReportImagesUseCaseInput(
      params.id,
      payload,
    );
    const output = await this.presignBugReportImagesUseCase.execute(input);
    return mapPresignBugReportImagesHttpResponse(output);
  }
}
