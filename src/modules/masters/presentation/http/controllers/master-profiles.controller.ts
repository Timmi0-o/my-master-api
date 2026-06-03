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
import { JwtAuthGuard } from 'src/modules/auth/presentation/guards/jwt-auth.guard';
import { CurrentUser } from 'src/modules/auth/presentation/decorators/current-user.decorator';
import { DomainExceptionFilter } from 'src/modules/shared/infrastructure/filters/domain-exception.filter';
import type { IGetMetadata } from 'src/modules/shared/domain/decorators/i-get-metadata';
import type { ISessionUser } from 'src/modules/shared/domain/i-session-user';
import type { IRawQuery } from 'src/modules/shared/domain/i-query.dto';
import { GetMetadata } from 'src/modules/shared/presentation/decorators/get-metadata';
import { CreateMasterProfileUseCase } from 'src/modules/masters/application/use-cases/master-profile/create-master-profile.use-case';
import { DeleteMasterProfileByIdUseCase } from 'src/modules/masters/application/use-cases/master-profile/delete-master-profile-by-id.use-case';
import { GetMasterProfileByIdUseCase } from 'src/modules/masters/application/use-cases/master-profile/get-master-profile-by-id.use-case';
import { GetMasterProfilesUseCase } from 'src/modules/masters/application/use-cases/master-profile/get-master-profiles.use-case';
import { UpdateMasterProfileByIdUseCase } from 'src/modules/masters/application/use-cases/master-profile/update-master-profile-by-id.use-case';
import { payloadToCreateMasterProfileInput } from '../mappers/master-profile/payload-to-create-master-profile-input';
import { payloadToDeleteMasterProfileInput } from '../mappers/master-profile/payload-to-delete-master-profile-input';
import { payloadToGetMasterProfileByIdInput } from '../mappers/master-profile/payload-to-get-master-profile-by-id-input';
import { payloadToUpdateMasterProfileInput } from '../mappers/master-profile/payload-to-update-master-profile-input';
import { payloadToFindManyParams } from '../mappers/master-profile/payload-to-find-many-params.mapper';
import { mapGetMasterProfilesHttpResponse } from '../response/map-get-master-profiles-response';
import { MasterProfileValidator } from '../validation/master-profile.validator';

@Controller({ path: 'master-profiles', version: '1' })
@UseFilters(DomainExceptionFilter)
@UseGuards(JwtAuthGuard)
export class MasterProfilesController {
  constructor(
    private readonly getMasterProfilesUseCase: GetMasterProfilesUseCase,
    private readonly getMasterProfileByIdUseCase: GetMasterProfileByIdUseCase,
    private readonly createMasterProfileUseCase: CreateMasterProfileUseCase,
    private readonly updateMasterProfileByIdUseCase: UpdateMasterProfileByIdUseCase,
    private readonly deleteMasterProfileByIdUseCase: DeleteMasterProfileByIdUseCase,
    private readonly masterProfileValidator: MasterProfileValidator,
  ) {}

  @Get()
  async getMasterProfiles(
    @Query() query: IRawQuery,
    @GetMetadata() metadata: IGetMetadata,
  ) {
    const payload = this.masterProfileValidator.validateGetMasterProfilesQuery(
      query,
    );
    const params = payloadToFindManyParams(payload, metadata);
    const output = await this.getMasterProfilesUseCase.execute(params);
    return mapGetMasterProfilesHttpResponse(output, payload);
  }

  @Get(':id')
  async getMasterProfileById(
    @Param() params: Record<string, unknown>,
    @Query() query: IRawQuery,
    @CurrentUser() user: ISessionUser | null,
    @GetMetadata() metadata: IGetMetadata,
  ) {
    if (!user) {
      throw new UnauthorizedException('User is not authenticated');
    }
    const { id } = this.masterProfileValidator.validateIdParam(params);
    const queryPayload = this.masterProfileValidator.validateGetByIdQuery(query);
    const input = payloadToGetMasterProfileByIdInput(
      id,
      queryPayload,
      user,
      metadata.isStaffUser,
    );
    const item = await this.getMasterProfileByIdUseCase.execute(input);
    return { data: item };
  }

  @Post()
  async createMasterProfile(
    @Body() body: Record<string, unknown>,
    @CurrentUser() user: ISessionUser | null,
    @GetMetadata() metadata: IGetMetadata,
  ) {
    if (!user) {
      throw new UnauthorizedException('User is not authenticated');
    }
    const payload = this.masterProfileValidator.validateCreatePayload(body);
    const input = payloadToCreateMasterProfileInput(
      payload,
      user,
      metadata.isStaffUser,
    );
    const data = await this.createMasterProfileUseCase.execute(input);
    return { data };
  }

  @Patch(':id')
  async updateMasterProfile(
    @Param() params: Record<string, unknown>,
    @Body() body: Record<string, unknown>,
    @CurrentUser() user: ISessionUser | null,
    @GetMetadata() metadata: IGetMetadata,
  ) {
    if (!user) {
      throw new UnauthorizedException('User is not authenticated');
    }
    const { id } = this.masterProfileValidator.validateIdParam(params);
    const payload = this.masterProfileValidator.validateUpdatePayload(body);
    const input = payloadToUpdateMasterProfileInput(
      id,
      payload,
      user,
      metadata.isStaffUser,
    );
    const data = await this.updateMasterProfileByIdUseCase.execute(input);
    return { data };
  }

  @Delete(':id')
  async deleteMasterProfile(
    @Param() params: Record<string, unknown>,
    @CurrentUser() user: ISessionUser | null,
    @GetMetadata() metadata: IGetMetadata,
  ) {
    if (!user) {
      throw new UnauthorizedException('User is not authenticated');
    }
    const { id } = this.masterProfileValidator.validateIdParam(params);
    const input = payloadToDeleteMasterProfileInput(
      id,
      user,
      metadata.isStaffUser,
    );
    await this.deleteMasterProfileByIdUseCase.execute(input);
    return { data: { success: true } };
  }
}
