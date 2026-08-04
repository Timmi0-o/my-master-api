import { AuthenticatedUser } from '@modules/auth/presentation/decorators/authenticated-user.decorator';
import { JwtAuthGuard } from '@modules/auth/presentation/guards/jwt-auth.guard';
import { Authorize } from '@modules/authorization/presentation/decorators/authorize.decorator';
import { AuthorizeGuard } from '@modules/authorization/presentation/guards/authorize.guard';
import { ArchiveNotificationByIdUseCase } from '@modules/notifications/application/use-cases/notification/archive-notification-by-id.use-case';
import { DeleteNotificationByIdUseCase } from '@modules/notifications/application/use-cases/notification/delete-notification-by-id.use-case';
import { GetNotificationByIdUseCase } from '@modules/notifications/application/use-cases/notification/get-notification-by-id.use-case';
import { GetNotificationsUseCase } from '@modules/notifications/application/use-cases/notification/get-notifications.use-case';
import { GetUnreadNotificationsCountUseCase } from '@modules/notifications/application/use-cases/notification/get-unread-notifications-count.use-case';
import { MarkAllNotificationsReadUseCase } from '@modules/notifications/application/use-cases/notification/mark-all-notifications-read.use-case';
import { MarkNotificationReadByIdUseCase } from '@modules/notifications/application/use-cases/notification/mark-notification-read-by-id.use-case';
import { NotificationSseEventBus } from '@modules/notifications/infrastructure/sse/notification-sse.event-bus';
import {
  Controller,
  Delete,
  Get,
  MessageEvent,
  Post,
  Sse,
  UseGuards,
} from '@nestjs/common';
import type { IGetMetadata } from '@shared/domain/decorators/i-get-metadata';
import type { ISessionUser } from '@shared/domain/i-session-user';
import { RateLimiter } from '@shared/infrastructure/throttler/http-rate-limit.decorators';
import { GetMetadata } from '@shared/presentation/decorators/get-metadata';
import { SkipResponseWrap } from '@shared/presentation/decorators/skip-response-wrap.decorator';
import { HttpParams, HttpQuery } from '@shared/presentation/http/decorators';
import { normalizeIdParam } from '@shared/presentation/http/helpers/normalize-id-param';
import { normalizeListQueryRaw } from '@shared/presentation/http/helpers/normalize-list-query-raw';
import { Observable, filter, interval, map, merge } from 'rxjs';
import { mapArchiveNotificationHttpResponse } from '../http-responses/map-archive-notification-response';
import { mapDeleteNotificationHttpResponse } from '../http-responses/map-delete-notification-response';
import { mapGetNotificationByIdHttpResponse } from '../http-responses/map-get-notification-by-id-response';
import { mapGetNotificationsHttpResponse } from '../http-responses/map-get-notifications-response';
import { mapGetUnreadNotificationsCountHttpResponse } from '../http-responses/map-get-unread-notifications-count-response';
import { mapMarkAllNotificationsReadHttpResponse } from '../http-responses/map-mark-all-notifications-read-response';
import { mapMarkNotificationReadHttpResponse } from '../http-responses/map-mark-notification-read-response';
import { requestParamsToArchiveNotificationUseCaseInput } from '../request-mappers/notification/request-params-to-archive-notification-use-case-input';
import { requestParamsToDeleteNotificationUseCaseInput } from '../request-mappers/notification/request-params-to-delete-notification-use-case-input';
import { requestParamsToGetUnreadNotificationsCountUseCaseInput } from '../request-mappers/notification/request-params-to-get-unread-notifications-count-use-case-input';
import { requestParamsToMarkAllNotificationsReadUseCaseInput } from '../request-mappers/notification/request-params-to-mark-all-notifications-read-use-case-input';
import { requestParamsToMarkNotificationReadUseCaseInput } from '../request-mappers/notification/request-params-to-mark-notification-read-use-case-input';
import { requestQueryParamsToFindManyParams } from '../request-mappers/notification/request-query-params-to-find-many-params.mapper';
import { requestQueryParamsToGetNotificationByIdUseCaseInput } from '../request-mappers/notification/request-query-params-to-get-notification-by-id-use-case-input';
import { getByIdQuerySchema } from '../validation/schemas/get-by-id-query.schema';
import type { IGetByIdQueryPayload } from '../validation/schemas/get-by-id-query.types';
import { getNotificationsQuerySchema } from '../validation/schemas/get-notifications-query.schema';
import type { IGetNotificationsQueryPayload } from '../validation/schemas/get-notifications-query.types';
import { idParamSchema } from '../validation/schemas/id-param.schema';
import type { IIdParamPayload } from '../validation/schemas/id-param.types';

@RateLimiter('highRead')
@Controller({ path: 'notifications', version: '1' })
@UseGuards(JwtAuthGuard, AuthorizeGuard)
@Authorize({ kind: 'authenticated' })
export class NotificationsController {
  constructor(
    private readonly getNotificationsUseCase: GetNotificationsUseCase,
    private readonly getNotificationByIdUseCase: GetNotificationByIdUseCase,
    private readonly markNotificationReadByIdUseCase: MarkNotificationReadByIdUseCase,
    private readonly markAllNotificationsReadUseCase: MarkAllNotificationsReadUseCase,
    private readonly archiveNotificationByIdUseCase: ArchiveNotificationByIdUseCase,
    private readonly deleteNotificationByIdUseCase: DeleteNotificationByIdUseCase,
    private readonly getUnreadNotificationsCountUseCase: GetUnreadNotificationsCountUseCase,
    private readonly notificationSseEventBus: NotificationSseEventBus,
  ) {}

  @Get()
  async getNotifications(
    @HttpQuery(getNotificationsQuerySchema, {
      preprocess: normalizeListQueryRaw,
      errorMessage: 'Некорректные параметры запроса списка уведомлений',
    })
    queryParams: IGetNotificationsQueryPayload,
    @AuthenticatedUser() user: ISessionUser,
    @GetMetadata() metadata: IGetMetadata,
  ) {
    const params = requestQueryParamsToFindManyParams(
      queryParams,
      metadata,
      user.id,
    );
    const output = await this.getNotificationsUseCase.execute(params);
    return mapGetNotificationsHttpResponse(output, queryParams);
  }

  @Get('unread-count')
  async getUnreadCount(
    @AuthenticatedUser() user: ISessionUser,
    @GetMetadata() metadata: IGetMetadata,
  ) {
    const input = requestParamsToGetUnreadNotificationsCountUseCaseInput(
      user,
      metadata.isStaffUser,
    );
    const output = await this.getUnreadNotificationsCountUseCase.execute(input);
    return mapGetUnreadNotificationsCountHttpResponse(output);
  }

  @Sse('stream')
  @SkipResponseWrap()
  stream(@AuthenticatedUser() user: ISessionUser): Observable<MessageEvent> {
    const notifications$ = this.notificationSseEventBus.asObservable().pipe(
      filter((event) => event.notification.userId === user.id),
      map(
        (event) =>
          ({
            data: {
              type: event.type,
              data: event.notification,
            },
          }) as MessageEvent,
      ),
    );

    const heartbeat$ = interval(25_000).pipe(
      map(
        () =>
          ({
            data: { type: 'heartbeat' },
          }) as MessageEvent,
      ),
    );

    return merge(notifications$, heartbeat$);
  }

  @Post('read-all')
  async markAllRead(
    @AuthenticatedUser() user: ISessionUser,
    @GetMetadata() metadata: IGetMetadata,
  ) {
    const input = requestParamsToMarkAllNotificationsReadUseCaseInput(
      user,
      metadata.isStaffUser,
    );
    const output = await this.markAllNotificationsReadUseCase.execute(input);
    return mapMarkAllNotificationsReadHttpResponse(output);
  }

  @Get(':id')
  async getNotificationById(
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
    const input = requestQueryParamsToGetNotificationByIdUseCaseInput(
      params.id,
      queryPayload,
      metadata.isStaffUser,
      user.id,
    );
    const item = await this.getNotificationByIdUseCase.execute(input);
    return mapGetNotificationByIdHttpResponse(item);
  }

  @Post(':id/read')
  async markNotificationRead(
    @HttpParams(idParamSchema, {
      preprocess: normalizeIdParam,
      errorMessage: 'Некорректный идентификатор',
    })
    params: IIdParamPayload,
    @AuthenticatedUser() user: ISessionUser,
    @GetMetadata() metadata: IGetMetadata,
  ) {
    const input = requestParamsToMarkNotificationReadUseCaseInput(
      params.id,
      user,
      metadata.isStaffUser,
    );
    const output = await this.markNotificationReadByIdUseCase.execute(input);
    return mapMarkNotificationReadHttpResponse(output);
  }

  @Post(':id/archive')
  async archiveNotification(
    @HttpParams(idParamSchema, {
      preprocess: normalizeIdParam,
      errorMessage: 'Некорректный идентификатор',
    })
    params: IIdParamPayload,
    @AuthenticatedUser() user: ISessionUser,
    @GetMetadata() metadata: IGetMetadata,
  ) {
    const input = requestParamsToArchiveNotificationUseCaseInput(
      params.id,
      user,
      metadata.isStaffUser,
    );
    const output = await this.archiveNotificationByIdUseCase.execute(input);
    return mapArchiveNotificationHttpResponse(output);
  }

  @Delete(':id')
  async deleteNotification(
    @HttpParams(idParamSchema, {
      preprocess: normalizeIdParam,
      errorMessage: 'Некорректный идентификатор',
    })
    params: IIdParamPayload,
    @AuthenticatedUser() user: ISessionUser,
    @GetMetadata() metadata: IGetMetadata,
  ) {
    const input = requestParamsToDeleteNotificationUseCaseInput(
      params.id,
      user,
      metadata.isStaffUser,
    );
    await this.deleteNotificationByIdUseCase.execute(input);
    return mapDeleteNotificationHttpResponse();
  }
}
