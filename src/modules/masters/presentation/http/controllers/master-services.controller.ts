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
import { CreateMasterServiceUseCase } from 'src/modules/masters/application/use-cases/master-service/create-master-service.use-case';
import { DeleteMasterServiceByIdUseCase } from 'src/modules/masters/application/use-cases/master-service/delete-master-service-by-id.use-case';
import { GetMasterServiceAvailableSlotsUseCase } from 'src/modules/masters/application/use-cases/master-service/get-master-service-available-slots.use-case';
import { GetMasterServiceByIdUseCase } from 'src/modules/masters/application/use-cases/master-service/get-master-service-by-id.use-case';
import { GetMasterServicesUseCase } from 'src/modules/masters/application/use-cases/master-service/get-master-services.use-case';
import { UpdateMasterServiceByIdUseCase } from 'src/modules/masters/application/use-cases/master-service/update-master-service-by-id.use-case';
import type { IGetMetadata } from 'src/modules/shared/domain/decorators/i-get-metadata';
import type { IRawQuery } from 'src/modules/shared/domain/i-query.dto';
import type { ISessionUser } from 'src/modules/shared/domain/i-session-user';
import { GetMetadata } from 'src/modules/shared/presentation/decorators/get-metadata';
import { payloadToCreateMasterServiceInput } from '../mappers/master-service/payload-to-create-master-service-input';
import { payloadToDeleteMasterServiceInput } from '../mappers/master-service/payload-to-delete-master-service-input';
import { payloadToFindManyParams } from '../mappers/master-service/payload-to-find-many-params.mapper';
import { payloadToGetMasterServiceByIdInput } from '../mappers/master-service/payload-to-get-master-service-by-id-input';
import { payloadToUpdateMasterServiceInput } from '../mappers/master-service/payload-to-update-master-service-input';
import { mapGetMasterServicesHttpResponse } from '../response/map-get-master-services-response';
import { MasterServiceValidator } from '../validation/master-service.validator';

@Controller({ path: 'master-services', version: '1' })
export class MasterServicesController {
  constructor(
    private readonly getMasterServicesUseCase: GetMasterServicesUseCase,
    private readonly getMasterServiceByIdUseCase: GetMasterServiceByIdUseCase,
    private readonly createMasterServiceUseCase: CreateMasterServiceUseCase,
    private readonly updateMasterServiceByIdUseCase: UpdateMasterServiceByIdUseCase,
    private readonly deleteMasterServiceByIdUseCase: DeleteMasterServiceByIdUseCase,
    private readonly getMasterServiceAvailableSlotsUseCase: GetMasterServiceAvailableSlotsUseCase,
    private readonly masterServiceValidator: MasterServiceValidator,
  ) {}

  @Get()
  async getMasterServices(
    @Query() query: IRawQuery,
    @GetMetadata() metadata: IGetMetadata,
  ) {
    const payload =
      this.masterServiceValidator.validateGetMasterServicesQuery(query);
    const params = payloadToFindManyParams(payload, metadata);
    const output = await this.getMasterServicesUseCase.execute(params);
    return mapGetMasterServicesHttpResponse(output, payload);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id/available-slots')
  async getMasterServiceAvailableSlots(
    @Param() params: Record<string, unknown>,
    @Query() query: IRawQuery,
  ) {
    const { id } = this.masterServiceValidator.validateIdParam(params);
    const queryPayload =
      this.masterServiceValidator.validateGetAvailableSlotsQuery(query);
    const data = await this.getMasterServiceAvailableSlotsUseCase.execute({
      masterServiceId: id,
      date: queryPayload.date,
    });
    return { data };
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getMasterServiceById(
    @Param() params: Record<string, unknown>,
    @Query() query: IRawQuery,
    @AuthenticatedUser() user: ISessionUser,
    @GetMetadata() metadata: IGetMetadata,
  ) {
    const { id } = this.masterServiceValidator.validateIdParam(params);
    const queryPayload =
      this.masterServiceValidator.validateGetByIdQuery(query);
    const input = payloadToGetMasterServiceByIdInput(
      id,
      queryPayload,
      user,
      metadata.isStaffUser,
    );
    const item = await this.getMasterServiceByIdUseCase.execute(input);
    return { data: item };
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async createMasterService(
    @Body() body: Record<string, unknown>,
    @AuthenticatedUser() user: ISessionUser,
    @GetMetadata() metadata: IGetMetadata,
  ) {
    const payload = this.masterServiceValidator.validateCreatePayload(body);
    const input = payloadToCreateMasterServiceInput(
      payload,
      user,
      metadata.isStaffUser,
    );
    const data = await this.createMasterServiceUseCase.execute(input);
    return { data };
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async updateMasterService(
    @Param() params: Record<string, unknown>,
    @Body() body: Record<string, unknown>,
    @AuthenticatedUser() user: ISessionUser,
    @GetMetadata() metadata: IGetMetadata,
  ) {
    const { id } = this.masterServiceValidator.validateIdParam(params);
    const payload = this.masterServiceValidator.validateUpdatePayload(body);
    const input = payloadToUpdateMasterServiceInput(
      id,
      payload,
      user,
      metadata.isStaffUser,
    );
    const data = await this.updateMasterServiceByIdUseCase.execute(input);
    return { data };
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async deleteMasterService(
    @Param() params: Record<string, unknown>,
    @AuthenticatedUser() user: ISessionUser,
    @GetMetadata() metadata: IGetMetadata,
  ) {
    const { id } = this.masterServiceValidator.validateIdParam(params);
    const input = payloadToDeleteMasterServiceInput(
      id,
      user,
      metadata.isStaffUser,
    );
    await this.deleteMasterServiceByIdUseCase.execute(input);
    return { data: { success: true } };
  }
}
