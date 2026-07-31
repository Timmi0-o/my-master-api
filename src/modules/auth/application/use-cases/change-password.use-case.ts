import type { ITransactionManager } from '@shared/domain/transactions';
import * as bcrypt from 'bcrypt';
import {
  UserNotFoundError,
  type IUserEntity,
} from 'src/modules/users/domain/entities/user';
import type { IUserRepository } from 'src/modules/users/domain/repositories/user/i-user.repository';
import { InvalidCurrentPasswordError } from '../../domain/entities/password-reset-token';
import type { IRefreshTokenRepository } from '../../domain/repositories/i-refresh-token.repository';

const BCRYPT_ROUNDS = 10;

export class ChangePasswordUseCase {
  constructor(
    private readonly transactionManager: ITransactionManager,
    private readonly userRepository: IUserRepository,
    private readonly refreshTokenRepository: IRefreshTokenRepository,
  ) {}

  async execute(input: {
    userId: string;
    currentPassword: string;
    newPassword: string;
  }): Promise<{ ok: true }> {
    const user = await this.userRepository.findEntityById(input.userId);
    if (!user || user.deletedAt) {
      throw new UserNotFoundError(input.userId);
    }

    await this.assertCurrentPassword(user, input.currentPassword);

    const passwordHash = await bcrypt.hash(input.newPassword, BCRYPT_ROUNDS);

    await this.transactionManager.runInTransaction(async (scope) => {
      await this.userRepository.update(user.id, { passwordHash }, scope);
      await this.refreshTokenRepository.revokeAllForUser(user.id, scope);
    });

    return { ok: true };
  }

  private async assertCurrentPassword(
    user: IUserEntity,
    currentPassword: string,
  ): Promise<void> {
    const isValid = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!isValid) {
      throw new InvalidCurrentPasswordError();
    }
  }
}
