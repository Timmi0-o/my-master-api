import { Controller, Delete, Get, Post, UseGuards } from '@nestjs/common';
import { CreateAppointmentChatMessageUseCase } from '@modules/appointments/application/use-cases/appointment-chat-message/create-appointment-chat-message.use-case';
import { DeleteAppointmentChatMessageByIdUseCase } from '@modules/appointments/application/use-cases/appointment-chat-message/delete-appointment-chat-message-by-id.use-case';
import { GetAppointmentChatMessageByIdUseCase } from '@modules/appointments/application/use-cases/appointment-chat-message/get-appointment-chat-message-by-id.use-case';
import { GetAppointmentChatMessagesUseCase } from '@modules/appointments/application/use-cases/appointment-chat-message/get-appointment-chat-messages.use-case';
import { AuthenticatedUser } from '@modules/auth/presentation/decorators/authenticated-user.decorator';
import { JwtAuthGuard } from '@modules/auth/presentation/guards/jwt-auth.guard';
import { Permissions } from '@modules/authorization/domain/permissions/permission-names';
import { Authorize } from '@modules/authorization/presentation/decorators/authorize.decorator';
import { AuthorizeGuard } from '@modules/authorization/presentation/guards/authorize.guard';
import { createAppointmentChatMessagePayloadSchema } from '@modules/appointments/presentation/http/validation/schemas/create-appointment-chat-message-payload.schema';
import type { ICreateAppointmentChatMessagePayload } from '@modules/appointments/presentation/http/validation/schemas/create-appointment-chat-message-payload.types';
import { getAppointmentChatMessagesQuerySchema } from '@modules/appointments/presentation/http/validation/schemas/get-appointment-chat-messages-query.schema';
import type { IGetAppointmentChatMessagesQueryPayload } from '@modules/appointments/presentation/http/validation/schemas/get-appointment-chat-messages-query.types';
import { getByIdQuerySchema } from '@modules/appointments/presentation/http/validation/schemas/get-by-id-query.schema';
import type { IGetByIdQueryPayload } from '@modules/appointments/presentation/http/validation/schemas/get-by-id-query.types';
import { idParamSchema } from '@modules/appointments/presentation/http/validation/schemas/id-param.schema';
import type { IIdParamPayload } from '@modules/appointments/presentation/http/validation/schemas/id-param.types';
import type { IGetMetadata } from '@shared/domain/decorators/i-get-metadata';
import type { ISessionUser } from '@shared/domain/i-session-user';
import { GetMetadata } from '@shared/presentation/decorators/get-metadata';
import { HttpBody, HttpParams, HttpQuery } from '@shared/presentation/http/decorators';
import { normalizeIdParam } from '@shared/presentation/http/helpers/normalize-id-param';
import { normalizeListQueryRaw } from '@shared/presentation/http/helpers/normalize-list-query-raw';
import { payloadToCreateAppointmentChatMessageInput } from '../mappers/appointment-chat-message/payload-to-create-appointment-chat-message-input';
import { payloadToDeleteAppointmentChatMessageInput } from '../mappers/appointment-chat-message/payload-to-delete-appointment-chat-message-input';
import { payloadToFindManyParams } from '../mappers/appointment-chat-message/payload-to-find-many-params.mapper';
import { payloadToGetAppointmentChatMessageByIdInput } from '../mappers/appointment-chat-message/payload-to-get-appointment-chat-message-by-id-input';
import { mapGetAppointmentChatMessagesHttpResponse } from '../response/map-get-appointment-chat-messages-response';
import { mapGetAppointmentChatMessageByIdHttpResponse } from '../response/map-get-appointment-chat-message-by-id-response';
import { mapCreateAppointmentChatMessageHttpResponse } from '../response/map-create-appointment-chat-message-response';
import { mapDeleteAppointmentChatMessageHttpResponse } from '../response/map-delete-appointment-chat-message-response';

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
    payload: IGetAppointmentChatMessagesQueryPayload,
    @GetMetadata() metadata: IGetMetadata,
  ) {
    const params = payloadToFindManyParams(payload, metadata);
    const output = await this.getAppointmentChatMessagesUseCase.execute(params);
    return mapGetAppointmentChatMessagesHttpResponse(output, payload);
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
    const input = payloadToGetAppointmentChatMessageByIdInput(
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
    const input = payloadToCreateAppointmentChatMessageInput(
      payload,
      user,
      metadata.isStaffUser,
    );
    const output = await this.createAppointmentChatMessageUseCase.execute(input);
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
    const input = payloadToDeleteAppointmentChatMessageInput(
      params.id,
      user,
      metadata.isStaffUser,
    );
    await this.deleteAppointmentChatMessageByIdUseCase.execute(input);
    return mapDeleteAppointmentChatMessageHttpResponse();
  }
}
