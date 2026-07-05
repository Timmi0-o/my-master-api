import { Controller, Delete, Get, Patch, Post, UseGuards } from '@nestjs/common';
import { AuthenticatedUser } from '@modules/auth/presentation/decorators/authenticated-user.decorator';
import { JwtAuthGuard } from '@modules/auth/presentation/guards/jwt-auth.guard';
import { Permissions } from '@modules/authorization/domain/permissions/permission-names';
import { Authorize } from '@modules/authorization/presentation/decorators/authorize.decorator';
import { AuthorizeGuard } from '@modules/authorization/presentation/guards/authorize.guard';
import { CreateAppointmentUseCase } from '@modules/appointments/application/use-cases/appointment/create-appointment.use-case';
import { DeleteAppointmentByIdUseCase } from '@modules/appointments/application/use-cases/appointment/delete-appointment-by-id.use-case';
import { GetAppointmentByIdUseCase } from '@modules/appointments/application/use-cases/appointment/get-appointment-by-id.use-case';
import { GetAppointmentsUseCase } from '@modules/appointments/application/use-cases/appointment/get-appointments.use-case';
import { GetMyAppointmentsUseCase } from '@modules/appointments/application/use-cases/appointment/get-my-appointments.use-case';
import { GetMyClientsAppointmentsUseCase } from '@modules/appointments/application/use-cases/appointment/get-my-clients-appointments.use-case';
import { UpdateAppointmentByIdUseCase } from '@modules/appointments/application/use-cases/appointment/update-appointment-by-id.use-case';
import { createAppointmentPayloadSchema } from '@modules/appointments/presentation/http/validation/schemas/create-appointment-payload.schema';
import type { ICreateAppointmentPayload } from '@modules/appointments/presentation/http/validation/schemas/create-appointment-payload.types';
import { getAppointmentsQuerySchema } from '@modules/appointments/presentation/http/validation/schemas/get-appointments-query.schema';
import type { IGetAppointmentsQueryPayload } from '@modules/appointments/presentation/http/validation/schemas/get-appointments-query.types';
import { getByIdQuerySchema } from '@modules/appointments/presentation/http/validation/schemas/get-by-id-query.schema';
import type { IGetByIdQueryPayload } from '@modules/appointments/presentation/http/validation/schemas/get-by-id-query.types';
import { idParamSchema } from '@modules/appointments/presentation/http/validation/schemas/id-param.schema';
import type { IIdParamPayload } from '@modules/appointments/presentation/http/validation/schemas/id-param.types';
import { updateAppointmentPayloadSchema } from '@modules/appointments/presentation/http/validation/schemas/update-appointment-payload.schema';
import type { IUpdateAppointmentPayload } from '@modules/appointments/presentation/http/validation/schemas/update-appointment-payload.types';
import type { IGetMetadata } from '@shared/domain/decorators/i-get-metadata';
import type { ISessionUser } from '@shared/domain/i-session-user';
import { GetMetadata } from '@shared/presentation/decorators/get-metadata';
import { HttpBody, HttpParams, HttpQuery } from '@shared/presentation/http/decorators';
import { normalizeIdParam } from '@shared/presentation/http/helpers/normalize-id-param';
import { normalizeListQueryRaw } from '@shared/presentation/http/helpers/normalize-list-query-raw';
import { payloadToCreateAppointmentInput } from '../mappers/appointment/payload-to-create-appointment-input';
import { payloadToDeleteAppointmentInput } from '../mappers/appointment/payload-to-delete-appointment-input';
import { payloadToFindManyParams } from '../mappers/appointment/payload-to-find-many-params.mapper';
import { payloadToGetAppointmentByIdInput } from '../mappers/appointment/payload-to-get-appointment-by-id-input';
import { payloadToGetMyAppointmentsInput } from '../mappers/appointment/payload-to-get-my-appointments-input';
import { payloadToGetMyClientsAppointmentsInput } from '../mappers/appointment/payload-to-get-my-clients-appointments-input';
import { payloadToUpdateAppointmentInput } from '../mappers/appointment/payload-to-update-appointment-input';
import { mapGetAppointmentsHttpResponse } from '../response/map-get-appointments-response';
import { mapGetAppointmentByIdHttpResponse } from '../response/map-get-appointment-by-id-response';
import { mapCreateAppointmentHttpResponse } from '../response/map-create-appointment-response';
import { mapUpdateAppointmentHttpResponse } from '../response/map-update-appointment-response';
import { mapDeleteAppointmentHttpResponse } from '../response/map-delete-appointment-response';

@Controller({ path: 'appointments', version: '1' })
@UseGuards(JwtAuthGuard, AuthorizeGuard)
export class AppointmentsController {
  constructor(
    private readonly getAppointmentsUseCase: GetAppointmentsUseCase,
    private readonly getMyAppointmentsUseCase: GetMyAppointmentsUseCase,
    private readonly getMyClientsAppointmentsUseCase: GetMyClientsAppointmentsUseCase,
    private readonly getAppointmentByIdUseCase: GetAppointmentByIdUseCase,
    private readonly createAppointmentUseCase: CreateAppointmentUseCase,
    private readonly updateAppointmentByIdUseCase: UpdateAppointmentByIdUseCase,
    private readonly deleteAppointmentByIdUseCase: DeleteAppointmentByIdUseCase,
  ) {}

  @Get('me')
  @Authorize({
    kind: 'permissions',
    permissions: [Permissions.appointments.read],
  })
  async getMyAppointments(
    @HttpQuery(getAppointmentsQuerySchema, {
      preprocess: normalizeListQueryRaw,
      errorMessage: 'Некорректные параметры запроса списка записей',
    })
    payload: IGetAppointmentsQueryPayload,
    @AuthenticatedUser() user: ISessionUser,
    @GetMetadata() metadata: IGetMetadata,
  ) {
    const params = payloadToFindManyParams(payload, metadata);
    const input = payloadToGetMyAppointmentsInput(params, user, metadata.isStaffUser);
    const output = await this.getMyAppointmentsUseCase.execute(input);
    return mapGetAppointmentsHttpResponse(output, payload);
  }

  @Get('my-clients')
  @Authorize({
    kind: 'permissions',
    permissions: [Permissions.appointments.read],
  })
  async getMyClientsAppointments(
    @HttpQuery(getAppointmentsQuerySchema, {
      preprocess: normalizeListQueryRaw,
      errorMessage: 'Некорректные параметры запроса списка записей',
    })
    payload: IGetAppointmentsQueryPayload,
    @AuthenticatedUser() user: ISessionUser,
    @GetMetadata() metadata: IGetMetadata,
  ) {
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
  @Authorize({ kind: 'staff-only' })
  async getAppointments(
    @HttpQuery(getAppointmentsQuerySchema, {
      preprocess: normalizeListQueryRaw,
      errorMessage: 'Некорректные параметры запроса списка записей',
    })
    payload: IGetAppointmentsQueryPayload,
    @GetMetadata() metadata: IGetMetadata,
  ) {
    const params = payloadToFindManyParams(payload, metadata);
    const output = await this.getAppointmentsUseCase.execute(params);
    return mapGetAppointmentsHttpResponse(output, payload);
  }

  @Get(':id')
  @Authorize({
    kind: 'permissions',
    permissions: [Permissions.appointments.read],
  })
  async getAppointmentById(
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
    const input = payloadToGetAppointmentByIdInput(
      params.id,
      queryPayload,
      user,
      metadata.isStaffUser,
    );
    const item = await this.getAppointmentByIdUseCase.execute(input);
    return mapGetAppointmentByIdHttpResponse(item);
  }

  @Post()
  @Authorize({
    kind: 'permissions',
    permissions: [Permissions.appointments.create],
  })
  async createAppointment(
    @HttpBody(createAppointmentPayloadSchema, {
      errorMessage: 'Некорректный payload создания записи',
    })
    payload: ICreateAppointmentPayload,
    @AuthenticatedUser() user: ISessionUser,
    @GetMetadata() metadata: IGetMetadata,
  ) {
    const input = payloadToCreateAppointmentInput(
      payload,
      user,
      metadata.isStaffUser,
    );
    const output = await this.createAppointmentUseCase.execute(input);
    return mapCreateAppointmentHttpResponse(output);
  }

  @Patch(':id')
  @Authorize({
    kind: 'permissions',
    permissions: [Permissions.appointments.update],
  })
  async updateAppointment(
    @HttpParams(idParamSchema, {
      preprocess: normalizeIdParam,
      errorMessage: 'Некорректный идентификатор',
    })
    params: IIdParamPayload,
    @HttpBody(updateAppointmentPayloadSchema, {
      errorMessage: 'Некорректный payload обновления записи',
    })
    payload: IUpdateAppointmentPayload,
    @AuthenticatedUser() user: ISessionUser,
    @GetMetadata() metadata: IGetMetadata,
  ) {
    const input = payloadToUpdateAppointmentInput(
      params.id,
      payload,
      user,
      metadata.isStaffUser,
    );
    const output = await this.updateAppointmentByIdUseCase.execute(input);
    return mapUpdateAppointmentHttpResponse(output);
  }

  @Delete(':id')
  @Authorize({ kind: 'authenticated' })
  async deleteAppointment(
    @HttpParams(idParamSchema, {
      preprocess: normalizeIdParam,
      errorMessage: 'Некорректный идентификатор',
    })
    params: IIdParamPayload,
    @AuthenticatedUser() user: ISessionUser,
    @GetMetadata() metadata: IGetMetadata,
  ) {
    const input = payloadToDeleteAppointmentInput(
      params.id,
      user,
      metadata.isStaffUser,
    );
    await this.deleteAppointmentByIdUseCase.execute(input);
    return mapDeleteAppointmentHttpResponse();
  }
}
