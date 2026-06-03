import * as bcrypt from 'bcrypt';
import { EUserStatus, type IUserEntity } from 'src/modules/users/domain/entities/user';
import type { IUserRepository } from 'src/modules/users/domain/repositories/user/i-user.repository';
import { UserNotActiveError } from 'src/modules/users/domain/errors/user-not-active.error';

export class ValidateUserUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(email: string, password: string): Promise<IUserEntity | null> {
    const user = await this.userRepository.findByEmail(email);
    if (!user || user.deletedAt) return null;

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) return null;

    if (user.status !== EUserStatus.ACTIVE) {
      throw new UserNotActiveError(user.id);
    }

    return user;
  }
}
