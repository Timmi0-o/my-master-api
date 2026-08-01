import {
  MasterProfileNotFoundError,
  type IMasterOnboardingSnapshot,
} from 'src/modules/masters/domain/entities/master-profile';
import type { IMasterProfileRepository } from 'src/modules/masters/domain/repositories/master-profile/i-master-profile.repository';
import type { MasterOnboardingService } from '../../services/master-onboarding.service';
import type { IGetMasterOnboardingApplicationInput } from '../../dtos/master-profile/get-master-onboarding.input';

export class GetMasterOnboardingUseCase {
  constructor(
    private readonly masterProfileRepository: IMasterProfileRepository,
    private readonly masterOnboardingService: MasterOnboardingService,
  ) {}

  async execute(
    input: IGetMasterOnboardingApplicationInput,
  ): Promise<IMasterOnboardingSnapshot> {
    const entity = await this.masterProfileRepository.findEntityByUserId(
      input.actor.userId,
    );

    if (!entity || (!input.actor.isStaffUser && entity.deletedAt != null)) {
      throw new MasterProfileNotFoundError(input.actor.userId);
    }

    return this.masterOnboardingService.getSnapshot(
      entity.id,
      entity.bookingStatus,
    );
  }
}
