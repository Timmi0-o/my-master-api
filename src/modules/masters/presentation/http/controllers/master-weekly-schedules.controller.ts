import { Controller, Delete, Get, Patch, Post, UseGuards } from '@nestjs/common';
import { AuthenticatedUser } from '@modules/auth/presentation/decorators/authenticated-user.decorator';
import { JwtAuthGuard } from '@modules/auth/presentation/guards/jwt-auth.guard';
import { Authorize } from '@modules/authorization/presentation/decorators/authorize.decorator';
import { AuthorizeGuard } from '@modules/authorization/presentation/guards/authorize.guard';
import { CreateMasterWeeklyScheduleUseCase } from '@modules/masters/application/use-cases/master-weekly-schedule/create-master-weekly-schedule.use-case';
import { DeleteMasterWeeklyScheduleByIdUseCase } from '@modules/masters/application/use-cases/master-weekly-schedule/delete-master-weekly-schedule-by-id.use-case';
import { GetMasterWeeklyScheduleByIdUseCase } from '@modules/masters/application/use-cases/master-weekly-schedule/get-master-weekly-schedule-by-id.use-case';
import { GetMasterWeeklySchedulesUseCase } from '@modules/masters/application/use-cases/master-weekly-schedule/get-master-weekly-schedules.use-case';
import { UpdateMasterWeeklyScheduleByIdUseCase } from '@modules/masters/application/use-cases/master-weekly-schedule/update-master-weekly-schedule-by-id.use-case';
import { createMasterWeeklySchedulePayloadSchema } from '@modules/masters/presentation/http/validation/schemas/create-master-weekly-schedule-payload.schema';
import type { ICreateMasterWeeklySchedulePayload } from '@modules/masters/presentation/http/validation/schemas/create-master-weekly-schedule-payload.types';
import { getByIdQuerySchema } from '@modules/masters/presentation/http/validation/schemas/get-by-id-query.schema';
import type { IGetByIdQueryPayload } from '@modules/masters/presentation/http/validation/schemas/get-by-id-query.types';
import { getMasterWeeklySchedulesQuerySchema } from '@modules/masters/presentation/http/validation/schemas/get-master-weekly-schedules-query.schema';
import type { IGetMasterWeeklySchedulesQueryPayload } from '@modules/masters/presentation/http/validation/schemas/get-master-weekly-schedules-query.types';
import { idParamSchema } from '@modules/masters/presentation/http/validation/schemas/id-param.schema';
import type { IIdParamPayload } from '@modules/masters/presentation/http/validation/schemas/id-param.types';
import { updateMasterWeeklySchedulePayloadSchema } from '@modules/masters/presentation/http/validation/schemas/update-master-weekly-schedule-payload.schema';
import type { IUpdateMasterWeeklySchedulePayload } from '@modules/masters/presentation/http/validation/schemas/update-master-weekly-schedule-payload.types';
import type { IGetMetadata } from '@shared/domain/decorators/i-get-metadata';
import type { ISessionUser } from '@shared/domain/i-session-user';
import { GetMetadata } from '@shared/presentation/decorators/get-metadata';
import { HttpBody, HttpParams, HttpQuery } from '@shared/presentation/http/decorators';
import { normalizeIdParam } from '@shared/presentation/http/helpers/normalize-id-param';
import { normalizeListQueryRaw } from '@shared/presentation/http/helpers/normalize-list-query-raw';
import { requestBodyToCreateMasterWeeklyScheduleUseCaseInput } from '../request-mappers/master-weekly-schedule/request-body-to-create-master-weekly-schedule-use-case-input';
import { requestParamsToDeleteMasterWeeklyScheduleUseCaseInput } from '../request-mappers/master-weekly-schedule/request-params-to-delete-master-weekly-schedule-use-case-input';
import { requestQueryParamsToFindManyParams } from '../request-mappers/master-weekly-schedule/request-query-params-to-find-many-params.mapper';
import { requestQueryParamsToGetMasterWeeklyScheduleByIdUseCaseInput } from '../request-mappers/master-weekly-schedule/request-query-params-to-get-master-weekly-schedule-by-id-use-case-input';
import { requestBodyToUpdateMasterWeeklyScheduleUseCaseInput } from '../request-mappers/master-weekly-schedule/request-body-to-update-master-weekly-schedule-use-case-input';
import { mapCreateMasterWeeklyScheduleHttpResponse } from '../http-responses/map-create-master-weekly-schedule-response';
import { mapDeleteMasterWeeklyScheduleHttpResponse } from '../http-responses/map-delete-master-weekly-schedule-response';
import { mapGetMasterWeeklyScheduleByIdHttpResponse } from '../http-responses/map-get-master-weekly-schedule-by-id-response';
import { mapGetMasterWeeklySchedulesHttpResponse } from '../http-responses/map-get-master-weekly-schedules-response';
import { mapUpdateMasterWeeklyScheduleHttpResponse } from '../http-responses/map-update-master-weekly-schedule-response';

@Controller({ path: 'master-weekly-schedules', version: '1' })
@UseGuards(JwtAuthGuard, AuthorizeGuard)
export class MasterWeeklySchedulesController {
  constructor(
    private readonly getMasterWeeklySchedulesUseCase: GetMasterWeeklySchedulesUseCase,
    private readonly getMasterWeeklyScheduleByIdUseCase: GetMasterWeeklyScheduleByIdUseCase,
    private readonly createMasterWeeklyScheduleUseCase: CreateMasterWeeklyScheduleUseCase,
    private readonly updateMasterWeeklyScheduleByIdUseCase: UpdateMasterWeeklyScheduleByIdUseCase,
    private readonly deleteMasterWeeklyScheduleByIdUseCase: DeleteMasterWeeklyScheduleByIdUseCase,
  ) {}

  @Get()
  @Authorize({ kind: 'authenticated' })
  async getMasterWeeklySchedules(
    @HttpQuery(getMasterWeeklySchedulesQuerySchema, {
      preprocess: normalizeListQueryRaw,
      errorMessage:
        'Некорректные параметры запроса списка недельного расписания мастера',
    })
    queryParams: IGetMasterWeeklySchedulesQueryPayload,
    @GetMetadata() metadata: IGetMetadata,
  ) {
    const params = requestQueryParamsToFindManyParams(queryParams, metadata);
    const output = await this.getMasterWeeklySchedulesUseCase.execute(params);
    return mapGetMasterWeeklySchedulesHttpResponse(output, queryParams);
  }

  @Get(':id')
  @Authorize({ kind: 'authenticated' })
  async getMasterWeeklyScheduleById(
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
    const input = requestQueryParamsToGetMasterWeeklyScheduleByIdUseCaseInput(
      params.id,
      queryPayload,
      user,
      metadata.isStaffUser,
    );
    const item = await this.getMasterWeeklyScheduleByIdUseCase.execute(input);
    return mapGetMasterWeeklyScheduleByIdHttpResponse(item);
  }

  @Post()
  @Authorize({ kind: 'authenticated' })
  async createMasterWeeklySchedule(
    @HttpBody(createMasterWeeklySchedulePayloadSchema, {
      errorMessage:
        'Некорректный payload создания интервала недельного расписания',
    })
    payload: ICreateMasterWeeklySchedulePayload,
    @AuthenticatedUser() user: ISessionUser,
    @GetMetadata() metadata: IGetMetadata,
  ) {
    const input = requestBodyToCreateMasterWeeklyScheduleUseCaseInput(
      payload,
      user,
      metadata.isStaffUser,
    );
    const output = await this.createMasterWeeklyScheduleUseCase.execute(input);
    return mapCreateMasterWeeklyScheduleHttpResponse(output);
  }

  @Patch(':id')
  @Authorize({ kind: 'authenticated' })
  async updateMasterWeeklySchedule(
    @HttpParams(idParamSchema, {
      preprocess: normalizeIdParam,
      errorMessage: 'Некорректный идентификатор',
    })
    params: IIdParamPayload,
    @HttpBody(updateMasterWeeklySchedulePayloadSchema, {
      errorMessage:
        'Некорректный payload обновления интервала недельного расписания',
    })
    payload: IUpdateMasterWeeklySchedulePayload,
    @AuthenticatedUser() user: ISessionUser,
    @GetMetadata() metadata: IGetMetadata,
  ) {
    const input = requestBodyToUpdateMasterWeeklyScheduleUseCaseInput(
      params.id,
      payload,
      user,
      metadata.isStaffUser,
    );
    const output =
      await this.updateMasterWeeklyScheduleByIdUseCase.execute(input);
    return mapUpdateMasterWeeklyScheduleHttpResponse(output);
  }

  @Delete(':id')
  @Authorize({ kind: 'authenticated' })
  async deleteMasterWeeklySchedule(
    @HttpParams(idParamSchema, {
      preprocess: normalizeIdParam,
      errorMessage: 'Некорректный идентификатор',
    })
    params: IIdParamPayload,
    @AuthenticatedUser() user: ISessionUser,
    @GetMetadata() metadata: IGetMetadata,
  ) {
    const input = requestParamsToDeleteMasterWeeklyScheduleUseCaseInput(
      params.id,
      user,
      metadata.isStaffUser,
    );
    await this.deleteMasterWeeklyScheduleByIdUseCase.execute(input);
    return mapDeleteMasterWeeklyScheduleHttpResponse();
  }
}
