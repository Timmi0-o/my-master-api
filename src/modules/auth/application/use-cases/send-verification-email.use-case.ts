import { randomBytes } from 'crypto';
import type { IMailer } from '@shared/domain/mailer';
import type { EmailMessageFactory } from '@shared/infrastructure/mailer/email-message.factory';
import { EMAIL_VERIFICATION_TOKEN_TTL_MS } from 'src/modules/auth/domain/entities/email-verification-token';
import {
  EUserLanguage,
  EUserStatus,
} from 'src/modules/users/domain/entities/user';
import type { IUserRepository } from 'src/modules/users/domain/repositories/user/i-user.repository';
import type { IEmailVerificationTokenRepository } from '../../domain/repositories/i-email-verification-token.repository';
import type { TokenService } from '../../infrastructure/services/token.service';

export class SendVerificationEmailUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly emailVerificationTokenRepository: IEmailVerificationTokenRepository,
    private readonly tokenService: TokenService,
    private readonly mailer: IMailer,
    private readonly emailMessageFactory: EmailMessageFactory,
    private readonly appWebUrl: string,
  ) {}

  async execute(email: string): Promise<{ ok: true }> {
    const user = await this.userRepository.findByEmail(email.trim());

    if (
      !user ||
      user.status !== EUserStatus.ACTIVE ||
      user.deletedAt ||
      user.emailVerifiedAt
    ) {
      return { ok: true };
    }

    await this.sendForUser(user.id, user.email, user.language);
    return { ok: true };
  }

  async sendForUser(
    userId: string,
    email: string,
    language: EUserLanguage = EUserLanguage.RU,
  ): Promise<void> {
    const rawToken = randomBytes(32).toString('hex');
    const tokenHash = this.tokenService.hashToken(rawToken);
    const expiresAt = new Date(Date.now() + EMAIL_VERIFICATION_TOKEN_TTL_MS);

    await this.emailVerificationTokenRepository.deleteUnusedForUser(userId);
    await this.emailVerificationTokenRepository.create({
      userId,
      tokenHash,
      expiresAt,
    });

    const verifyUrl = `${this.appWebUrl}/verify-email?token=${rawToken}`;
    const emailContent = this.emailMessageFactory.buildVerification({
      language,
      verifyUrl,
    });

    await this.mailer.sendMail({
      to: email,
      subject: emailContent.subject,
      html: emailContent.html,
      text: emailContent.text,
    });
  }
}
