import type { TransactionScope } from '@shared/domain/transactions';
import type { IMasterProfileRepository } from 'src/modules/masters/domain/repositories/master-profile/i-master-profile.repository';
import type { IMasterServiceRepository } from 'src/modules/masters/domain/repositories/master-service/i-master-service.repository';
import type { IMasterServiceReviewRepository } from 'src/modules/masters/domain/repositories/master-service-review/i-master-service-review.repository';

export type IRecalculateMasterRatingsInput = {
  masterServiceId: string;
  masterProfileId: string;
  scope: TransactionScope;
};

/**
 * Denormalizes:
 * - MasterService.rating = avg of that service's reviews
 * - MasterProfile.rating = avg of all reviews across master's services
 */
export class RecalculateMasterRatingsUseCase {
  constructor(
    private readonly masterServiceReviewRepository: IMasterServiceReviewRepository,
    private readonly masterServiceRepository: IMasterServiceRepository,
    private readonly masterProfileRepository: IMasterProfileRepository,
  ) {}

  async execute(input: IRecalculateMasterRatingsInput): Promise<void> {
    const [serviceRating, masterRating] = await Promise.all([
      this.masterServiceReviewRepository.aggregateAvgRatingByServiceId(
        input.masterServiceId,
        input.scope,
      ),
      this.masterServiceReviewRepository.aggregateAvgRatingByMasterProfileId(
        input.masterProfileId,
        input.scope,
      ),
    ]);

    await Promise.all([
      this.masterServiceRepository.update(
        input.masterServiceId,
        { rating: serviceRating },
        input.scope,
      ),
      this.masterProfileRepository.update(
        input.masterProfileId,
        { rating: masterRating },
        input.scope,
      ),
    ]);
  }
}
