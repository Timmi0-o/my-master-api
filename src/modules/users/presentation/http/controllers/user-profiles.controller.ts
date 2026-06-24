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
import { Permissions } from 'src/modules/authorization/domain/permissions/permission-names';
import { Authorize } from 'src/modules/authorization/presentation/decorators/authorize.decorator';
import { AuthorizeGuard } from 'src/modules/authorization/presentation/guards/authorize.guard';
import { CreateRootFolderUseCase } from 'src/modules/files/application/use-cases/folder/create-root-folder.use-case';
import type { IGetMetadata } from 'src/modules/shared/domain/decorators/i-get-metadata';
import type { IRawQuery } from 'src/modules/shared/domain/i-query.dto';
import type { ISessionUser } from 'src/modules/shared/domain/i-session-user';
import { GetMetadata } from 'src/modules/shared/presentation/decorators/get-metadata';
import { CreateUserProfileUseCase } from 'src/modules/users/application/use-cases/user-profile/create-user-profile.use-case';
import { DeleteUserProfileByIdUseCase } from 'src/modules/users/application/use-cases/user-profile/delete-user-profile-by-id.use-case';
import { GetMyUserProfileUseCase } from 'src/modules/users/application/use-cases/user-profile/get-my-user-profile.use-case';
import { GetUserProfileByIdUseCase } from 'src/modules/users/application/use-cases/user-profile/get-user-profile-by-id.use-case';
import { GetUserProfilesUseCase } from 'src/modules/users/application/use-cases/user-profile/get-user-profiles.use-case';
import { UpdateUserProfileByIdUseCase } from 'src/modules/users/application/use-cases/user-profile/update-user-profile-by-id.use-case';
import { outputCreateUserProfileToCreateRootFolderInput } from '../mappers/user-profile/output-create-user-profile-to-create-root-folder-input';
import { payloadToCreateUserProfileInput } from '../mappers/user-profile/payload-to-create-user-profile-input';
import { payloadToDeleteUserProfileInput } from '../mappers/user-profile/payload-to-delete-user-profile-input';
import { payloadToFindManyParams } from '../mappers/user-profile/payload-to-find-many-params.mapper';
import { payloadToGetMyUserProfileInput } from '../mappers/user-profile/payload-to-get-my-user-profile-input';
import { payloadToGetUserProfileByIdInput } from '../mappers/user-profile/payload-to-get-user-profile-by-id-input';
import { payloadToUpdateUserProfileInput } from '../mappers/user-profile/payload-to-update-user-profile-input';
import { mapCreateUserProfileHttpResponse } from '../response/map-create-user-profile-response';
import { mapDeleteUserProfileHttpResponse } from '../response/map-delete-user-profile-response';
import { mapGetMyUserProfileHttpResponse } from '../response/map-get-my-user-profile-response';
import { mapGetUserProfileByIdHttpResponse } from '../response/map-get-user-profile-by-id-response';
import { mapGetUserProfilesHttpResponse } from '../response/map-get-user-profiles-response';
import { mapUpdateUserProfileHttpResponse } from '../response/map-update-user-profile-response';
import { UserProfileValidator } from '../validation/user-profile.validator';

@Controller({ path: 'user-profiles', version: '1' })
@UseGuards(JwtAuthGuard, AuthorizeGuard)
export class UserProfilesController {
  constructor(
    private readonly getUserProfilesUseCase: GetUserProfilesUseCase,
    private readonly getUserProfileByIdUseCase: GetUserProfileByIdUseCase,
    private readonly getMyUserProfileUseCase: GetMyUserProfileUseCase,
    private readonly createUserProfileUseCase: CreateUserProfileUseCase,
    private readonly createRootFolderUseCase: CreateRootFolderUseCase,
    private readonly updateUserProfileByIdUseCase: UpdateUserProfileByIdUseCase,
    private readonly deleteUserProfileByIdUseCase: DeleteUserProfileByIdUseCase,
    private readonly userProfileValidator: UserProfileValidator,
  ) {}

  @Get()
  @Authorize({
    kind: 'permissions',
    permissions: [Permissions.userProfiles.read],
  })
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

  @Get('me')
  @Authorize({ kind: 'authenticated' })
  async getMyUserProfile(
    @Query() query: IRawQuery,
    @AuthenticatedUser() user: ISessionUser,
    @GetMetadata() metadata: IGetMetadata,
  ) {
    const queryPayload = this.userProfileValidator.validateGetByIdQuery(query);
    const input = payloadToGetMyUserProfileInput(
      queryPayload,
      user,
      metadata.isStaffUser,
    );
    const item = await this.getMyUserProfileUseCase.execute(input);
    return mapGetMyUserProfileHttpResponse(item);
  }

  @Get(':id')
  @Authorize({
    kind: 'permissions',
    permissions: [Permissions.userProfiles.read],
  })
  async getUserProfileById(
    @Param() params: Record<string, unknown>,
    @Query() query: IRawQuery,
    @AuthenticatedUser() user: ISessionUser,
    @GetMetadata() metadata: IGetMetadata,
  ) {
    const { id } = this.userProfileValidator.validateIdParam(params);
    const queryPayload = this.userProfileValidator.validateGetByIdQuery(query);
    const input = payloadToGetUserProfileByIdInput(
      id,
      queryPayload,
      user,
      metadata.isStaffUser,
    );
    const item = await this.getUserProfileByIdUseCase.execute(input);
    return mapGetUserProfileByIdHttpResponse(item);
  }

  @Post()
  @Authorize({
    kind: 'permissions',
    permissions: [Permissions.userProfiles.create],
  })
  async createUserProfile(
    @Body() body: Record<string, unknown>,
    @AuthenticatedUser() user: ISessionUser,
    @GetMetadata() metadata: IGetMetadata,
  ) {
    const payload = this.userProfileValidator.validateCreatePayload(body);
    const input = payloadToCreateUserProfileInput(
      payload,
      user,
      metadata.isStaffUser,
    );
    const output = await this.createUserProfileUseCase.execute(input);
    await this.createRootFolderUseCase.execute(
      outputCreateUserProfileToCreateRootFolderInput(output, input),
    );
    return mapCreateUserProfileHttpResponse(output);
  }

  @Patch(':id')
  @Authorize({
    kind: 'permissions',
    permissions: [Permissions.userProfiles.update],
  })
  async updateUserProfile(
    @Param() params: Record<string, unknown>,
    @Body() body: Record<string, unknown>,
    @AuthenticatedUser() user: ISessionUser,
    @GetMetadata() metadata: IGetMetadata,
  ) {
    const { id } = this.userProfileValidator.validateIdParam(params);
    const payload = this.userProfileValidator.validateUpdatePayload(body);
    const input = payloadToUpdateUserProfileInput(
      id,
      payload,
      user,
      metadata.isStaffUser,
    );
    const output = await this.updateUserProfileByIdUseCase.execute(input);
    return mapUpdateUserProfileHttpResponse(output);
  }

  @Delete(':id')
  @Authorize({
    kind: 'permissions',
    permissions: [Permissions.userProfiles.delete],
  })
  async deleteUserProfile(
    @Param() params: Record<string, unknown>,
    @AuthenticatedUser() user: ISessionUser,
    @GetMetadata() metadata: IGetMetadata,
  ) {
    const { id } = this.userProfileValidator.validateIdParam(params);
    const input = payloadToDeleteUserProfileInput(
      id,
      user,
      metadata.isStaffUser,
    );
    await this.deleteUserProfileByIdUseCase.execute(input);
    return mapDeleteUserProfileHttpResponse();
  }
}
