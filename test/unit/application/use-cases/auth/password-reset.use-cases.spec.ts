import { createHash } from 'crypto';
import { InvalidResetPasswordTokenError } from 'src/modules/auth/domain/entities/password-reset-token';
import { ResetPasswordUseCase } from 'src/modules/auth/application/use-cases/reset-password.use-case';
import { SendResetPasswordEmailUseCase } from 'src/modules/auth/application/use-cases/send-reset-password-email.use-case';
import { ValidateResetPasswordTokenUseCase } from 'src/modules/auth/application/use-cases/validate-reset-password-token.use-case';
import type { IPasswordResetTokenRepository } from 'src/modules/auth/domain/repositories/i-password-reset-token.repository';
import type { IRefreshTokenRepository } from 'src/modules/auth/domain/repositories/i-refresh-token.repository';
import type { TokenService } from 'src/modules/auth/infrastructure/services/token.service';
import { EUserStatus } from 'src/modules/users/domain/entities/user';
import type { IUserRepository } from 'src/modules/users/domain/repositories/user/i-user.repository';
import type { IMailer } from '@shared/domain/mailer';
import { createMockTransactionManager } from '../../../../support/mocks/transaction-manager.mock';

function hashToken(token: string): string {
  return createHash('sha256').update(token).digest('hex');
}

describe('password reset use cases', () => {
  const tokenService = {
    hashToken,
  } as unknown as TokenService;

  it('SendResetPasswordEmailUseCase returns ok for unknown email without mailing', async () => {
    const mailer: IMailer = { sendMail: jest.fn() };
    const passwordResetTokenRepository = {
      deleteUnusedForUser: jest.fn(),
      create: jest.fn(),
    } as unknown as IPasswordResetTokenRepository;

    const useCase = new SendResetPasswordEmailUseCase(
      {
        findByEmail: jest.fn().mockResolvedValue(null),
      } as unknown as IUserRepository,
      passwordResetTokenRepository,
      tokenService,
      mailer,
      'http://localhost:3000',
    );

    await expect(useCase.execute('missing@example.com')).resolves.toEqual({
      ok: true,
    });
    expect(mailer.sendMail).not.toHaveBeenCalled();
    expect(passwordResetTokenRepository.create).not.toHaveBeenCalled();
  });

  it('SendResetPasswordEmailUseCase returns ok for inactive user without mailing', async () => {
    const mailer: IMailer = { sendMail: jest.fn() };
    const useCase = new SendResetPasswordEmailUseCase(
      {
        findByEmail: jest.fn().mockResolvedValue({
          id: 'u1',
          email: 'user@example.com',
          status: EUserStatus.PENDING,
          deletedAt: null,
        }),
      } as unknown as IUserRepository,
      {
        deleteUnusedForUser: jest.fn(),
        create: jest.fn(),
      } as unknown as IPasswordResetTokenRepository,
      tokenService,
      mailer,
      'http://localhost:3000',
    );

    await expect(useCase.execute('user@example.com')).resolves.toEqual({
      ok: true,
    });
    expect(mailer.sendMail).not.toHaveBeenCalled();
  });

  it('ValidateResetPasswordTokenUseCase accepts valid unused token', async () => {
    const raw = 'abc123';
    const useCase = new ValidateResetPasswordTokenUseCase(
      {
        findByHash: jest.fn().mockResolvedValue({
          id: 't1',
          userId: 'u1',
          tokenHash: hashToken(raw),
          expiresAt: new Date(Date.now() + 60_000),
          usedAt: null,
          createdAt: new Date(),
        }),
      } as unknown as IPasswordResetTokenRepository,
      tokenService,
    );

    await expect(useCase.execute(raw)).resolves.toEqual({ valid: true });
  });

  it('ValidateResetPasswordTokenUseCase rejects expired or used token', async () => {
    const raw = 'abc123';
    const expiredUseCase = new ValidateResetPasswordTokenUseCase(
      {
        findByHash: jest.fn().mockResolvedValue({
          id: 't1',
          userId: 'u1',
          tokenHash: hashToken(raw),
          expiresAt: new Date(Date.now() - 1),
          usedAt: null,
          createdAt: new Date(),
        }),
      } as unknown as IPasswordResetTokenRepository,
      tokenService,
    );

    await expect(expiredUseCase.execute(raw)).rejects.toBeInstanceOf(
      InvalidResetPasswordTokenError,
    );

    const usedUseCase = new ValidateResetPasswordTokenUseCase(
      {
        findByHash: jest.fn().mockResolvedValue({
          id: 't1',
          userId: 'u1',
          tokenHash: hashToken(raw),
          expiresAt: new Date(Date.now() + 60_000),
          usedAt: new Date(),
          createdAt: new Date(),
        }),
      } as unknown as IPasswordResetTokenRepository,
      tokenService,
    );

    await expect(usedUseCase.execute(raw)).rejects.toBeInstanceOf(
      InvalidResetPasswordTokenError,
    );
  });

  it('ResetPasswordUseCase updates password, revokes refresh tokens and marks token used', async () => {
    const raw = 'reset-token';
    const passwordResetTokenRepository = {
      findByHash: jest.fn().mockResolvedValue({
        id: 't1',
        userId: 'u1',
        tokenHash: hashToken(raw),
        expiresAt: new Date(Date.now() + 60_000),
        usedAt: null,
        createdAt: new Date(),
      }),
      markUsed: jest.fn().mockResolvedValue(undefined),
    } as unknown as IPasswordResetTokenRepository;

    const userRepository = {
      update: jest.fn().mockResolvedValue({ id: 'u1' }),
    } as unknown as IUserRepository;

    const refreshTokenRepository = {
      revokeAllForUser: jest.fn().mockResolvedValue(undefined),
    } as unknown as IRefreshTokenRepository;

    const validateUseCase = new ValidateResetPasswordTokenUseCase(
      passwordResetTokenRepository,
      tokenService,
    );

    const useCase = new ResetPasswordUseCase(
      createMockTransactionManager(),
      userRepository,
      refreshTokenRepository,
      passwordResetTokenRepository,
      validateUseCase,
    );

    await expect(
      useCase.execute({ token: raw, password: 'newpassword' }),
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
    expect(passwordResetTokenRepository.markUsed).toHaveBeenCalledWith(
      't1',
      expect.anything(),
    );
  });
});
