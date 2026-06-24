import {
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthenticatedUser } from 'src/modules/auth/presentation/decorators/authenticated-user.decorator';
import { JwtAuthGuard } from 'src/modules/auth/presentation/guards/jwt-auth.guard';
import { DeleteAppointmentChatByIdUseCase } from 'src/modules/appointments/application/use-cases/appointment-chat/delete-appointment-chat-by-id.use-case';
import { GetAppointmentChatByIdUseCase } from 'src/modules/appointments/application/use-cases/appointment-chat/get-appointment-chat-by-id.use-case';
import { GetAppointmentChatsUseCase } from 'src/modules/appointments/application/use-cases/appointment-chat/get-appointment-chats.use-case';
import type { IGetMetadata } from 'src/modules/shared/domain/decorators/i-get-metadata';
import type { IRawQuery } from 'src/modules/shared/domain/i-query.dto';
import type { ISessionUser } from 'src/modules/shared/domain/i-session-user';
import { GetMetadata } from 'src/modules/shared/presentation/decorators/get-metadata';
import { payloadToDeleteAppointmentChatInput } from '../mappers/appointment-chat/payload-to-delete-appointment-chat-input';
import { payloadToFindManyParams } from '../mappers/appointment-chat/payload-to-find-many-params.mapper';
import { payloadToGetAppointmentChatByIdInput } from '../mappers/appointment-chat/payload-to-get-appointment-chat-by-id-input';
import { mapGetAppointmentChatsHttpResponse } from '../response/map-get-appointment-chats-response';
import { mapGetAppointmentChatByIdHttpResponse } from '../response/map-get-appointment-chat-by-id-response';
import { mapDeleteAppointmentChatHttpResponse } from '../response/map-delete-appointment-chat-response';
import { AppointmentChatValidator } from '../validation/appointment-chat.validator';

@Controller({ path: 'appointment-chats', version: '1' })
@UseGuards(JwtAuthGuard)
export class AppointmentChatsController {
  constructor(
    private readonly getAppointmentChatsUseCase: GetAppointmentChatsUseCase,
    private readonly getAppointmentChatByIdUseCase: GetAppointmentChatByIdUseCase,
    private readonly deleteAppointmentChatByIdUseCase: DeleteAppointmentChatByIdUseCase,
    private readonly appointmentChatValidator: AppointmentChatValidator,
  ) {}

  @Get()
  async getAppointmentChats(
    @Query() query: IRawQuery,
    @GetMetadata() metadata: IGetMetadata,
  ) {
    if (!metadata.isStaffUser) {
      throw new ForbiddenException('Staff access required');
    }
    const payload =
      this.appointmentChatValidator.validateGetAppointmentChatsQuery(query);
    const params = payloadToFindManyParams(payload, metadata);
    const output = await this.getAppointmentChatsUseCase.execute(params);
    return mapGetAppointmentChatsHttpResponse(output, payload);
  }

  @Get(':id')
  async getAppointmentChatById(
    @Param() params: Record<string, unknown>,
    @Query() query: IRawQuery,
    @AuthenticatedUser() user: ISessionUser,
    @GetMetadata() metadata: IGetMetadata,
  ) {
    const { id } = this.appointmentChatValidator.validateIdParam(params);
    const queryPayload = this.appointmentChatValidator.validateGetByIdQuery(query);
    const input = payloadToGetAppointmentChatByIdInput(
      id,
      queryPayload,
      user,
      metadata.isStaffUser,
    );
    const item = await this.getAppointmentChatByIdUseCase.execute(input);
    return mapGetAppointmentChatByIdHttpResponse(item);
  }

  @Delete(':id')
  async deleteAppointmentChat(
    @Param() params: Record<string, unknown>,
    @AuthenticatedUser() user: ISessionUser,
    @GetMetadata() metadata: IGetMetadata,
  ) {
    const { id } = this.appointmentChatValidator.validateIdParam(params);
    const input = payloadToDeleteAppointmentChatInput(
      id,
      user,
      metadata.isStaffUser,
    );
    await this.deleteAppointmentChatByIdUseCase.execute(input);
    return mapDeleteAppointmentChatHttpResponse();
  }
}
