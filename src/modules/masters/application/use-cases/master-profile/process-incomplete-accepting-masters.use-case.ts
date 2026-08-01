import {
  EMasterBookingStatus,
} from 'src/modules/masters/domain/entities/master-profile';
import type { IMasterProfileRepository } from 'src/modules/masters/domain/repositories/master-profile/i-master-profile.repository';
import type { ITransactionManager } from '@shared/domain/transactions';
import type { MasterOnboardingService } from '../../services/master-onboarding.service';

const DEMOTE_BATCH_LIMIT = 50;

export class ProcessIncompleteAcceptingMastersUseCase {
  constructor(
    private readonly transactionManager: ITransactionManager,
    private readonly masterProfileRepository: IMasterProfileRepository,
    private readonly masterOnboardingService: MasterOnboardingService,
  ) {}

  async execute(): Promise<{ processed: number; demoted: number }> {
    const candidates =
      await this.masterProfileRepository.findAcceptingForOnboardingCheck(
        DEMOTE_BATCH_LIMIT,
      );

    let demoted = 0;

    for (const profile of candidates) {
      try {
        const fulfilled = await this.masterOnboardingService.isFulfilled(
          profile.id,
        );
        if (fulfilled) {
          continue;
        }

        await this.transactionManager.runInTransaction((scope) =>
          this.masterProfileRepository.update(
            profile.id,
            {
              bookingStatus: EMasterBookingStatus.CLOSED,
              pausedUntil: null,
            },
            scope,
          ),
        );
        demoted += 1;
      } catch {
        // Continue batch — next cron will retry remaining
      }
    }

    return { processed: candidates.length, demoted };
  }
}
