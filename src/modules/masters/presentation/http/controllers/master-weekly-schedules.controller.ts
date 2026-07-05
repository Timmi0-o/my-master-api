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
import { payloadToCreateMasterWeeklyScheduleInput } from '../mappers/master-weekly-schedule/payload-to-create-master-weekly-schedule-input';
import { payloadToDeleteMasterWeeklyScheduleInput } from '../mappers/master-weekly-schedule/payload-to-delete-master-weekly-schedule-input';
import { payloadToFindManyParams } from '../mappers/master-weekly-schedule/payload-to-find-many-params.mapper';
import { payloadToGetMasterWeeklyScheduleByIdInput } from '../mappers/master-weekly-schedule/payload-to-get-master-weekly-schedule-by-id-input';
import { payloadToUpdateMasterWeeklyScheduleInput } from '../mappers/master-weekly-schedule/payload-to-update-master-weekly-schedule-input';
import { mapCreateMasterWeeklyScheduleHttpResponse } from '../response/map-create-master-weekly-schedule-response';
import { mapDeleteMasterWeeklyScheduleHttpResponse } from '../response/map-delete-master-weekly-schedule-response';
import { mapGetMasterWeeklyScheduleByIdHttpResponse } from '../response/map-get-master-weekly-schedule-by-id-response';
import { mapGetMasterWeeklySchedulesHttpResponse } from '../response/map-get-master-weekly-schedules-response';
import { mapUpdateMasterWeeklyScheduleHttpResponse } from '../response/map-update-master-weekly-schedule-response';

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
    payload: IGetMasterWeeklySchedulesQueryPayload,
    @GetMetadata() metadata: IGetMetadata,
  ) {
    const params = payloadToFindManyParams(payload, metadata);
    const output = await this.getMasterWeeklySchedulesUseCase.execute(params);
    return mapGetMasterWeeklySchedulesHttpResponse(output, payload);
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
    const input = payloadToGetMasterWeeklyScheduleByIdInput(
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
    const input = payloadToCreateMasterWeeklyScheduleInput(
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
    const input = payloadToUpdateMasterWeeklyScheduleInput(
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
    const input = payloadToDeleteMasterWeeklyScheduleInput(
      params.id,
      user,
      metadata.isStaffUser,
    );
    await this.deleteMasterWeeklyScheduleByIdUseCase.execute(input);
    return mapDeleteMasterWeeklyScheduleHttpResponse();
  }
}
