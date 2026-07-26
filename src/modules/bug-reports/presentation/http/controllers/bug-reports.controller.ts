import { Controller, Post, UseGuards } from '@nestjs/common';
import { CurrentUser } from '@modules/auth/presentation/decorators/current-user.decorator';
import { OptionalJwtAuthGuard } from '@modules/auth/presentation/guards/optional-jwt-auth.guard';
import { CreateBugReportUseCase } from '@modules/bug-reports/application/use-cases/bug-report/create-bug-report.use-case';
import { PresignBugReportImagesUseCase } from '@modules/bug-reports/application/use-cases/bug-report/presign-bug-report-images.use-case';
import type { ISessionUser } from '@shared/domain/i-session-user';
import { PublicEndpoint } from '@shared/presentation/decorators/public-endpoint.decorator';
import { HttpBody, HttpParams } from '@shared/presentation/http/decorators';
import { normalizeIdParam } from '@shared/presentation/http/helpers/normalize-id-param';
import { payloadToCreateBugReportInput } from '../mappers/bug-report/payload-to-create-bug-report-input';
import { payloadToPresignBugReportImagesInput } from '../mappers/bug-report/payload-to-presign-bug-report-images-input';
import { mapCreateBugReportHttpResponse } from '../response/map-create-bug-report-response';
import { mapPresignBugReportImagesHttpResponse } from '../response/map-presign-bug-report-images-response';
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
  @UseGuards(OptionalJwtAuthGuard)
  async createBugReport(
    @HttpBody(createBugReportPayloadSchema, {
      errorMessage: 'Некорректный payload создания баг-репорта',
    })
    payload: ICreateBugReportPayload,
    @CurrentUser() user: ISessionUser | null,
  ) {
    const input = payloadToCreateBugReportInput(payload, user);
    const output = await this.createBugReportUseCase.execute(input);
    return mapCreateBugReportHttpResponse(output);
  }

  @Post(':id/images/presign')
  @PublicEndpoint()
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
    const input = payloadToPresignBugReportImagesInput(params.id, payload);
    const output = await this.presignBugReportImagesUseCase.execute(input);
    return mapPresignBugReportImagesHttpResponse(output);
  }
}
