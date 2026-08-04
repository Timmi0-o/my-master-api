import { CreateAppointmentChatMessageUseCase } from '@modules/appointments/application/use-cases/appointment-chat-message/create-appointment-chat-message.use-case';
import { DeleteAppointmentChatMessageByIdUseCase } from '@modules/appointments/application/use-cases/appointment-chat-message/delete-appointment-chat-message-by-id.use-case';
import { GetAppointmentChatMessageByIdUseCase } from '@modules/appointments/application/use-cases/appointment-chat-message/get-appointment-chat-message-by-id.use-case';
import { GetAppointmentChatMessagesUseCase } from '@modules/appointments/application/use-cases/appointment-chat-message/get-appointment-chat-messages.use-case';
import { createAppointmentChatMessagePayloadSchema } from '@modules/appointments/presentation/http/validation/schemas/create-appointment-chat-message-payload.schema';
import type { ICreateAppointmentChatMessagePayload } from '@modules/appointments/presentation/http/validation/schemas/create-appointment-chat-message-payload.types';
import { getAppointmentChatMessagesQuerySchema } from '@modules/appointments/presentation/http/validation/schemas/get-appointment-chat-messages-query.schema';
import type { IGetAppointmentChatMessagesQueryPayload } from '@modules/appointments/presentation/http/validation/schemas/get-appointment-chat-messages-query.types';
import { getByIdQuerySchema } from '@modules/appointments/presentation/http/validation/schemas/get-by-id-query.schema';
import type { IGetByIdQueryPayload } from '@modules/appointments/presentation/http/validation/schemas/get-by-id-query.types';
import { idParamSchema } from '@modules/appointments/presentation/http/validation/schemas/id-param.schema';
import type { IIdParamPayload } from '@modules/appointments/presentation/http/validation/schemas/id-param.types';
import { AuthenticatedUser } from '@modules/auth/presentation/decorators/authenticated-user.decorator';
import { JwtAuthGuard } from '@modules/auth/presentation/guards/jwt-auth.guard';
import { Permissions } from '@modules/authorization/domain/permissions/permission-names';
import { Authorize } from '@modules/authorization/presentation/decorators/authorize.decorator';
import { AuthorizeGuard } from '@modules/authorization/presentation/guards/authorize.guard';
import { Controller, Delete, Get, Post, UseGuards } from '@nestjs/common';
import type { IGetMetadata } from '@shared/domain/decorators/i-get-metadata';
import type { ISessionUser } from '@shared/domain/i-session-user';
import { RateLimiter } from '@shared/infrastructure/throttler/http-rate-limit.decorators';
import { GetMetadata } from '@shared/presentation/decorators/get-metadata';
import {
  HttpBody,
  HttpParams,
  HttpQuery,
} from '@shared/presentation/http/decorators';
import { normalizeIdParam } from '@shared/presentation/http/helpers/normalize-id-param';
import { normalizeListQueryRaw } from '@shared/presentation/http/helpers/normalize-list-query-raw';
import { mapCreateAppointmentChatMessageHttpResponse } from '../http-responses/map-create-appointment-chat-message-response';
import { mapDeleteAppointmentChatMessageHttpResponse } from '../http-responses/map-delete-appointment-chat-message-response';
import { mapGetAppointmentChatMessageByIdHttpResponse } from '../http-responses/map-get-appointment-chat-message-by-id-response';
import { mapGetAppointmentChatMessagesHttpResponse } from '../http-responses/map-get-appointment-chat-messages-response';
import { requestBodyToCreateAppointmentChatMessageUseCaseInput } from '../request-mappers/appointment-chat-message/request-body-to-create-appointment-chat-message-use-case-input';
import { requestParamsToDeleteAppointmentChatMessageUseCaseInput } from '../request-mappers/appointment-chat-message/request-params-to-delete-appointment-chat-message-use-case-input';
import { requestQueryParamsToFindManyParams } from '../request-mappers/appointment-chat-message/request-query-params-to-find-many-params.mapper';
import { requestQueryParamsToGetAppointmentChatMessageByIdUseCaseInput } from '../request-mappers/appointment-chat-message/request-query-params-to-get-appointment-chat-message-by-id-use-case-input';

@RateLimiter('highRead')
@Controller({ path: 'appointment-chat-messages', version: '1' })
@UseGuards(JwtAuthGuard, AuthorizeGuard)
export class AppointmentChatMessagesController {
  constructor(
    private readonly getAppointmentChatMessagesUseCase: GetAppointmentChatMessagesUseCase,
    private readonly getAppointmentChatMessageByIdUseCase: GetAppointmentChatMessageByIdUseCase,
    private readonly createAppointmentChatMessageUseCase: CreateAppointmentChatMessageUseCase,
    private readonly deleteAppointmentChatMessageByIdUseCase: DeleteAppointmentChatMessageByIdUseCase,
  ) {}

  @Get()
  @Authorize({
    kind: 'permissions',
    permissions: [Permissions.appointmentChatMessages.read],
  })
  async getAppointmentChatMessages(
    @HttpQuery(getAppointmentChatMessagesQuerySchema, {
      preprocess: normalizeListQueryRaw,
      errorMessage: 'Некорректные параметры запроса списка сообщений',
    })
    queryParams: IGetAppointmentChatMessagesQueryPayload,
    @GetMetadata() metadata: IGetMetadata,
  ) {
    const params = requestQueryParamsToFindManyParams(queryParams, metadata);

    const output = await this.getAppointmentChatMessagesUseCase.execute(params);
    return mapGetAppointmentChatMessagesHttpResponse(output, queryParams);
  }

  @Get(':id')
  @Authorize({
    kind: 'permissions',
    permissions: [Permissions.appointmentChatMessages.read],
  })
  async getAppointmentChatMessageById(
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
    const input = requestQueryParamsToGetAppointmentChatMessageByIdUseCaseInput(
      params.id,
      queryPayload,
      user,
      metadata.isStaffUser,
    );
    const item = await this.getAppointmentChatMessageByIdUseCase.execute(input);
    return mapGetAppointmentChatMessageByIdHttpResponse(item);
  }

  @Post()
  @Authorize({
    kind: 'permissions',
    permissions: [Permissions.appointmentChatMessages.create],
  })
  async createAppointmentChatMessage(
    @HttpBody(createAppointmentChatMessagePayloadSchema, {
      errorMessage: 'Некорректный payload создания сообщения',
    })
    payload: ICreateAppointmentChatMessagePayload,
    @AuthenticatedUser() user: ISessionUser,
    @GetMetadata() metadata: IGetMetadata,
  ) {
    const input = requestBodyToCreateAppointmentChatMessageUseCaseInput(
      payload,
      user,
      metadata.isStaffUser,
    );
    const output =
      await this.createAppointmentChatMessageUseCase.execute(input);
    return mapCreateAppointmentChatMessageHttpResponse(output);
  }

  @Delete(':id')
  @Authorize({ kind: 'authenticated' })
  async deleteAppointmentChatMessage(
    @HttpParams(idParamSchema, {
      preprocess: normalizeIdParam,
      errorMessage: 'Некорректный идентификатор',
    })
    params: IIdParamPayload,
    @AuthenticatedUser() user: ISessionUser,
    @GetMetadata() metadata: IGetMetadata,
  ) {
    const input = requestParamsToDeleteAppointmentChatMessageUseCaseInput(
      params.id,
      user,
      metadata.isStaffUser,
    );
    await this.deleteAppointmentChatMessageByIdUseCase.execute(input);
    return mapDeleteAppointmentChatMessageHttpResponse();
  }
}
