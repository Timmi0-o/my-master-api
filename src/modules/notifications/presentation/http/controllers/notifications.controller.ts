import { Controller, Delete, Get, Post, UseGuards } from '@nestjs/common';
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
import type { IGetMetadata } from '@shared/domain/decorators/i-get-metadata';
import type { ISessionUser } from '@shared/domain/i-session-user';
import { GetMetadata } from '@shared/presentation/decorators/get-metadata';
import { HttpParams, HttpQuery } from '@shared/presentation/http/decorators';
import { normalizeIdParam } from '@shared/presentation/http/helpers/normalize-id-param';
import { normalizeListQueryRaw } from '@shared/presentation/http/helpers/normalize-list-query-raw';
import { payloadToArchiveNotificationInput } from '../mappers/notification/payload-to-archive-notification-input';
import { payloadToDeleteNotificationInput } from '../mappers/notification/payload-to-delete-notification-input';
import { payloadToFindManyParams } from '../mappers/notification/payload-to-find-many-params.mapper';
import { payloadToGetNotificationByIdInput } from '../mappers/notification/payload-to-get-notification-by-id-input';
import { payloadToGetUnreadNotificationsCountInput } from '../mappers/notification/payload-to-get-unread-notifications-count-input';
import { payloadToMarkAllNotificationsReadInput } from '../mappers/notification/payload-to-mark-all-notifications-read-input';
import { payloadToMarkNotificationReadInput } from '../mappers/notification/payload-to-mark-notification-read-input';
import { mapArchiveNotificationHttpResponse } from '../response/map-archive-notification-response';
import { mapDeleteNotificationHttpResponse } from '../response/map-delete-notification-response';
import { mapGetNotificationByIdHttpResponse } from '../response/map-get-notification-by-id-response';
import { mapGetNotificationsHttpResponse } from '../response/map-get-notifications-response';
import { mapGetUnreadNotificationsCountHttpResponse } from '../response/map-get-unread-notifications-count-response';
import { mapMarkAllNotificationsReadHttpResponse } from '../response/map-mark-all-notifications-read-response';
import { mapMarkNotificationReadHttpResponse } from '../response/map-mark-notification-read-response';
import { getByIdQuerySchema } from '../validation/schemas/get-by-id-query.schema';
import type { IGetByIdQueryPayload } from '../validation/schemas/get-by-id-query.types';
import { getNotificationsQuerySchema } from '../validation/schemas/get-notifications-query.schema';
import type { IGetNotificationsQueryPayload } from '../validation/schemas/get-notifications-query.types';
import { idParamSchema } from '../validation/schemas/id-param.schema';
import type { IIdParamPayload } from '../validation/schemas/id-param.types';

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
  ) {}

  @Get()
  async getNotifications(
    @HttpQuery(getNotificationsQuerySchema, {
      preprocess: normalizeListQueryRaw,
      errorMessage: 'Некорректные параметры запроса списка уведомлений',
    })
    payload: IGetNotificationsQueryPayload,
    @AuthenticatedUser() user: ISessionUser,
    @GetMetadata() metadata: IGetMetadata,
  ) {
    const params = payloadToFindManyParams(payload, metadata, user.id);
    const output = await this.getNotificationsUseCase.execute(params);
    return mapGetNotificationsHttpResponse(output, payload);
  }

  @Get('unread-count')
  async getUnreadCount(
    @AuthenticatedUser() user: ISessionUser,
    @GetMetadata() metadata: IGetMetadata,
  ) {
    const input = payloadToGetUnreadNotificationsCountInput(
      user,
      metadata.isStaffUser,
    );
    const output = await this.getUnreadNotificationsCountUseCase.execute(input);
    return mapGetUnreadNotificationsCountHttpResponse(output);
  }

  @Post('read-all')
  async markAllRead(
    @AuthenticatedUser() user: ISessionUser,
    @GetMetadata() metadata: IGetMetadata,
  ) {
    const input = payloadToMarkAllNotificationsReadInput(
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
    const input = payloadToGetNotificationByIdInput(
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
    const input = payloadToMarkNotificationReadInput(
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
    const input = payloadToArchiveNotificationInput(
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
    const input = payloadToDeleteNotificationInput(
      params.id,
      user,
      metadata.isStaffUser,
    );
    await this.deleteNotificationByIdUseCase.execute(input);
    return mapDeleteNotificationHttpResponse();
  }
}
