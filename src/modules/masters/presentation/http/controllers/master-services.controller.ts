import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UnauthorizedException,
  UseFilters,
  UseGuards,
} from '@nestjs/common';
import { CurrentUser } from 'src/modules/auth/presentation/decorators/current-user.decorator';
import { JwtAuthGuard } from 'src/modules/auth/presentation/guards/jwt-auth.guard';
import { CreateMasterServiceUseCase } from 'src/modules/masters/application/use-cases/master-service/create-master-service.use-case';
import { DeleteMasterServiceByIdUseCase } from 'src/modules/masters/application/use-cases/master-service/delete-master-service-by-id.use-case';
import { GetMasterServiceByIdUseCase } from 'src/modules/masters/application/use-cases/master-service/get-master-service-by-id.use-case';
import { GetMasterServicesUseCase } from 'src/modules/masters/application/use-cases/master-service/get-master-services.use-case';
import { UpdateMasterServiceByIdUseCase } from 'src/modules/masters/application/use-cases/master-service/update-master-service-by-id.use-case';
import type { IGetMetadata } from 'src/modules/shared/domain/decorators/i-get-metadata';
import type { IRawQuery } from 'src/modules/shared/domain/i-query.dto';
import type { ISessionUser } from 'src/modules/shared/domain/i-session-user';
import { DomainExceptionFilter } from 'src/modules/shared/infrastructure/filters/domain-exception.filter';
import { GetMetadata } from 'src/modules/shared/presentation/decorators/get-metadata';
import { masterServicePresetToSelectOptions } from '../mappers/master-service-preset-to-select-options.mapper';
import { masterServiceQueryToFindManyParams } from '../mappers/master-service-query-to-find-many-params.mapper';
import { mapGetMasterServicesHttpResponse } from '../response/map-get-master-services-response';
import { MasterServiceValidator } from '../validation/master-service.validator';

@Controller({ path: 'master-services', version: '1' })
@UseFilters(DomainExceptionFilter)
@UseGuards(JwtAuthGuard)
export class MasterServicesController {
  constructor(
    private readonly getMasterServicesUseCase: GetMasterServicesUseCase,
    private readonly getMasterServiceByIdUseCase: GetMasterServiceByIdUseCase,
    private readonly createMasterServiceUseCase: CreateMasterServiceUseCase,
    private readonly updateMasterServiceByIdUseCase: UpdateMasterServiceByIdUseCase,
    private readonly deleteMasterServiceByIdUseCase: DeleteMasterServiceByIdUseCase,
    private readonly masterServiceValidator: MasterServiceValidator,
  ) {}

  @Get()
  async getMasterServices(
    @Query() query: IRawQuery,
    @GetMetadata() metadata: IGetMetadata,
  ) {
    const payload =
      this.masterServiceValidator.validateGetMasterServicesQuery(query);
    const params = masterServiceQueryToFindManyParams(payload, metadata);
    const output = await this.getMasterServicesUseCase.execute(params);
    return mapGetMasterServicesHttpResponse(output, payload);
  }

  @Get(':id')
  async getMasterServiceById(
    @Param() params: Record<string, unknown>,
    @Query() query: IRawQuery,
    @GetMetadata() metadata: IGetMetadata,
  ) {
    const { id } = this.masterServiceValidator.validateIdParam(params);
    const queryPayload =
      this.masterServiceValidator.validateGetByIdQuery(query);
    const item = await this.getMasterServiceByIdUseCase.execute(
      id,
      metadata.isStaffUser,
      {
        selectOptions: masterServicePresetToSelectOptions(
          queryPayload.preset,
          metadata.isStaffUser,
        ),
      },
    );
    return { data: item };
  }

  @Post()
  async createMasterService(
    @Body() body: Record<string, unknown>,
    @CurrentUser() user: ISessionUser | null,
    @GetMetadata() metadata: IGetMetadata,
  ) {
    if (!user) {
      throw new UnauthorizedException('User is not authenticated');
    }
    const payload = this.masterServiceValidator.validateCreatePayload(body);
    const data = await this.createMasterServiceUseCase.execute(
      payload,
      user,
      metadata.isStaffUser,
    );
    return { data };
  }

  @Patch(':id')
  async updateMasterService(
    @Param() params: Record<string, unknown>,
    @Body() body: Record<string, unknown>,
    @CurrentUser() user: ISessionUser | null,
    @GetMetadata() metadata: IGetMetadata,
  ) {
    if (!user) {
      throw new UnauthorizedException('User is not authenticated');
    }
    const { id } = this.masterServiceValidator.validateIdParam(params);
    const payload = this.masterServiceValidator.validateUpdatePayload(body);
    const data = await this.updateMasterServiceByIdUseCase.execute(
      id,
      payload,
      user,
      metadata.isStaffUser,
    );
    return { data };
  }

  @Delete(':id')
  async deleteMasterService(
    @Param() params: Record<string, unknown>,
    @CurrentUser() user: ISessionUser | null,
    @GetMetadata() metadata: IGetMetadata,
  ) {
    if (!user) {
      throw new UnauthorizedException('User is not authenticated');
    }
    const { id } = this.masterServiceValidator.validateIdParam(params);
    await this.deleteMasterServiceByIdUseCase.execute(
      id,
      user,
      metadata.isStaffUser,
    );
    return { data: { success: true } };
  }
}
