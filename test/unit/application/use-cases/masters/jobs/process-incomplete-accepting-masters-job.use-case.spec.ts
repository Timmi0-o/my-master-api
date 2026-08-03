import { ProcessIncompleteAcceptingMastersJobUseCase } from 'src/modules/masters/application/use-cases/master-profile/jobs/process-incomplete-accepting-masters-job.use-case';
import type { MasterOnboardingService } from 'src/modules/masters/application/services/master-onboarding.service';
import {
  EMasterBookingStatus,
  type IMasterProfileEntity,
} from 'src/modules/masters/domain/entities/master-profile';
import type { IMasterProfileRepository } from 'src/modules/masters/domain/repositories/master-profile/i-master-profile.repository';
import { createMockTransactionManager } from '../../../../../support/mocks/transaction-manager.mock';

describe('ProcessIncompleteAcceptingMastersJobUseCase', () => {
  it('demotes incomplete ACCEPTING profiles to CLOSED', async () => {
    const incomplete = {
      id: 'mp-incomplete',
      bookingStatus: EMasterBookingStatus.ACCEPTING,
    } as IMasterProfileEntity;
    const complete = {
      id: 'mp-complete',
      bookingStatus: EMasterBookingStatus.ACCEPTING,
    } as IMasterProfileEntity;

    const repository = {
      findAcceptingForOnboardingCheck: jest
        .fn()
        .mockResolvedValue([incomplete, complete]),
      update: jest.fn().mockResolvedValue({
        ...incomplete,
        bookingStatus: EMasterBookingStatus.CLOSED,
      }),
    } as unknown as IMasterProfileRepository;

    const onboardingService = {
      isFulfilled: jest.fn(async (id: string) => id === 'mp-complete'),
    } as unknown as MasterOnboardingService;

    const useCase = new ProcessIncompleteAcceptingMastersJobUseCase(
      createMockTransactionManager(),
      repository,
      onboardingService,
    );

    const result = await useCase.execute();

    expect(result).toEqual({ processed: 2, demoted: 1 });
    expect(repository.update).toHaveBeenCalledTimes(1);
    expect(repository.update).toHaveBeenCalledWith(
      'mp-incomplete',
      {
        bookingStatus: EMasterBookingStatus.CLOSED,
        pausedUntil: null,
      },
      expect.anything(),
    );
  });
});
