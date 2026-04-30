import { UserNotFoundError } from '../users.errors';
import { SoftDeleteUserUseCase } from './soft-delete-user.use-case';

describe('SoftDeleteUserUseCase', () => {
  it('completes when deletion succeeds', async () => {
    const repository = {
      softDeleteById: jest.fn().mockResolvedValue(true),
    };

    const useCase = new SoftDeleteUserUseCase(repository as never);

    await expect(
      useCase.execute('f6fe3f5e-b1d0-4f42-a878-0d6769f4d3e0'),
    ).resolves.toBeUndefined();
  });

  it('throws when user is absent', async () => {
    const repository = {
      softDeleteById: jest.fn().mockResolvedValue(false),
    };

    const useCase = new SoftDeleteUserUseCase(repository as never);

    await expect(
      useCase.execute('f6fe3f5e-b1d0-4f42-a878-0d6769f4d3e0'),
    ).rejects.toBeInstanceOf(UserNotFoundError);
  });
});
