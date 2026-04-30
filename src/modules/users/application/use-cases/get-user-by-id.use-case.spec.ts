import { UserEntity } from '../../domain/user.entity';
import { UserLanguage, UserRole, UserStatus } from '../../domain/user.enums';
import { UserNotFoundError } from '../users.errors';
import { GetUserByIdUseCase } from './get-user-by-id.use-case';

describe('GetUserByIdUseCase', () => {
  it('returns user when it exists', async () => {
    const expectedUser = new UserEntity({
      id: 'f6fe3f5e-b1d0-4f42-a878-0d6769f4d3e0',
      email: 'john@example.com',
      phone: null,
      username: 'john',
      role: UserRole.USER,
      status: UserStatus.PENDING,
      passwordHash: 'hash',
      name: 'John',
      surname: 'Doe',
      patronymic: null,
      language: UserLanguage.RU,
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
    });

    const repository = {
      findById: jest.fn().mockResolvedValue(expectedUser),
    };

    const useCase = new GetUserByIdUseCase(repository as never);
    const result = await useCase.execute(expectedUser.value.id);

    expect(result).toBe(expectedUser);
  });

  it('throws when user does not exist', async () => {
    const repository = {
      findById: jest.fn().mockResolvedValue(null),
    };

    const useCase = new GetUserByIdUseCase(repository as never);

    await expect(useCase.execute('any-id')).rejects.toBeInstanceOf(
      UserNotFoundError,
    );
  });
});
