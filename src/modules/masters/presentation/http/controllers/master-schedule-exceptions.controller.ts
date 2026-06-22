import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthenticatedUser } from 'src/modules/auth/presentation/decorators/authenticated-user.decorator';
import { JwtAuthGuard } from 'src/modules/auth/presentation/guards/jwt-auth.guard';
import { CreateMasterScheduleExceptionUseCase } from 'src/modules/masters/application/use-cases/master-schedule-exception/create-master-schedule-exception.use-case';
import { DeleteMasterScheduleExceptionByIdUseCase } from 'src/modules/masters/application/use-cases/master-schedule-exception/delete-master-schedule-exception-by-id.use-case';
import { GetMasterScheduleExceptionByIdUseCase } from 'src/modules/masters/application/use-cases/master-schedule-exception/get-master-schedule-exception-by-id.use-case';
import { GetMasterScheduleExceptionsUseCase } from 'src/modules/masters/application/use-cases/master-schedule-exception/get-master-schedule-exceptions.use-case';
import { UpdateMasterScheduleExceptionByIdUseCase } from 'src/modules/masters/application/use-cases/master-schedule-exception/update-master-schedule-exception-by-id.use-case';
import type { IGetMetadata } from 'src/modules/shared/domain/decorators/i-get-metadata';
import type { IRawQuery } from 'src/modules/shared/domain/i-query.dto';
import type { ISessionUser } from 'src/modules/shared/domain/i-session-user';
import { GetMetadata } from 'src/modules/shared/presentation/decorators/get-metadata';
import { payloadToCreateMasterScheduleExceptionInput } from '../mappers/master-schedule-exception/payload-to-create-master-schedule-exception-input';
import { payloadToDeleteMasterScheduleExceptionInput } from '../mappers/master-schedule-exception/payload-to-delete-master-schedule-exception-input';
import { payloadToGetMasterScheduleExceptionByIdInput } from '../mappers/master-schedule-exception/payload-to-get-master-schedule-exception-by-id-input';
import { payloadToUpdateMasterScheduleExceptionInput } from '../mappers/master-schedule-exception/payload-to-update-master-schedule-exception-input';
import { payloadToFindManyParams } from '../mappers/master-schedule-exception/payload-to-find-many-params.mapper';
import { mapGetMasterScheduleExceptionsHttpResponse } from '../response/map-get-master-schedule-exceptions-response';
import { MasterScheduleExceptionValidator } from '../validation/master-schedule-exception.validator';

@Controller({ path: 'master-schedule-exceptions', version: '1' })
@UseGuards(JwtAuthGuard)
export class MasterScheduleExceptionsController {
  constructor(
    private readonly getMasterScheduleExceptionsUseCase: GetMasterScheduleExceptionsUseCase,
    private readonly getMasterScheduleExceptionByIdUseCase: GetMasterScheduleExceptionByIdUseCase,
    private readonly createMasterScheduleExceptionUseCase: CreateMasterScheduleExceptionUseCase,
    private readonly updateMasterScheduleExceptionByIdUseCase: UpdateMasterScheduleExceptionByIdUseCase,
    private readonly deleteMasterScheduleExceptionByIdUseCase: DeleteMasterScheduleExceptionByIdUseCase,
    private readonly masterScheduleExceptionValidator: MasterScheduleExceptionValidator,
  ) {}

  @Get()
  async getMasterScheduleExceptions(
    @Query() query: IRawQuery,
    @GetMetadata() metadata: IGetMetadata,
  ) {
    const payload =
      this.masterScheduleExceptionValidator.validateGetMasterScheduleExceptionsQuery(
        query,
      );
    const params = payloadToFindManyParams(payload, metadata);
    const output = await this.getMasterScheduleExceptionsUseCase.execute(params);
    return mapGetMasterScheduleExceptionsHttpResponse(output, payload);
  }

  @Get(':id')
  async getMasterScheduleExceptionById(
    @Param() params: Record<string, unknown>,
    @Query() query: IRawQuery,
    @AuthenticatedUser() user: ISessionUser,
    @GetMetadata() metadata: IGetMetadata,
  ) {
    const { id } = this.masterScheduleExceptionValidator.validateIdParam(params);
    const queryPayload =
      this.masterScheduleExceptionValidator.validateGetByIdQuery(query);
    const input = payloadToGetMasterScheduleExceptionByIdInput(
      id,
      queryPayload,
      user,
      metadata.isStaffUser,
    );
    const item = await this.getMasterScheduleExceptionByIdUseCase.execute(input);
    return { data: item };
  }

  @Post()
  async createMasterScheduleException(
    @Body() body: Record<string, unknown>,
    @AuthenticatedUser() user: ISessionUser,
    @GetMetadata() metadata: IGetMetadata,
  ) {
    const payload =
      this.masterScheduleExceptionValidator.validateCreatePayload(body);
    const input = payloadToCreateMasterScheduleExceptionInput(
      payload,
      user,
      metadata.isStaffUser,
    );
    const data = await this.createMasterScheduleExceptionUseCase.execute(input);
    return { data };
  }

  @Patch(':id')
  async updateMasterScheduleException(
    @Param() params: Record<string, unknown>,
    @Body() body: Record<string, unknown>,
    @AuthenticatedUser() user: ISessionUser,
    @GetMetadata() metadata: IGetMetadata,
  ) {
    const { id } = this.masterScheduleExceptionValidator.validateIdParam(params);
    const payload =
      this.masterScheduleExceptionValidator.validateUpdatePayload(body);
    const input = payloadToUpdateMasterScheduleExceptionInput(
      id,
      payload,
      user,
      metadata.isStaffUser,
    );
    const data =
      await this.updateMasterScheduleExceptionByIdUseCase.execute(input);
    return { data };
  }

  @Delete(':id')
  async deleteMasterScheduleException(
    @Param() params: Record<string, unknown>,
    @AuthenticatedUser() user: ISessionUser,
    @GetMetadata() metadata: IGetMetadata,
  ) {
    const { id } = this.masterScheduleExceptionValidator.validateIdParam(params);
    const input = payloadToDeleteMasterScheduleExceptionInput(
      id,
      user,
      metadata.isStaffUser,
    );
    await this.deleteMasterScheduleExceptionByIdUseCase.execute(input);
    return { data: { success: true } };
  }
}
