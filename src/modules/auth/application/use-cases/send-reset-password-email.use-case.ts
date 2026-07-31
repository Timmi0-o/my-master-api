import { randomBytes } from 'crypto';
import type { IMailer } from '@shared/domain/mailer';
import { EUserStatus } from 'src/modules/users/domain/entities/user';
import type { IUserRepository } from 'src/modules/users/domain/repositories/user/i-user.repository';
import type { IPasswordResetTokenRepository } from '../../domain/repositories/i-password-reset-token.repository';
import type { TokenService } from '../../infrastructure/services/token.service';
import { buildPasswordResetEmail } from '../services/build-password-reset-email';

const PASSWORD_RESET_TOKEN_TTL_MS = 60 * 60 * 1000;

export class SendResetPasswordEmailUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly passwordResetTokenRepository: IPasswordResetTokenRepository,
    private readonly tokenService: TokenService,
    private readonly mailer: IMailer,
    private readonly appWebUrl: string,
  ) {}

  async execute(email: string): Promise<{ ok: true }> {
    const user = await this.userRepository.findByEmail(email.trim());

    if (!user || user.status !== EUserStatus.ACTIVE || user.deletedAt) {
      return { ok: true };
    }

    const rawToken = randomBytes(32).toString('hex');
    const tokenHash = this.tokenService.hashToken(rawToken);
    const expiresAt = new Date(Date.now() + PASSWORD_RESET_TOKEN_TTL_MS);

    await this.passwordResetTokenRepository.deleteUnusedForUser(user.id);
    await this.passwordResetTokenRepository.create({
      userId: user.id,
      tokenHash,
      expiresAt,
    });

    const resetUrl = `${this.appWebUrl}/reset-password?token=${rawToken}`;
    const emailContent = buildPasswordResetEmail(resetUrl);

    await this.mailer.sendMail({
      to: user.email,
      subject: emailContent.subject,
      html: emailContent.html,
      text: emailContent.text,
    });

    return { ok: true };
  }
}
