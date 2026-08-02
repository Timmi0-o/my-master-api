import { DeleteAppointmentChatByIdUseCase } from '@modules/appointments/application/use-cases/appointment-chat/delete-appointment-chat-by-id.use-case';
import { GetAppointmentChatByIdUseCase } from '@modules/appointments/application/use-cases/appointment-chat/get-appointment-chat-by-id.use-case';
import { GetAppointmentChatsUseCase } from '@modules/appointments/application/use-cases/appointment-chat/get-appointment-chats.use-case';
import { MarkAppointmentChatReadUseCase } from '@modules/appointments/application/use-cases/appointment-chat/mark-appointment-chat-read.use-case';
import { getAppointmentChatsQuerySchema } from '@modules/appointments/presentation/http/validation/schemas/get-appointment-chats-query.schema';
import type { IGetAppointmentChatsQueryPayload } from '@modules/appointments/presentation/http/validation/schemas/get-appointment-chats-query.types';
import { getByIdQuerySchema } from '@modules/appointments/presentation/http/validation/schemas/get-by-id-query.schema';
import type { IGetByIdQueryPayload } from '@modules/appointments/presentation/http/validation/schemas/get-by-id-query.types';
import { idParamSchema } from '@modules/appointments/presentation/http/validation/schemas/id-param.schema';
import type { IIdParamPayload } from '@modules/appointments/presentation/http/validation/schemas/id-param.types';
import { markAppointmentChatReadPayloadSchema } from '@modules/appointments/presentation/http/validation/schemas/mark-appointment-chat-read-payload.schema';
import type { IMarkAppointmentChatReadPayload } from '@modules/appointments/presentation/http/validation/schemas/mark-appointment-chat-read-payload.types';
import { AuthenticatedUser } from '@modules/auth/presentation/decorators/authenticated-user.decorator';
import { JwtAuthGuard } from '@modules/auth/presentation/guards/jwt-auth.guard';
import { Permissions } from '@modules/authorization/domain/permissions/permission-names';
import { Authorize } from '@modules/authorization/presentation/decorators/authorize.decorator';
import { AuthorizeGuard } from '@modules/authorization/presentation/guards/authorize.guard';
import { Controller, Delete, Get, Post, UseGuards } from '@nestjs/common';
import type { IGetMetadata } from '@shared/domain/decorators/i-get-metadata';
import type { ISessionUser } from '@shared/domain/i-session-user';
import { GetMetadata } from '@shared/presentation/decorators/get-metadata';
import {
  HttpBody,
  HttpParams,
  HttpQuery,
} from '@shared/presentation/http/decorators';
import { normalizeIdParam } from '@shared/presentation/http/helpers/normalize-id-param';
import { normalizeListQueryRaw } from '@shared/presentation/http/helpers/normalize-list-query-raw';
import { requestBodyToMarkAppointmentChatReadUseCaseInput } from '../request-mappers/appointment-chat/request-body-to-mark-appointment-chat-read-use-case-input';
import { requestParamsToDeleteAppointmentChatUseCaseInput } from '../request-mappers/appointment-chat/request-params-to-delete-appointment-chat-use-case-input';
import { requestQueryParamsToFindManyParams } from '../request-mappers/appointment-chat/request-query-params-to-find-many-params.mapper';
import { requestQueryParamsToGetAppointmentChatByIdUseCaseInput } from '../request-mappers/appointment-chat/request-query-params-to-get-appointment-chat-by-id-use-case-input';
import { mapDeleteAppointmentChatHttpResponse } from '../http-responses/map-delete-appointment-chat-response';
import { mapGetAppointmentChatByIdHttpResponse } from '../http-responses/map-get-appointment-chat-by-id-response';
import { mapGetAppointmentChatsHttpResponse } from '../http-responses/map-get-appointment-chats-response';
import { mapMarkAppointmentChatReadHttpResponse } from '../http-responses/map-mark-appointment-chat-read-response';

@Controller({ path: 'appointment-chats', version: '1' })
@UseGuards(JwtAuthGuard, AuthorizeGuard)
export class AppointmentChatsController {
  constructor(
    private readonly getAppointmentChatsUseCase: GetAppointmentChatsUseCase,
    private readonly getAppointmentChatByIdUseCase: GetAppointmentChatByIdUseCase,
    private readonly markAppointmentChatReadUseCase: MarkAppointmentChatReadUseCase,
    private readonly deleteAppointmentChatByIdUseCase: DeleteAppointmentChatByIdUseCase,
  ) {}

  @Get()
  @Authorize({ kind: 'staff-only' })
  async getAppointmentChats(
    @HttpQuery(getAppointmentChatsQuerySchema, {
      preprocess: normalizeListQueryRaw,
      errorMessage: 'Некорректные параметры запроса списка чатов записей',
    })
    queryParams: IGetAppointmentChatsQueryPayload,
    @GetMetadata() metadata: IGetMetadata,
  ) {
    const params = requestQueryParamsToFindManyParams(queryParams, metadata);
    const output = await this.getAppointmentChatsUseCase.execute(params);
    return mapGetAppointmentChatsHttpResponse(output, queryParams);
  }

  @Get(':id')
  @Authorize({
    kind: 'permissions',
    permissions: [Permissions.appointmentChats.read],
  })
  async getAppointmentChatById(
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
    const input = requestQueryParamsToGetAppointmentChatByIdUseCaseInput(
      params.id,
      queryPayload,
      user,
      metadata.isStaffUser,
    );
    const item = await this.getAppointmentChatByIdUseCase.execute(input);
    return mapGetAppointmentChatByIdHttpResponse(item);
  }

  @Post(':id/read')
  @Authorize({ kind: 'authenticated' })
  async markAppointmentChatRead(
    @HttpParams(idParamSchema, {
      preprocess: normalizeIdParam,
      errorMessage: 'Некорректный идентификатор',
    })
    params: IIdParamPayload,
    @HttpBody(markAppointmentChatReadPayloadSchema, {
      errorMessage: 'Некорректный payload отметки прочтения',
    })
    payload: IMarkAppointmentChatReadPayload,
    @AuthenticatedUser() user: ISessionUser,
    @GetMetadata() metadata: IGetMetadata,
  ) {
    const input = requestBodyToMarkAppointmentChatReadUseCaseInput(
      params.id,
      payload,
      user,
      metadata.isStaffUser,
    );
    const output = await this.markAppointmentChatReadUseCase.execute(input);
    return mapMarkAppointmentChatReadHttpResponse(output);
  }

  @Delete(':id')
  @Authorize({ kind: 'authenticated' })
  async deleteAppointmentChat(
    @HttpParams(idParamSchema, {
      preprocess: normalizeIdParam,
      errorMessage: 'Некорректный идентификатор',
    })
    params: IIdParamPayload,
    @AuthenticatedUser() user: ISessionUser,
    @GetMetadata() metadata: IGetMetadata,
  ) {
    const input = requestParamsToDeleteAppointmentChatUseCaseInput(
      params.id,
      user,
      metadata.isStaffUser,
    );
    await this.deleteAppointmentChatByIdUseCase.execute(input);
    return mapDeleteAppointmentChatHttpResponse();
  }
}
