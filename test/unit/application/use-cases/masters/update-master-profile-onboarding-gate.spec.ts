import { UpdateMasterProfileByIdUseCase } from 'src/modules/masters/application/use-cases/master-profile/update-master-profile-by-id.use-case';
import type { MasterOnboardingService } from 'src/modules/masters/application/services/master-onboarding.service';
import {
  EMasterBookingStatus,
  MasterProfileOnboardingIncompleteError,
  type IMasterProfileEntity,
} from 'src/modules/masters/domain/entities/master-profile';
import type { IMasterProfileRepository } from 'src/modules/masters/domain/repositories/master-profile/i-master-profile.repository';
import { createMockTransactionManager } from '../../../../support/mocks/transaction-manager.mock';

describe('UpdateMasterProfileByIdUseCase onboarding gate', () => {
  const existing = {
    id: 'mp-1',
    userId: 'user-1',
    bookingStatus: EMasterBookingStatus.CLOSED,
  } as IMasterProfileEntity;

  const createUseCase = (opts: {
    isFulfilled: boolean;
    updateResult?: IMasterProfileEntity;
  }) => {
    const repository = {
      findEntityById: jest.fn().mockResolvedValue(existing),
      update: jest.fn().mockResolvedValue(
        opts.updateResult ?? {
          ...existing,
          bookingStatus: EMasterBookingStatus.ACCEPTING,
        },
      ),
    } as unknown as IMasterProfileRepository;

    const onboardingService = {
      isFulfilled: jest.fn().mockResolvedValue(opts.isFulfilled),
    } as unknown as MasterOnboardingService;

    const useCase = new UpdateMasterProfileByIdUseCase(
      createMockTransactionManager(),
      repository,
      onboardingService,
    );

    return { useCase, repository, onboardingService };
  };

  it('rejects ACCEPTING when onboarding is incomplete', async () => {
    const { useCase, repository, onboardingService } = createUseCase({
      isFulfilled: false,
    });

    await expect(
      useCase.execute({
        id: 'mp-1',
        patch: { bookingStatus: EMasterBookingStatus.ACCEPTING },
        actor: { userId: 'user-1', isStaffUser: false },
      }),
    ).rejects.toBeInstanceOf(MasterProfileOnboardingIncompleteError);

    expect(onboardingService.isFulfilled).toHaveBeenCalledWith('mp-1');
    expect(repository.update).not.toHaveBeenCalled();
  });

  it('allows ACCEPTING when onboarding is fulfilled', async () => {
    const { useCase, repository } = createUseCase({ isFulfilled: true });

    await useCase.execute({
      id: 'mp-1',
      patch: { bookingStatus: EMasterBookingStatus.ACCEPTING },
      actor: { userId: 'user-1', isStaffUser: false },
    });

    expect(repository.update).toHaveBeenCalled();
  });

  it('allows staff to set ACCEPTING without onboarding', async () => {
    const { useCase, repository, onboardingService } = createUseCase({
      isFulfilled: false,
    });

    await useCase.execute({
      id: 'mp-1',
      patch: { bookingStatus: EMasterBookingStatus.ACCEPTING },
      actor: { userId: 'staff-1', isStaffUser: true },
    });

    expect(onboardingService.isFulfilled).not.toHaveBeenCalled();
    expect(repository.update).toHaveBeenCalled();
  });
});
