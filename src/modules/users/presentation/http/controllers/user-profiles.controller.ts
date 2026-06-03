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
import { CreateUserProfileUseCase } from 'src/modules/users/application/use-cases/user-profile/create-user-profile.use-case';
import { DeleteUserProfileByIdUseCase } from 'src/modules/users/application/use-cases/user-profile/delete-user-profile-by-id.use-case';
import { GetUserProfileByIdUseCase } from 'src/modules/users/application/use-cases/user-profile/get-user-profile-by-id.use-case';
import { GetUserProfilesUseCase } from 'src/modules/users/application/use-cases/user-profile/get-user-profiles.use-case';
import { UpdateUserProfileByIdUseCase } from 'src/modules/users/application/use-cases/user-profile/update-user-profile-by-id.use-case';
import type { IGetMetadata } from 'src/modules/shared/domain/decorators/i-get-metadata';
import type { IRawQuery } from 'src/modules/shared/domain/i-query.dto';
import type { ISessionUser } from 'src/modules/shared/domain/i-session-user';
import { DomainExceptionFilter } from 'src/modules/shared/infrastructure/filters/domain-exception.filter';
import { GetMetadata } from 'src/modules/shared/presentation/decorators/get-metadata';
import { payloadToCreateUserProfileInput } from '../mappers/user-profile/payload-to-create-user-profile-input';
import { payloadToDeleteUserProfileInput } from '../mappers/user-profile/payload-to-delete-user-profile-input';
import { payloadToFindManyParams } from '../mappers/user-profile/payload-to-find-many-params.mapper';
import { payloadToGetUserProfileByIdInput } from '../mappers/user-profile/payload-to-get-user-profile-by-id-input';
import { payloadToUpdateUserProfileInput } from '../mappers/user-profile/payload-to-update-user-profile-input';
import { mapGetUserProfilesHttpResponse } from '../response/map-get-user-profiles-response';
import { UserProfileValidator } from '../validation/user-profile.validator';

@Controller({ path: 'user-profiles', version: '1' })
@UseFilters(DomainExceptionFilter)
@UseGuards(JwtAuthGuard)
export class UserProfilesController {
  constructor(
    private readonly getUserProfilesUseCase: GetUserProfilesUseCase,
    private readonly getUserProfileByIdUseCase: GetUserProfileByIdUseCase,
    private readonly createUserProfileUseCase: CreateUserProfileUseCase,
    private readonly updateUserProfileByIdUseCase: UpdateUserProfileByIdUseCase,
    private readonly deleteUserProfileByIdUseCase: DeleteUserProfileByIdUseCase,
    private readonly userProfileValidator: UserProfileValidator,
  ) {}

  @Get()
  async getUserProfiles(
    @Query() query: IRawQuery,
    @GetMetadata() metadata: IGetMetadata,
  ) {
    const payload =
      this.userProfileValidator.validateGetUserProfilesQuery(query);
    const params = payloadToFindManyParams(payload, metadata);
    const output = await this.getUserProfilesUseCase.execute(params);
    return mapGetUserProfilesHttpResponse(output, payload);
  }

  @Get(':id')
  async getUserProfileById(
    @Param() params: Record<string, unknown>,
    @Query() query: IRawQuery,
    @CurrentUser() user: ISessionUser | null,
    @GetMetadata() metadata: IGetMetadata,
  ) {
    if (!user) {
      throw new UnauthorizedException('User is not authenticated');
    }
    const { id } = this.userProfileValidator.validateIdParam(params);
    const queryPayload = this.userProfileValidator.validateGetByIdQuery(query);
    const input = payloadToGetUserProfileByIdInput(
      id,
      queryPayload,
      user,
      metadata.isStaffUser,
    );
    const item = await this.getUserProfileByIdUseCase.execute(input);
    return { data: item };
  }

  @Post()
  async createUserProfile(
    @Body() body: Record<string, unknown>,
    @CurrentUser() user: ISessionUser | null,
    @GetMetadata() metadata: IGetMetadata,
  ) {
    if (!user) {
      throw new UnauthorizedException('User is not authenticated');
    }
    const payload = this.userProfileValidator.validateCreatePayload(body);
    const input = payloadToCreateUserProfileInput(
      payload,
      user,
      metadata.isStaffUser,
    );
    const data = await this.createUserProfileUseCase.execute(input);
    return { data };
  }

  @Patch(':id')
  async updateUserProfile(
    @Param() params: Record<string, unknown>,
    @Body() body: Record<string, unknown>,
    @CurrentUser() user: ISessionUser | null,
    @GetMetadata() metadata: IGetMetadata,
  ) {
    if (!user) {
      throw new UnauthorizedException('User is not authenticated');
    }
    const { id } = this.userProfileValidator.validateIdParam(params);
    const payload = this.userProfileValidator.validateUpdatePayload(body);
    const input = payloadToUpdateUserProfileInput(
      id,
      payload,
      user,
      metadata.isStaffUser,
    );
    const data = await this.updateUserProfileByIdUseCase.execute(input);
    return { data };
  }

  @Delete(':id')
  async deleteUserProfile(
    @Param() params: Record<string, unknown>,
    @CurrentUser() user: ISessionUser | null,
    @GetMetadata() metadata: IGetMetadata,
  ) {
    if (!user) {
      throw new UnauthorizedException('User is not authenticated');
    }
    const { id } = this.userProfileValidator.validateIdParam(params);
    const input = payloadToDeleteUserProfileInput(
      id,
      user,
      metadata.isStaffUser,
    );
    await this.deleteUserProfileByIdUseCase.execute(input);
    return { data: { success: true } };
  }
}
