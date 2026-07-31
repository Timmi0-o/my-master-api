import { Controller, Delete, Get, Patch, Post, UseGuards } from '@nestjs/common';
import { AuthenticatedUser } from '@modules/auth/presentation/decorators/authenticated-user.decorator';
import { JwtAuthGuard } from '@modules/auth/presentation/guards/jwt-auth.guard';
import { Permissions } from '@modules/authorization/domain/permissions/permission-names';
import { Authorize } from '@modules/authorization/presentation/decorators/authorize.decorator';
import { AuthorizeGuard } from '@modules/authorization/presentation/guards/authorize.guard';
import { CreateAppointmentUseCase } from '@modules/appointments/application/use-cases/appointment/create-appointment.use-case';
import { CancelAppointmentUseCase } from '@modules/appointments/application/use-cases/appointment/cancel-appointment.use-case';
import { CompleteAppointmentUseCase } from '@modules/appointments/application/use-cases/appointment/complete-appointment.use-case';
import { ConfirmAppointmentUseCase } from '@modules/appointments/application/use-cases/appointment/confirm-appointment.use-case';
import { DeleteAppointmentByIdUseCase } from '@modules/appointments/application/use-cases/appointment/delete-appointment-by-id.use-case';
import { GetAppointmentByIdUseCase } from '@modules/appointments/application/use-cases/appointment/get-appointment-by-id.use-case';
import { GetAppointmentsUseCase } from '@modules/appointments/application/use-cases/appointment/get-appointments.use-case';
import { GetMyAppointmentsUseCase } from '@modules/appointments/application/use-cases/appointment/get-my-appointments.use-case';
import { GetMyClientsAppointmentsUseCase } from '@modules/appointments/application/use-cases/appointment/get-my-clients-appointments.use-case';
import { UpdateAppointmentByIdUseCase } from '@modules/appointments/application/use-cases/appointment/update-appointment-by-id.use-case';
import { cancelAppointmentPayloadSchema } from '@modules/appointments/presentation/http/validation/schemas/cancel-appointment-payload.schema';
import type { ICancelAppointmentPayload } from '@modules/appointments/presentation/http/validation/schemas/cancel-appointment-payload.types';
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
import { requestParamsToCompleteAppointmentUseCaseInput } from '../request-mappers/appointment/request-params-to-complete-appointment-use-case-input';
import { requestParamsToConfirmAppointmentUseCaseInput } from '../request-mappers/appointment/request-params-to-confirm-appointment-use-case-input';
import { requestBodyToCancelAppointmentUseCaseInput } from '../request-mappers/appointment/request-body-to-cancel-appointment-use-case-input';
import { requestBodyToCreateAppointmentUseCaseInput } from '../request-mappers/appointment/request-body-to-create-appointment-use-case-input';
import { requestParamsToDeleteAppointmentUseCaseInput } from '../request-mappers/appointment/request-params-to-delete-appointment-use-case-input';
import { requestQueryParamsToFindManyParams } from '../request-mappers/appointment/request-query-params-to-find-many-params.mapper';
import { requestQueryParamsToGetAppointmentByIdUseCaseInput } from '../request-mappers/appointment/request-query-params-to-get-appointment-by-id-use-case-input';
import { findManyParamsToGetMyAppointmentsUseCaseInput } from '../request-mappers/appointment/find-many-params-to-get-my-appointments-use-case-input';
import { findManyParamsToGetMyClientsAppointmentsUseCaseInput } from '../request-mappers/appointment/find-many-params-to-get-my-clients-appointments-use-case-input';
import { requestBodyToUpdateAppointmentUseCaseInput } from '../request-mappers/appointment/request-body-to-update-appointment-use-case-input';
import { mapGetAppointmentsHttpResponse } from '../http-responses/map-get-appointments-response';
import { mapGetAppointmentByIdHttpResponse } from '../http-responses/map-get-appointment-by-id-response';
import { mapCreateAppointmentHttpResponse } from '../http-responses/map-create-appointment-response';
import { mapCancelAppointmentHttpResponse } from '../http-responses/map-cancel-appointment-response';
import { mapCompleteAppointmentHttpResponse } from '../http-responses/map-complete-appointment-response';
import { mapConfirmAppointmentHttpResponse } from '../http-responses/map-confirm-appointment-response';
import { mapUpdateAppointmentHttpResponse } from '../http-responses/map-update-appointment-response';
import { mapDeleteAppointmentHttpResponse } from '../http-responses/map-delete-appointment-response';

@Controller({ path: 'appointments', version: '1' })
@UseGuards(JwtAuthGuard, AuthorizeGuard)
export class AppointmentsController {
  constructor(
    private readonly getAppointmentsUseCase: GetAppointmentsUseCase,
    private readonly getMyAppointmentsUseCase: GetMyAppointmentsUseCase,
    private readonly getMyClientsAppointmentsUseCase: GetMyClientsAppointmentsUseCase,
    private readonly getAppointmentByIdUseCase: GetAppointmentByIdUseCase,
    private readonly createAppointmentUseCase: CreateAppointmentUseCase,
    private readonly confirmAppointmentUseCase: ConfirmAppointmentUseCase,
    private readonly cancelAppointmentUseCase: CancelAppointmentUseCase,
    private readonly completeAppointmentUseCase: CompleteAppointmentUseCase,
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
    queryParams: IGetAppointmentsQueryPayload,
    @AuthenticatedUser() user: ISessionUser,
    @GetMetadata() metadata: IGetMetadata,
  ) {
    const params = requestQueryParamsToFindManyParams(queryParams, metadata);
    const input = findManyParamsToGetMyAppointmentsUseCaseInput(params, user, metadata.isStaffUser);
    const output = await this.getMyAppointmentsUseCase.execute(input);
    return mapGetAppointmentsHttpResponse(output, queryParams);
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
    queryParams: IGetAppointmentsQueryPayload,
    @AuthenticatedUser() user: ISessionUser,
    @GetMetadata() metadata: IGetMetadata,
  ) {
    const params = requestQueryParamsToFindManyParams(queryParams, metadata);
    const input = findManyParamsToGetMyClientsAppointmentsUseCaseInput(
      params,
      user,
      metadata.isStaffUser,
    );
    const output = await this.getMyClientsAppointmentsUseCase.execute(input);
    return mapGetAppointmentsHttpResponse(output, queryParams);
  }

  @Get()
  @Authorize({ kind: 'staff-only' })
  async getAppointments(
    @HttpQuery(getAppointmentsQuerySchema, {
      preprocess: normalizeListQueryRaw,
      errorMessage: 'Некорректные параметры запроса списка записей',
    })
    queryParams: IGetAppointmentsQueryPayload,
    @GetMetadata() metadata: IGetMetadata,
  ) {
    const params = requestQueryParamsToFindManyParams(queryParams, metadata);
    const output = await this.getAppointmentsUseCase.execute(params);
    return mapGetAppointmentsHttpResponse(output, queryParams);
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
    const input = requestQueryParamsToGetAppointmentByIdUseCaseInput(
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
    const input = requestBodyToCreateAppointmentUseCaseInput(
      payload,
      user,
      metadata.isStaffUser,
    );
    const output = await this.createAppointmentUseCase.execute(input);
    return mapCreateAppointmentHttpResponse(output);
  }

  @Post(':id/confirm')
  @Authorize({ kind: 'authenticated' })
  async confirmAppointment(
    @HttpParams(idParamSchema, {
      preprocess: normalizeIdParam,
      errorMessage: 'Некорректный идентификатор',
    })
    params: IIdParamPayload,
    @AuthenticatedUser() user: ISessionUser,
    @GetMetadata() metadata: IGetMetadata,
  ) {
    const input = requestParamsToConfirmAppointmentUseCaseInput(
      params.id,
      user,
      metadata.isStaffUser,
    );
    const output = await this.confirmAppointmentUseCase.execute(input);
    return mapConfirmAppointmentHttpResponse(output);
  }

  @Post(':id/cancel')
  @Authorize({ kind: 'authenticated' })
  async cancelAppointment(
    @HttpParams(idParamSchema, {
      preprocess: normalizeIdParam,
      errorMessage: 'Некорректный идентификатор',
    })
    params: IIdParamPayload,
    @HttpBody(cancelAppointmentPayloadSchema, {
      errorMessage: 'Некорректный payload отмены записи',
      preprocess: (raw) => raw ?? {},
    })
    payload: ICancelAppointmentPayload,
    @AuthenticatedUser() user: ISessionUser,
    @GetMetadata() metadata: IGetMetadata,
  ) {
    const input = requestBodyToCancelAppointmentUseCaseInput(
      params.id,
      payload,
      user,
      metadata.isStaffUser,
    );
    const output = await this.cancelAppointmentUseCase.execute(input);
    return mapCancelAppointmentHttpResponse(output);
  }

  @Post(':id/complete')
  @Authorize({ kind: 'authenticated' })
  async completeAppointment(
    @HttpParams(idParamSchema, {
      preprocess: normalizeIdParam,
      errorMessage: 'Некорректный идентификатор',
    })
    params: IIdParamPayload,
    @AuthenticatedUser() user: ISessionUser,
    @GetMetadata() metadata: IGetMetadata,
  ) {
    const input = requestParamsToCompleteAppointmentUseCaseInput(
      params.id,
      user,
      metadata.isStaffUser,
    );
    const output = await this.completeAppointmentUseCase.execute(input);
    return mapCompleteAppointmentHttpResponse(output);
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
    const input = requestBodyToUpdateAppointmentUseCaseInput(
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
    const input = requestParamsToDeleteAppointmentUseCaseInput(
      params.id,
      user,
      metadata.isStaffUser,
    );
    await this.deleteAppointmentByIdUseCase.execute(input);
    return mapDeleteAppointmentHttpResponse();
  }
}
