import { Controller, Delete, Get, Patch, Post, UseGuards } from '@nestjs/common';
import { AuthenticatedUser } from '@modules/auth/presentation/decorators/authenticated-user.decorator';
import { JwtAuthGuard } from '@modules/auth/presentation/guards/jwt-auth.guard';
import { Authorize } from '@modules/authorization/presentation/decorators/authorize.decorator';
import { AuthorizeGuard } from '@modules/authorization/presentation/guards/authorize.guard';
import { CreateMasterScheduleExceptionUseCase } from '@modules/masters/application/use-cases/master-schedule-exception/create-master-schedule-exception.use-case';
import { DeleteMasterScheduleExceptionByIdUseCase } from '@modules/masters/application/use-cases/master-schedule-exception/delete-master-schedule-exception-by-id.use-case';
import { GetMasterScheduleExceptionByIdUseCase } from '@modules/masters/application/use-cases/master-schedule-exception/get-master-schedule-exception-by-id.use-case';
import { GetMasterScheduleExceptionsUseCase } from '@modules/masters/application/use-cases/master-schedule-exception/get-master-schedule-exceptions.use-case';
import { UpdateMasterScheduleExceptionByIdUseCase } from '@modules/masters/application/use-cases/master-schedule-exception/update-master-schedule-exception-by-id.use-case';
import { createMasterScheduleExceptionPayloadSchema } from '@modules/masters/presentation/http/validation/schemas/create-master-schedule-exception-payload.schema';
import type { ICreateMasterScheduleExceptionPayload } from '@modules/masters/presentation/http/validation/schemas/create-master-schedule-exception-payload.types';
import { getByIdQuerySchema } from '@modules/masters/presentation/http/validation/schemas/get-by-id-query.schema';
import type { IGetByIdQueryPayload } from '@modules/masters/presentation/http/validation/schemas/get-by-id-query.types';
import { getMasterScheduleExceptionsQuerySchema } from '@modules/masters/presentation/http/validation/schemas/get-master-schedule-exceptions-query.schema';
import type { IGetMasterScheduleExceptionsQueryPayload } from '@modules/masters/presentation/http/validation/schemas/get-master-schedule-exceptions-query.types';
import { idParamSchema } from '@modules/masters/presentation/http/validation/schemas/id-param.schema';
import type { IIdParamPayload } from '@modules/masters/presentation/http/validation/schemas/id-param.types';
import { updateMasterScheduleExceptionPayloadSchema } from '@modules/masters/presentation/http/validation/schemas/update-master-schedule-exception-payload.schema';
import type { IUpdateMasterScheduleExceptionPayload } from '@modules/masters/presentation/http/validation/schemas/update-master-schedule-exception-payload.types';
import type { IGetMetadata } from '@shared/domain/decorators/i-get-metadata';
import type { ISessionUser } from '@shared/domain/i-session-user';
import { GetMetadata } from '@shared/presentation/decorators/get-metadata';
import { HttpBody, HttpParams, HttpQuery } from '@shared/presentation/http/decorators';
import { normalizeIdParam } from '@shared/presentation/http/helpers/normalize-id-param';
import { normalizeListQueryRaw } from '@shared/presentation/http/helpers/normalize-list-query-raw';
import { payloadToCreateMasterScheduleExceptionInput } from '../mappers/master-schedule-exception/payload-to-create-master-schedule-exception-input';
import { payloadToDeleteMasterScheduleExceptionInput } from '../mappers/master-schedule-exception/payload-to-delete-master-schedule-exception-input';
import { payloadToFindManyParams } from '../mappers/master-schedule-exception/payload-to-find-many-params.mapper';
import { payloadToGetMasterScheduleExceptionByIdInput } from '../mappers/master-schedule-exception/payload-to-get-master-schedule-exception-by-id-input';
import { payloadToUpdateMasterScheduleExceptionInput } from '../mappers/master-schedule-exception/payload-to-update-master-schedule-exception-input';
import { mapCreateMasterScheduleExceptionHttpResponse } from '../response/map-create-master-schedule-exception-response';
import { mapDeleteMasterScheduleExceptionHttpResponse } from '../response/map-delete-master-schedule-exception-response';
import { mapGetMasterScheduleExceptionByIdHttpResponse } from '../response/map-get-master-schedule-exception-by-id-response';
import { mapGetMasterScheduleExceptionsHttpResponse } from '../response/map-get-master-schedule-exceptions-response';
import { mapUpdateMasterScheduleExceptionHttpResponse } from '../response/map-update-master-schedule-exception-response';

@Controller({ path: 'master-schedule-exceptions', version: '1' })
@UseGuards(JwtAuthGuard, AuthorizeGuard)
export class MasterScheduleExceptionsController {
  constructor(
    private readonly getMasterScheduleExceptionsUseCase: GetMasterScheduleExceptionsUseCase,
    private readonly getMasterScheduleExceptionByIdUseCase: GetMasterScheduleExceptionByIdUseCase,
    private readonly createMasterScheduleExceptionUseCase: CreateMasterScheduleExceptionUseCase,
    private readonly updateMasterScheduleExceptionByIdUseCase: UpdateMasterScheduleExceptionByIdUseCase,
    private readonly deleteMasterScheduleExceptionByIdUseCase: DeleteMasterScheduleExceptionByIdUseCase,
  ) {}

  @Get()
  @Authorize({ kind: 'authenticated' })
  async getMasterScheduleExceptions(
    @HttpQuery(getMasterScheduleExceptionsQuerySchema, {
      preprocess: normalizeListQueryRaw,
      errorMessage:
        'Некорректные параметры запроса списка исключений расписания мастера',
    })
    payload: IGetMasterScheduleExceptionsQueryPayload,
    @GetMetadata() metadata: IGetMetadata,
  ) {
    const params = payloadToFindManyParams(payload, metadata);
    const output =
      await this.getMasterScheduleExceptionsUseCase.execute(params);
    return mapGetMasterScheduleExceptionsHttpResponse(output, payload);
  }

  @Get(':id')
  @Authorize({ kind: 'authenticated' })
  async getMasterScheduleExceptionById(
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
    const input = payloadToGetMasterScheduleExceptionByIdInput(
      params.id,
      queryPayload,
      user,
      metadata.isStaffUser,
    );
    const item =
      await this.getMasterScheduleExceptionByIdUseCase.execute(input);
    return mapGetMasterScheduleExceptionByIdHttpResponse(item);
  }

  @Post()
  @Authorize({ kind: 'authenticated' })
  async createMasterScheduleException(
    @HttpBody(createMasterScheduleExceptionPayloadSchema, {
      errorMessage:
        'Некорректный payload создания исключения расписания мастера',
    })
    payload: ICreateMasterScheduleExceptionPayload,
    @AuthenticatedUser() user: ISessionUser,
    @GetMetadata() metadata: IGetMetadata,
  ) {
    const input = payloadToCreateMasterScheduleExceptionInput(
      payload,
      user,
      metadata.isStaffUser,
    );
    const output =
      await this.createMasterScheduleExceptionUseCase.execute(input);
    return mapCreateMasterScheduleExceptionHttpResponse(output);
  }

  @Patch(':id')
  @Authorize({ kind: 'authenticated' })
  async updateMasterScheduleException(
    @HttpParams(idParamSchema, {
      preprocess: normalizeIdParam,
      errorMessage: 'Некорректный идентификатор',
    })
    params: IIdParamPayload,
    @HttpBody(updateMasterScheduleExceptionPayloadSchema, {
      errorMessage:
        'Некорректный payload обновления исключения расписания мастера',
    })
    payload: IUpdateMasterScheduleExceptionPayload,
    @AuthenticatedUser() user: ISessionUser,
    @GetMetadata() metadata: IGetMetadata,
  ) {
    const input = payloadToUpdateMasterScheduleExceptionInput(
      params.id,
      payload,
      user,
      metadata.isStaffUser,
    );
    const output =
      await this.updateMasterScheduleExceptionByIdUseCase.execute(input);
    return mapUpdateMasterScheduleExceptionHttpResponse(output);
  }

  @Delete(':id')
  @Authorize({ kind: 'authenticated' })
  async deleteMasterScheduleException(
    @HttpParams(idParamSchema, {
      preprocess: normalizeIdParam,
      errorMessage: 'Некорректный идентификатор',
    })
    params: IIdParamPayload,
    @AuthenticatedUser() user: ISessionUser,
    @GetMetadata() metadata: IGetMetadata,
  ) {
    const input = payloadToDeleteMasterScheduleExceptionInput(
      params.id,
      user,
      metadata.isStaffUser,
    );
    await this.deleteMasterScheduleExceptionByIdUseCase.execute(input);
    return mapDeleteMasterScheduleExceptionHttpResponse();
  }
}
