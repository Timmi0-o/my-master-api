import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthenticatedUser } from 'src/modules/auth/presentation/decorators/authenticated-user.decorator';
import { JwtAuthGuard } from 'src/modules/auth/presentation/guards/jwt-auth.guard';
import { CreateAppointmentUseCase } from 'src/modules/appointments/application/use-cases/appointment/create-appointment.use-case';
import { DeleteAppointmentByIdUseCase } from 'src/modules/appointments/application/use-cases/appointment/delete-appointment-by-id.use-case';
import { GetAppointmentByIdUseCase } from 'src/modules/appointments/application/use-cases/appointment/get-appointment-by-id.use-case';
import { GetAppointmentsUseCase } from 'src/modules/appointments/application/use-cases/appointment/get-appointments.use-case';
import { GetMyAppointmentsUseCase } from 'src/modules/appointments/application/use-cases/appointment/get-my-appointments.use-case';
import { GetMyClientsAppointmentsUseCase } from 'src/modules/appointments/application/use-cases/appointment/get-my-clients-appointments.use-case';
import { UpdateAppointmentByIdUseCase } from 'src/modules/appointments/application/use-cases/appointment/update-appointment-by-id.use-case';
import type { IGetMetadata } from 'src/modules/shared/domain/decorators/i-get-metadata';
import type { IRawQuery } from 'src/modules/shared/domain/i-query.dto';
import type { ISessionUser } from 'src/modules/shared/domain/i-session-user';
import { GetMetadata } from 'src/modules/shared/presentation/decorators/get-metadata';
import { payloadToCreateAppointmentInput } from '../mappers/appointment/payload-to-create-appointment-input';
import { payloadToDeleteAppointmentInput } from '../mappers/appointment/payload-to-delete-appointment-input';
import { payloadToFindManyParams } from '../mappers/appointment/payload-to-find-many-params.mapper';
import { payloadToGetAppointmentByIdInput } from '../mappers/appointment/payload-to-get-appointment-by-id-input';
import { payloadToGetMyAppointmentsInput } from '../mappers/appointment/payload-to-get-my-appointments-input';
import { payloadToGetMyClientsAppointmentsInput } from '../mappers/appointment/payload-to-get-my-clients-appointments-input';
import { payloadToUpdateAppointmentInput } from '../mappers/appointment/payload-to-update-appointment-input';
import { mapGetAppointmentsHttpResponse } from '../response/map-get-appointments-response';
import { AppointmentValidator } from '../validation/appointment.validator';

@Controller({ path: 'appointments', version: '1' })
@UseGuards(JwtAuthGuard)
export class AppointmentsController {
  constructor(
    private readonly getAppointmentsUseCase: GetAppointmentsUseCase,
    private readonly getMyAppointmentsUseCase: GetMyAppointmentsUseCase,
    private readonly getMyClientsAppointmentsUseCase: GetMyClientsAppointmentsUseCase,
    private readonly getAppointmentByIdUseCase: GetAppointmentByIdUseCase,
    private readonly createAppointmentUseCase: CreateAppointmentUseCase,
    private readonly updateAppointmentByIdUseCase: UpdateAppointmentByIdUseCase,
    private readonly deleteAppointmentByIdUseCase: DeleteAppointmentByIdUseCase,
    private readonly appointmentValidator: AppointmentValidator,
  ) {}

  @Get('me')
  async getMyAppointments(
    @Query() query: IRawQuery,
    @AuthenticatedUser() user: ISessionUser,
    @GetMetadata() metadata: IGetMetadata,
  ) {
    const payload = this.appointmentValidator.validateGetAppointmentsQuery(query);
    const params = payloadToFindManyParams(payload, metadata);
    const input = payloadToGetMyAppointmentsInput(params, user, metadata.isStaffUser);
    const output = await this.getMyAppointmentsUseCase.execute(input);
    return mapGetAppointmentsHttpResponse(output, payload);
  }

  @Get('my-clients')
  async getMyClientsAppointments(
    @Query() query: IRawQuery,
    @AuthenticatedUser() user: ISessionUser,
    @GetMetadata() metadata: IGetMetadata,
  ) {
    const payload = this.appointmentValidator.validateGetAppointmentsQuery(query);
    const params = payloadToFindManyParams(payload, metadata);
    const input = payloadToGetMyClientsAppointmentsInput(
      params,
      user,
      metadata.isStaffUser,
    );
    const output = await this.getMyClientsAppointmentsUseCase.execute(input);
    return mapGetAppointmentsHttpResponse(output, payload);
  }

  @Get()
  async getAppointments(
    @Query() query: IRawQuery,
    @GetMetadata() metadata: IGetMetadata,
  ) {
    if (!metadata.isStaffUser) {
      throw new ForbiddenException('Staff access required');
    }
    const payload = this.appointmentValidator.validateGetAppointmentsQuery(query);
    const params = payloadToFindManyParams(payload, metadata);
    const output = await this.getAppointmentsUseCase.execute(params);
    return mapGetAppointmentsHttpResponse(output, payload);
  }

  @Get(':id')
  async getAppointmentById(
    @Param() params: Record<string, unknown>,
    @Query() query: IRawQuery,
    @AuthenticatedUser() user: ISessionUser,
    @GetMetadata() metadata: IGetMetadata,
  ) {
    const { id } = this.appointmentValidator.validateIdParam(params);
    const queryPayload = this.appointmentValidator.validateGetByIdQuery(query);
    const input = payloadToGetAppointmentByIdInput(
      id,
      queryPayload,
      user,
      metadata.isStaffUser,
    );
    const item = await this.getAppointmentByIdUseCase.execute(input);
    return { data: item };
  }

  @Post()
  async createAppointment(
    @Body() body: Record<string, unknown>,
    @AuthenticatedUser() user: ISessionUser,
    @GetMetadata() metadata: IGetMetadata,
  ) {
    const payload = this.appointmentValidator.validateCreatePayload(body);
    const input = payloadToCreateAppointmentInput(
      payload,
      user,
      metadata.isStaffUser,
    );
    const data = await this.createAppointmentUseCase.execute(input);
    return { data };
  }

  @Patch(':id')
  async updateAppointment(
    @Param() params: Record<string, unknown>,
    @Body() body: Record<string, unknown>,
    @AuthenticatedUser() user: ISessionUser,
    @GetMetadata() metadata: IGetMetadata,
  ) {
    const { id } = this.appointmentValidator.validateIdParam(params);
    const payload = this.appointmentValidator.validateUpdatePayload(body);
    const input = payloadToUpdateAppointmentInput(
      id,
      payload,
      user,
      metadata.isStaffUser,
    );
    const data = await this.updateAppointmentByIdUseCase.execute(input);
    return { data };
  }

  @Delete(':id')
  async deleteAppointment(
    @Param() params: Record<string, unknown>,
    @AuthenticatedUser() user: ISessionUser,
    @GetMetadata() metadata: IGetMetadata,
  ) {
    const { id } = this.appointmentValidator.validateIdParam(params);
    const input = payloadToDeleteAppointmentInput(
      id,
      user,
      metadata.isStaffUser,
    );
    await this.deleteAppointmentByIdUseCase.execute(input);
    return { data: { success: true } };
  }
}
