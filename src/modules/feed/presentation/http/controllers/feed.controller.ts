import { AuthenticatedUser } from '@modules/auth/presentation/decorators/authenticated-user.decorator';
import { JwtAuthGuard } from '@modules/auth/presentation/guards/jwt-auth.guard';
import { Authorize } from '@modules/authorization/presentation/decorators/authorize.decorator';
import { AuthorizeGuard } from '@modules/authorization/presentation/guards/authorize.guard';
import { Controller, Get, Post, UseGuards } from '@nestjs/common';
import type { ISessionUser } from '@shared/domain/i-session-user';
import { HttpBody, HttpQuery } from '@shared/presentation/http/decorators';
import { normalizeListQueryRaw } from '@shared/presentation/http/helpers/normalize-list-query-raw';
import { GetFeedServicesUseCase } from 'src/modules/feed/application/use-cases/get-feed-services.use-case';
import { RecordFeedEventsUseCase } from 'src/modules/feed/application/use-cases/record-feed-events.use-case';
import { mapGetFeedServicesHttpResponse } from '../http-responses/map-get-feed-services-response';
import { mapRecordFeedEventsHttpResponse } from '../http-responses/map-record-feed-events-response';
import { requestBodyToRecordFeedEventsInput } from '../request-mappers/request-body-to-record-feed-events-input';
import { requestQueryToGetFeedServicesInput } from '../request-mappers/request-query-to-get-feed-services-input';
import { getFeedServicesQuerySchema } from '../validation/schemas/get-feed-services-query.schema';
import type { IGetFeedServicesQueryPayload } from '../validation/schemas/get-feed-services-query.types';
import { recordFeedEventsPayloadSchema } from '../validation/schemas/record-feed-events-payload.schema';
import type { IRecordFeedEventsPayload } from '../validation/schemas/record-feed-events-payload.types';

@Controller({ path: 'feed', version: '1' })
export class FeedController {
  constructor(
    private readonly recordFeedEventsUseCase: RecordFeedEventsUseCase,
    private readonly getFeedServicesUseCase: GetFeedServicesUseCase,
  ) {}

  @Post('events')
  @UseGuards(JwtAuthGuard, AuthorizeGuard)
  @Authorize({ kind: 'authenticated' })
  async recordEvents(
    @HttpBody(recordFeedEventsPayloadSchema, {
      errorMessage: 'Некорректный payload событий ленты',
    })
    payload: IRecordFeedEventsPayload,
    @AuthenticatedUser() user: ISessionUser,
  ) {
    const input = requestBodyToRecordFeedEventsInput(payload, user.id);
    const output = await this.recordFeedEventsUseCase.execute(input);
    return mapRecordFeedEventsHttpResponse(output);
  }

  @Get('services')
  @UseGuards(JwtAuthGuard, AuthorizeGuard)
  @Authorize({ kind: 'authenticated' })
  async getServices(
    @HttpQuery(getFeedServicesQuerySchema, {
      preprocess: normalizeListQueryRaw,
      errorMessage: 'Некорректные параметры запроса ленты услуг',
    })
    query: IGetFeedServicesQueryPayload,
    @AuthenticatedUser() user: ISessionUser,
  ) {
    const input = requestQueryToGetFeedServicesInput(query, user.id);
    const output = await this.getFeedServicesUseCase.execute(input);
    return mapGetFeedServicesHttpResponse(output, input.page, input.limit);
  }
}
