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
import { CreateMasterWeeklyScheduleUseCase } from 'src/modules/masters/application/use-cases/master-weekly-schedule/create-master-weekly-schedule.use-case';
import { DeleteMasterWeeklyScheduleByIdUseCase } from 'src/modules/masters/application/use-cases/master-weekly-schedule/delete-master-weekly-schedule-by-id.use-case';
import { GetMasterWeeklyScheduleByIdUseCase } from 'src/modules/masters/application/use-cases/master-weekly-schedule/get-master-weekly-schedule-by-id.use-case';
import { GetMasterWeeklySchedulesUseCase } from 'src/modules/masters/application/use-cases/master-weekly-schedule/get-master-weekly-schedules.use-case';
import { UpdateMasterWeeklyScheduleByIdUseCase } from 'src/modules/masters/application/use-cases/master-weekly-schedule/update-master-weekly-schedule-by-id.use-case';
import type { IGetMetadata } from 'src/modules/shared/domain/decorators/i-get-metadata';
import type { IRawQuery } from 'src/modules/shared/domain/i-query.dto';
import type { ISessionUser } from 'src/modules/shared/domain/i-session-user';
import { GetMetadata } from 'src/modules/shared/presentation/decorators/get-metadata';
import { payloadToCreateMasterWeeklyScheduleInput } from '../mappers/master-weekly-schedule/payload-to-create-master-weekly-schedule-input';
import { payloadToDeleteMasterWeeklyScheduleInput } from '../mappers/master-weekly-schedule/payload-to-delete-master-weekly-schedule-input';
import { payloadToGetMasterWeeklyScheduleByIdInput } from '../mappers/master-weekly-schedule/payload-to-get-master-weekly-schedule-by-id-input';
import { payloadToUpdateMasterWeeklyScheduleInput } from '../mappers/master-weekly-schedule/payload-to-update-master-weekly-schedule-input';
import { payloadToFindManyParams } from '../mappers/master-weekly-schedule/payload-to-find-many-params.mapper';
import { mapGetMasterWeeklySchedulesHttpResponse } from '../response/map-get-master-weekly-schedules-response';
import { MasterWeeklyScheduleValidator } from '../validation/master-weekly-schedule.validator';

@Controller({ path: 'master-weekly-schedules', version: '1' })
@UseGuards(JwtAuthGuard)
export class MasterWeeklySchedulesController {
  constructor(
    private readonly getMasterWeeklySchedulesUseCase: GetMasterWeeklySchedulesUseCase,
    private readonly getMasterWeeklyScheduleByIdUseCase: GetMasterWeeklyScheduleByIdUseCase,
    private readonly createMasterWeeklyScheduleUseCase: CreateMasterWeeklyScheduleUseCase,
    private readonly updateMasterWeeklyScheduleByIdUseCase: UpdateMasterWeeklyScheduleByIdUseCase,
    private readonly deleteMasterWeeklyScheduleByIdUseCase: DeleteMasterWeeklyScheduleByIdUseCase,
    private readonly masterWeeklyScheduleValidator: MasterWeeklyScheduleValidator,
  ) {}

  @Get()
  async getMasterWeeklySchedules(
    @Query() query: IRawQuery,
    @GetMetadata() metadata: IGetMetadata,
  ) {
    const payload =
      this.masterWeeklyScheduleValidator.validateGetMasterWeeklySchedulesQuery(
        query,
      );
    const params = payloadToFindManyParams(payload, metadata);
    const output = await this.getMasterWeeklySchedulesUseCase.execute(params);
    return mapGetMasterWeeklySchedulesHttpResponse(output, payload);
  }

  @Get(':id')
  async getMasterWeeklyScheduleById(
    @Param() params: Record<string, unknown>,
    @Query() query: IRawQuery,
    @AuthenticatedUser() user: ISessionUser,
    @GetMetadata() metadata: IGetMetadata,
  ) {
    const { id } = this.masterWeeklyScheduleValidator.validateIdParam(params);
    const queryPayload =
      this.masterWeeklyScheduleValidator.validateGetByIdQuery(query);
    const input = payloadToGetMasterWeeklyScheduleByIdInput(
      id,
      queryPayload,
      user,
      metadata.isStaffUser,
    );
    const item = await this.getMasterWeeklyScheduleByIdUseCase.execute(input);
    return { data: item };
  }

  @Post()
  async createMasterWeeklySchedule(
    @Body() body: Record<string, unknown>,
    @AuthenticatedUser() user: ISessionUser,
    @GetMetadata() metadata: IGetMetadata,
  ) {
    const payload =
      this.masterWeeklyScheduleValidator.validateCreatePayload(body);
    const input = payloadToCreateMasterWeeklyScheduleInput(
      payload,
      user,
      metadata.isStaffUser,
    );
    const data = await this.createMasterWeeklyScheduleUseCase.execute(input);
    return { data };
  }

  @Patch(':id')
  async updateMasterWeeklySchedule(
    @Param() params: Record<string, unknown>,
    @Body() body: Record<string, unknown>,
    @AuthenticatedUser() user: ISessionUser,
    @GetMetadata() metadata: IGetMetadata,
  ) {
    const { id } = this.masterWeeklyScheduleValidator.validateIdParam(params);
    const payload =
      this.masterWeeklyScheduleValidator.validateUpdatePayload(body);
    const input = payloadToUpdateMasterWeeklyScheduleInput(
      id,
      payload,
      user,
      metadata.isStaffUser,
    );
    const data =
      await this.updateMasterWeeklyScheduleByIdUseCase.execute(input);
    return { data };
  }

  @Delete(':id')
  async deleteMasterWeeklySchedule(
    @Param() params: Record<string, unknown>,
    @AuthenticatedUser() user: ISessionUser,
    @GetMetadata() metadata: IGetMetadata,
  ) {
    const { id } = this.masterWeeklyScheduleValidator.validateIdParam(params);
    const input = payloadToDeleteMasterWeeklyScheduleInput(
      id,
      user,
      metadata.isStaffUser,
    );
    await this.deleteMasterWeeklyScheduleByIdUseCase.execute(input);
    return { data: { success: true } };
  }
}
