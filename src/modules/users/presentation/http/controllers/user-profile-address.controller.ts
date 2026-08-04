import { AuthenticatedUser } from '@modules/auth/presentation/decorators/authenticated-user.decorator';
import { JwtAuthGuard } from '@modules/auth/presentation/guards/jwt-auth.guard';
import { Authorize } from '@modules/authorization/presentation/decorators/authorize.decorator';
import { AuthorizeGuard } from '@modules/authorization/presentation/guards/authorize.guard';
import { Controller, Delete, Get, Put, UseGuards } from '@nestjs/common';
import type { ISessionUser } from '@shared/domain/i-session-user';
import { RateLimiter } from '@shared/infrastructure/throttler/http-rate-limit.decorators';
import { HttpBody } from '@shared/presentation/http/decorators';
import { DeleteUserProfileAddressUseCase } from 'src/modules/users/application/use-cases/user-profile/delete-user-profile-address.use-case';
import { GetMyUserProfileUseCase } from 'src/modules/users/application/use-cases/user-profile/get-my-user-profile.use-case';
import { GetUserProfileAddressUseCase } from 'src/modules/users/application/use-cases/user-profile/get-user-profile-address.use-case';
import { UpsertUserProfileAddressUseCase } from 'src/modules/users/application/use-cases/user-profile/upsert-user-profile-address.use-case';
import { UserProfileNotFoundError } from 'src/modules/users/domain/entities/user-profile';
import { mapDeleteUserProfileAddressHttpResponse } from '../http-responses/map-delete-user-profile-address-response';
import { mapGetUserProfileAddressHttpResponse } from '../http-responses/map-get-user-profile-address-response';
import { mapUpsertUserProfileAddressHttpResponse } from '../http-responses/map-upsert-user-profile-address-response';
import { requestBodyToUpsertUserProfileAddressUseCaseInput } from '../request-mappers/user-profile/request-body-to-upsert-user-profile-address-use-case-input';
import { upsertUserProfileAddressPayloadSchema } from '../validation/schemas/upsert-user-profile-address-payload.schema';
import type { IUpsertUserProfileAddressPayload } from '../validation/schemas/upsert-user-profile-address-payload.types';

@RateLimiter('standard')
@Controller({ path: 'user-profiles', version: '1' })
export class UserProfileAddressController {
  constructor(
    private readonly getMyUserProfileUseCase: GetMyUserProfileUseCase,
    private readonly getUserProfileAddressUseCase: GetUserProfileAddressUseCase,
    private readonly upsertUserProfileAddressUseCase: UpsertUserProfileAddressUseCase,
    private readonly deleteUserProfileAddressUseCase: DeleteUserProfileAddressUseCase,
  ) {}

  private async resolveUserProfileId(user: ISessionUser): Promise<string> {
    const profile = await this.getMyUserProfileUseCase.execute({
      actor: { userId: user.id, isStaffUser: false },
    });

    if (!profile) {
      throw new UserProfileNotFoundError(user.id);
    }

    return profile.id;
  }

  @Get('me/address')
  @UseGuards(JwtAuthGuard, AuthorizeGuard)
  @Authorize({ kind: 'authenticated' })
  async getMyAddress(@AuthenticatedUser() user: ISessionUser) {
    const userProfileId = await this.resolveUserProfileId(user);
    const address =
      await this.getUserProfileAddressUseCase.execute(userProfileId);
    return mapGetUserProfileAddressHttpResponse(address);
  }

  @Put('me/address')
  @UseGuards(JwtAuthGuard, AuthorizeGuard)
  @Authorize({ kind: 'authenticated' })
  async upsertMyAddress(
    @AuthenticatedUser() user: ISessionUser,
    @HttpBody(upsertUserProfileAddressPayloadSchema, {
      errorMessage: 'Некорректные данные адреса',
    })
    payload: IUpsertUserProfileAddressPayload,
  ) {
    const userProfileId = await this.resolveUserProfileId(user);
    const address = await this.upsertUserProfileAddressUseCase.execute(
      requestBodyToUpsertUserProfileAddressUseCaseInput(userProfileId, payload),
    );
    return mapUpsertUserProfileAddressHttpResponse(address);
  }

  @Delete('me/address')
  @UseGuards(JwtAuthGuard, AuthorizeGuard)
  @Authorize({ kind: 'authenticated' })
  async deleteMyAddress(@AuthenticatedUser() user: ISessionUser) {
    const userProfileId = await this.resolveUserProfileId(user);
    await this.deleteUserProfileAddressUseCase.execute(userProfileId);
    return mapDeleteUserProfileAddressHttpResponse();
  }
}
