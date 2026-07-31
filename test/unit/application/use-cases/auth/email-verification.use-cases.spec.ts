import { createHash } from 'crypto';
import { SendVerificationEmailUseCase } from 'src/modules/auth/application/use-cases/send-verification-email.use-case';
import { VerifyEmailUseCase } from 'src/modules/auth/application/use-cases/verify-email.use-case';
import { InvalidEmailVerificationTokenError } from 'src/modules/auth/domain/entities/email-verification-token';
import type { IEmailVerificationTokenRepository } from 'src/modules/auth/domain/repositories/i-email-verification-token.repository';
import type { TokenService } from 'src/modules/auth/infrastructure/services/token.service';
import { EUserStatus } from 'src/modules/users/domain/entities/user';
import type { IUserRepository } from 'src/modules/users/domain/repositories/user/i-user.repository';
import type { IMailer } from '@shared/domain/mailer';
import { createMockTransactionManager } from '../../../../support/mocks/transaction-manager.mock';

function hashToken(token: string): string {
  return createHash('sha256').update(token).digest('hex');
}

describe('email verification use cases', () => {
  const tokenService = {
    hashToken,
  } as unknown as TokenService;

  it('SendVerificationEmailUseCase returns ok for unknown email without mailing', async () => {
    const mailer: IMailer = { sendMail: jest.fn() };
    const emailVerificationTokenRepository = {
      deleteUnusedForUser: jest.fn(),
      create: jest.fn(),
    } as unknown as IEmailVerificationTokenRepository;

    const useCase = new SendVerificationEmailUseCase(
      {
        findByEmail: jest.fn().mockResolvedValue(null),
      } as unknown as IUserRepository,
      emailVerificationTokenRepository,
      tokenService,
      mailer,
      'http://localhost:3000',
    );

    await expect(useCase.execute('missing@example.com')).resolves.toEqual({
      ok: true,
    });
    expect(mailer.sendMail).not.toHaveBeenCalled();
    expect(emailVerificationTokenRepository.create).not.toHaveBeenCalled();
  });

  it('SendVerificationEmailUseCase returns ok for already verified user without mailing', async () => {
    const mailer: IMailer = { sendMail: jest.fn() };
    const useCase = new SendVerificationEmailUseCase(
      {
        findByEmail: jest.fn().mockResolvedValue({
          id: 'u1',
          email: 'user@example.com',
          status: EUserStatus.ACTIVE,
          deletedAt: null,
          emailVerifiedAt: new Date(),
        }),
      } as unknown as IUserRepository,
      {
        deleteUnusedForUser: jest.fn(),
        create: jest.fn(),
      } as unknown as IEmailVerificationTokenRepository,
      tokenService,
      mailer,
      'http://localhost:3000',
    );

    await expect(useCase.execute('user@example.com')).resolves.toEqual({
      ok: true,
    });
    expect(mailer.sendMail).not.toHaveBeenCalled();
  });

  it('VerifyEmailUseCase confirms valid unused token', async () => {
    const raw = 'verify-token';
    const userRepository = {
      update: jest.fn().mockResolvedValue({ id: 'u1' }),
    } as unknown as IUserRepository;
    const emailVerificationTokenRepository = {
      findByHash: jest.fn().mockResolvedValue({
        id: 't1',
        userId: 'u1',
        tokenHash: hashToken(raw),
        expiresAt: new Date(Date.now() + 60_000),
        usedAt: null,
        createdAt: new Date(),
      }),
      markUsed: jest.fn(),
      deleteUnusedForUser: jest.fn(),
    } as unknown as IEmailVerificationTokenRepository;

    const useCase = new VerifyEmailUseCase(
      createMockTransactionManager(),
      userRepository,
      emailVerificationTokenRepository,
      tokenService,
    );

    await expect(useCase.execute(raw)).resolves.toEqual({ ok: true });
    expect(userRepository.update).toHaveBeenCalledWith(
      'u1',
      expect.objectContaining({ emailVerifiedAt: expect.any(Date) }),
      expect.anything(),
    );
    expect(emailVerificationTokenRepository.markUsed).toHaveBeenCalledWith(
      't1',
      expect.anything(),
    );
  });

  it('VerifyEmailUseCase rejects expired or used token', async () => {
    const raw = 'verify-token';
    const expiredUseCase = new VerifyEmailUseCase(
      createMockTransactionManager(),
      { update: jest.fn() } as unknown as IUserRepository,
      {
        findByHash: jest.fn().mockResolvedValue({
          id: 't1',
          userId: 'u1',
          tokenHash: hashToken(raw),
          expiresAt: new Date(Date.now() - 1),
          usedAt: null,
          createdAt: new Date(),
        }),
        markUsed: jest.fn(),
        deleteUnusedForUser: jest.fn(),
      } as unknown as IEmailVerificationTokenRepository,
      tokenService,
    );

    await expect(expiredUseCase.execute(raw)).rejects.toBeInstanceOf(
      InvalidEmailVerificationTokenError,
    );
  });
});
