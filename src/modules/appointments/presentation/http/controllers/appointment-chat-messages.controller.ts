import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  UnauthorizedException,
  UseFilters,
  UseGuards,
} from '@nestjs/common';
import { CreateAppointmentChatMessageUseCase } from 'src/modules/appointments/application/use-cases/appointment-chat-message/create-appointment-chat-message.use-case';
import { DeleteAppointmentChatMessageByIdUseCase } from 'src/modules/appointments/application/use-cases/appointment-chat-message/delete-appointment-chat-message-by-id.use-case';
import { GetAppointmentChatMessageByIdUseCase } from 'src/modules/appointments/application/use-cases/appointment-chat-message/get-appointment-chat-message-by-id.use-case';
import { GetAppointmentChatMessagesUseCase } from 'src/modules/appointments/application/use-cases/appointment-chat-message/get-appointment-chat-messages.use-case';
import { CurrentUser } from 'src/modules/auth/presentation/decorators/current-user.decorator';
import { JwtAuthGuard } from 'src/modules/auth/presentation/guards/jwt-auth.guard';
import type { IGetMetadata } from 'src/modules/shared/domain/decorators/i-get-metadata';
import type { IRawQuery } from 'src/modules/shared/domain/i-query.dto';
import type { ISessionUser } from 'src/modules/shared/domain/i-session-user';
import { DomainExceptionFilter } from 'src/modules/shared/infrastructure/filters/domain-exception.filter';
import { GetMetadata } from 'src/modules/shared/presentation/decorators/get-metadata';
import { payloadToCreateAppointmentChatMessageInput } from '../mappers/appointment-chat-message/payload-to-create-appointment-chat-message-input';
import { payloadToDeleteAppointmentChatMessageInput } from '../mappers/appointment-chat-message/payload-to-delete-appointment-chat-message-input';
import { payloadToFindManyParams } from '../mappers/appointment-chat-message/payload-to-find-many-params.mapper';
import { payloadToGetAppointmentChatMessageByIdInput } from '../mappers/appointment-chat-message/payload-to-get-appointment-chat-message-by-id-input';
import { mapGetAppointmentChatMessagesHttpResponse } from '../response/map-get-appointment-chat-messages-response';
import { AppointmentChatMessageValidator } from '../validation/appointment-chat-message.validator';

@Controller({ path: 'appointment-chat-messages', version: '1' })
@UseFilters(DomainExceptionFilter)
@UseGuards(JwtAuthGuard)
export class AppointmentChatMessagesController {
  constructor(
    private readonly getAppointmentChatMessagesUseCase: GetAppointmentChatMessagesUseCase,
    private readonly getAppointmentChatMessageByIdUseCase: GetAppointmentChatMessageByIdUseCase,
    private readonly createAppointmentChatMessageUseCase: CreateAppointmentChatMessageUseCase,
    private readonly deleteAppointmentChatMessageByIdUseCase: DeleteAppointmentChatMessageByIdUseCase,
    private readonly appointmentChatMessageValidator: AppointmentChatMessageValidator,
  ) {}

  @Get()
  async getAppointmentChatMessages(
    @Query() query: IRawQuery,
    @CurrentUser() user: ISessionUser | null,
    @GetMetadata() metadata: IGetMetadata,
  ) {
    if (!user) {
      throw new UnauthorizedException('User is not authenticated');
    }
    const payload =
      this.appointmentChatMessageValidator.validateGetAppointmentChatMessagesQuery(
        query,
      );
    const params = payloadToFindManyParams(payload, metadata);
    const output = await this.getAppointmentChatMessagesUseCase.execute(params);
    return mapGetAppointmentChatMessagesHttpResponse(output, payload);
  }

  @Get(':id')
  async getAppointmentChatMessageById(
    @Param() params: Record<string, unknown>,
    @Query() query: IRawQuery,
    @CurrentUser() user: ISessionUser | null,
    @GetMetadata() metadata: IGetMetadata,
  ) {
    if (!user) {
      throw new UnauthorizedException('User is not authenticated');
    }
    const { id } = this.appointmentChatMessageValidator.validateIdParam(params);
    const queryPayload =
      this.appointmentChatMessageValidator.validateGetByIdQuery(query);
    const input = payloadToGetAppointmentChatMessageByIdInput(
      id,
      queryPayload,
      user,
      metadata.isStaffUser,
    );
    const item = await this.getAppointmentChatMessageByIdUseCase.execute(input);
    return { data: item };
  }

  @Post()
  async createAppointmentChatMessage(
    @Body() body: Record<string, unknown>,
    @CurrentUser() user: ISessionUser | null,
    @GetMetadata() metadata: IGetMetadata,
  ) {
    if (!user) {
      throw new UnauthorizedException('User is not authenticated');
    }
    const payload =
      this.appointmentChatMessageValidator.validateCreatePayload(body);
    const input = payloadToCreateAppointmentChatMessageInput(
      payload,
      user,
      metadata.isStaffUser,
    );
    const data = await this.createAppointmentChatMessageUseCase.execute(input);
    return { data };
  }

  @Delete(':id')
  async deleteAppointmentChatMessage(
    @Param() params: Record<string, unknown>,
    @CurrentUser() user: ISessionUser | null,
    @GetMetadata() metadata: IGetMetadata,
  ) {
    if (!user) {
      throw new UnauthorizedException('User is not authenticated');
    }
    const { id } = this.appointmentChatMessageValidator.validateIdParam(params);
    const input = payloadToDeleteAppointmentChatMessageInput(
      id,
      user,
      metadata.isStaffUser,
    );
    await this.deleteAppointmentChatMessageByIdUseCase.execute(input);
    return { data: { success: true } };
  }
}
