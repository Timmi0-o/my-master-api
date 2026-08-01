import { RecalculateMasterRatingsUseCase } from 'src/modules/masters/application/use-cases/master-service-review/recalculate-master-ratings.use-case';
import type { IMasterProfileRepository } from 'src/modules/masters/domain/repositories/master-profile/i-master-profile.repository';
import type { IMasterServiceRepository } from 'src/modules/masters/domain/repositories/master-service/i-master-service.repository';
import type { IMasterServiceReviewRepository } from 'src/modules/masters/domain/repositories/master-service-review/i-master-service-review.repository';
import type { TransactionScope } from '@shared/domain/transactions';

describe('RecalculateMasterRatingsUseCase', () => {
  it('updates service and master profile ratings from aggregates', async () => {
    const reviewRepo = {
      aggregateAvgRatingByServiceId: jest.fn().mockResolvedValue(4.5),
      aggregateAvgRatingByMasterProfileId: jest.fn().mockResolvedValue(4.2),
    } as unknown as IMasterServiceReviewRepository;

    const serviceRepo = {
      update: jest.fn().mockResolvedValue({}),
    } as unknown as IMasterServiceRepository;

    const profileRepo = {
      update: jest.fn().mockResolvedValue({}),
    } as unknown as IMasterProfileRepository;

    const useCase = new RecalculateMasterRatingsUseCase(
      reviewRepo,
      serviceRepo,
      profileRepo,
    );

    const scope = {} as TransactionScope;

    await useCase.execute({
      masterServiceId: 'svc-1',
      masterProfileId: 'mp-1',
      scope,
    });

    expect(reviewRepo.aggregateAvgRatingByServiceId).toHaveBeenCalledWith(
      'svc-1',
      scope,
    );
    expect(reviewRepo.aggregateAvgRatingByMasterProfileId).toHaveBeenCalledWith(
      'mp-1',
      scope,
    );
    expect(serviceRepo.update).toHaveBeenCalledWith(
      'svc-1',
      { rating: 4.5 },
      scope,
    );
    expect(profileRepo.update).toHaveBeenCalledWith(
      'mp-1',
      { rating: 4.2 },
      scope,
    );
  });
});
