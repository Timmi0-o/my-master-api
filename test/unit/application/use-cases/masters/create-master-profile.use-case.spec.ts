import { CreateMasterProfileUseCase } from 'src/modules/masters/application/use-cases/master-profile/create-master-profile.use-case';
import type { IMasterProfileRepository } from 'src/modules/masters/domain/repositories/master-profile/i-master-profile.repository';
import { createMockTransactionManager } from '../../../../support/mocks/transaction-manager.mock';

describe('CreateMasterProfileUseCase', () => {
  it('creates profile for actor user inside transaction', async () => {
    const created = {
      id: 'mp-1',
      userId: 'user-1',
      displayName: 'Test',
      description: '',
      rating: 0,
    };

    const repository: IMasterProfileRepository = {
      create: jest.fn().mockResolvedValue(created),
    } as unknown as IMasterProfileRepository;

    const useCase = new CreateMasterProfileUseCase(
      createMockTransactionManager(),
      repository,
    );

    const result = await useCase.execute({
      actor: { userId: 'user-1', isStaffUser: false },
      displayName: 'Test',
      description: '',
      rating: 0,
    });

    expect(result).toEqual(created);
    expect(repository.create).toHaveBeenCalledWith(
      expect.objectContaining({ userId: 'user-1', displayName: 'Test' }),
      expect.anything(),
    );
  });
});
