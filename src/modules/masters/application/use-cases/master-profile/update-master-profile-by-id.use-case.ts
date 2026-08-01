import type { ITransactionManager } from '@shared/domain/transactions';
import type { IUpdateMasterProfileInput } from 'src/modules/masters/domain/entities/master-profile';
import {
  EMasterBookingStatus,
  ensureMasterProfileAccessible,
  ensureMasterProfileExists,
  MasterProfileOnboardingIncompleteError,
} from 'src/modules/masters/domain/entities/master-profile';
import type { IMasterProfileRepository } from 'src/modules/masters/domain/repositories/master-profile/i-master-profile.repository';
import type { IUpdateMasterProfileApplicationInput } from '../../dtos/master-profile/update-master-profile.input';
import type { IUpdateMasterProfileApplicationOutput } from '../../dtos/master-profile/update-master-profile.output';
import type { MasterOnboardingService } from '../../services/master-onboarding.service';

export class UpdateMasterProfileByIdUseCase {
  constructor(
    private readonly transactionManager: ITransactionManager,
    private readonly masterProfileRepository: IMasterProfileRepository,
    private readonly masterOnboardingService: MasterOnboardingService,
  ) {}

  async execute(
    input: IUpdateMasterProfileApplicationInput,
  ): Promise<IUpdateMasterProfileApplicationOutput> {
    const existing = await this.masterProfileRepository.findEntityById(
      input.id,
    );
    ensureMasterProfileExists(existing, input.id);
    ensureMasterProfileAccessible(existing, input.actor);

    const data: IUpdateMasterProfileInput = { ...input.patch };
    if (!input.actor.isStaffUser) {
      delete data.userId;
    }

    const requestsAccepting =
      data.bookingStatus === EMasterBookingStatus.ACCEPTING;

    if (requestsAccepting && !input.actor.isStaffUser) {
      const fulfilled = await this.masterOnboardingService.isFulfilled(
        input.id,
      );
      if (!fulfilled) {
        throw new MasterProfileOnboardingIncompleteError(input.id);
      }
    }

    return this.transactionManager.runInTransaction((scope) =>
      this.masterProfileRepository.update(input.id, data, scope),
    );
  }
}
