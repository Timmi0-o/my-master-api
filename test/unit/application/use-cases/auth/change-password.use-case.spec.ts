import * as bcrypt from 'bcrypt';
import { ChangePasswordUseCase } from 'src/modules/auth/application/use-cases/change-password.use-case';
import { InvalidCurrentPasswordError } from 'src/modules/auth/domain/entities/password-reset-token';
import type { IRefreshTokenRepository } from 'src/modules/auth/domain/repositories/i-refresh-token.repository';
import { UserNotFoundError } from 'src/modules/users/domain/entities/user';
import type { IUserRepository } from 'src/modules/users/domain/repositories/user/i-user.repository';
import { createMockTransactionManager } from '../../../../support/mocks/transaction-manager.mock';

describe('ChangePasswordUseCase', () => {
  it('updates password and revokes refresh tokens', async () => {
    const passwordHash = await bcrypt.hash('oldpassword', 4);
    const userRepository = {
      findEntityById: jest.fn().mockResolvedValue({
        id: 'u1',
        passwordHash,
        deletedAt: null,
      }),
      update: jest.fn().mockResolvedValue({ id: 'u1' }),
    } as unknown as IUserRepository;

    const refreshTokenRepository = {
      revokeAllForUser: jest.fn().mockResolvedValue(undefined),
    } as unknown as IRefreshTokenRepository;

    const useCase = new ChangePasswordUseCase(
      createMockTransactionManager(),
      userRepository,
      refreshTokenRepository,
    );

    await expect(
      useCase.execute({
        userId: 'u1',
        currentPassword: 'oldpassword',
        newPassword: 'newpassword',
      }),
    ).resolves.toEqual({ ok: true });

    expect(userRepository.update).toHaveBeenCalledWith(
      'u1',
      expect.objectContaining({ passwordHash: expect.any(String) }),
      expect.anything(),
    );
    expect(refreshTokenRepository.revokeAllForUser).toHaveBeenCalledWith(
      'u1',
      expect.anything(),
    );
  });

  it('rejects wrong current password', async () => {
    const passwordHash = await bcrypt.hash('oldpassword', 4);
    const useCase = new ChangePasswordUseCase(
      createMockTransactionManager(),
      {
        findEntityById: jest.fn().mockResolvedValue({
          id: 'u1',
          passwordHash,
          deletedAt: null,
        }),
        update: jest.fn(),
      } as unknown as IUserRepository,
      {
        revokeAllForUser: jest.fn(),
      } as unknown as IRefreshTokenRepository,
    );

    await expect(
      useCase.execute({
        userId: 'u1',
        currentPassword: 'wrong',
        newPassword: 'newpassword',
      }),
    ).rejects.toBeInstanceOf(InvalidCurrentPasswordError);
  });

  it('rejects missing user', async () => {
    const useCase = new ChangePasswordUseCase(
      createMockTransactionManager(),
      {
        findEntityById: jest.fn().mockResolvedValue(null),
      } as unknown as IUserRepository,
      {
        revokeAllForUser: jest.fn(),
      } as unknown as IRefreshTokenRepository,
    );

    await expect(
      useCase.execute({
        userId: 'missing',
        currentPassword: 'oldpassword',
        newPassword: 'newpassword',
      }),
    ).rejects.toBeInstanceOf(UserNotFoundError);
  });
});
