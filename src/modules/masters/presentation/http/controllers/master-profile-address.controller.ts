import {
  Controller,
  Delete,
  Get,
  Put,
  UseGuards,
} from '@nestjs/common';
import { AuthenticatedUser } from '@modules/auth/presentation/decorators/authenticated-user.decorator';
import { JwtAuthGuard } from '@modules/auth/presentation/guards/jwt-auth.guard';
import { Authorize } from '@modules/authorization/presentation/decorators/authorize.decorator';
import { AuthorizeGuard } from '@modules/authorization/presentation/guards/authorize.guard';
import type { ISessionUser } from '@shared/domain/i-session-user';
import { GetMetadata } from '@shared/presentation/decorators/get-metadata';
import type { IGetMetadata } from '@shared/domain/decorators/i-get-metadata';
import { HttpBody } from '@shared/presentation/http/decorators';
import { DeleteMasterAddressUseCase } from 'src/modules/masters/application/use-cases/master-profile/delete-master-address.use-case';
import { GetMasterAddressUseCase } from 'src/modules/masters/application/use-cases/master-profile/get-master-address.use-case';
import { GetMasterOnboardingUseCase } from 'src/modules/masters/application/use-cases/master-profile/get-master-onboarding.use-case';
import { UpsertMasterAddressUseCase } from 'src/modules/masters/application/use-cases/master-profile/upsert-master-address.use-case';
import { GetMyMasterProfileUseCase } from 'src/modules/masters/application/use-cases/master-profile/get-my-master-profile.use-case';
import { MasterProfileNotFoundError } from 'src/modules/masters/domain/entities/master-profile';
import { mapDeleteMasterAddressHttpResponse } from '../http-responses/map-delete-master-address-response';
import { mapGetMasterAddressHttpResponse } from '../http-responses/map-get-master-address-response';
import { mapGetMasterOnboardingHttpResponse } from '../http-responses/map-get-master-onboarding-response';
import { mapUpsertMasterAddressHttpResponse } from '../http-responses/map-upsert-master-address-response';
import { requestBodyToUpsertMasterAddressUseCaseInput } from '../request-mappers/master-profile/request-body-to-upsert-master-address-use-case-input';
import { upsertMasterAddressPayloadSchema } from '../validation/schemas/upsert-master-address-payload.schema';
import type { IUpsertMasterAddressPayload } from '../validation/schemas/upsert-master-address-payload.types';

@Controller({ path: 'masters', version: '1' })
export class MasterProfileAddressController {
  constructor(
    private readonly getMyMasterProfileUseCase: GetMyMasterProfileUseCase,
    private readonly getMasterAddressUseCase: GetMasterAddressUseCase,
    private readonly getMasterOnboardingUseCase: GetMasterOnboardingUseCase,
    private readonly upsertMasterAddressUseCase: UpsertMasterAddressUseCase,
    private readonly deleteMasterAddressUseCase: DeleteMasterAddressUseCase,
  ) {}

  private async resolveMasterProfileId(user: ISessionUser): Promise<string> {
    const profile = await this.getMyMasterProfileUseCase.execute({
      actor: { userId: user.id, isStaffUser: false },
    });

    if (!profile) {
      throw new MasterProfileNotFoundError(user.id);
    }

    return profile.id;
  }

  @Get('me/onboarding')
  @UseGuards(JwtAuthGuard, AuthorizeGuard)
  @Authorize({ kind: 'authenticated' })
  async getMyOnboarding(
    @AuthenticatedUser() user: ISessionUser,
    @GetMetadata() metadata: IGetMetadata,
  ) {
    const snapshot = await this.getMasterOnboardingUseCase.execute({
      actor: { userId: user.id, isStaffUser: metadata.isStaffUser },
    });
    return mapGetMasterOnboardingHttpResponse(snapshot);
  }

  @Get('me/address')
  @UseGuards(JwtAuthGuard, AuthorizeGuard)
  @Authorize({ kind: 'authenticated' })
  async getMyAddress(@AuthenticatedUser() user: ISessionUser) {
    const masterProfileId = await this.resolveMasterProfileId(user);
    const address = await this.getMasterAddressUseCase.execute(masterProfileId);
    return mapGetMasterAddressHttpResponse(address);
  }

  @Put('me/address')
  @UseGuards(JwtAuthGuard, AuthorizeGuard)
  @Authorize({ kind: 'authenticated' })
  async upsertMyAddress(
    @AuthenticatedUser() user: ISessionUser,
    @HttpBody(upsertMasterAddressPayloadSchema, {
      errorMessage: 'Некорректные данные адреса',
    })
    payload: IUpsertMasterAddressPayload,
  ) {
    const masterProfileId = await this.resolveMasterProfileId(user);
    const address = await this.upsertMasterAddressUseCase.execute(
      requestBodyToUpsertMasterAddressUseCaseInput(masterProfileId, payload),
    );
    return mapUpsertMasterAddressHttpResponse(address);
  }

  @Delete('me/address')
  @UseGuards(JwtAuthGuard, AuthorizeGuard)
  @Authorize({ kind: 'authenticated' })
  async deleteMyAddress(@AuthenticatedUser() user: ISessionUser) {
    const masterProfileId = await this.resolveMasterProfileId(user);
    await this.deleteMasterAddressUseCase.execute(masterProfileId);
    return mapDeleteMasterAddressHttpResponse();
  }
}
