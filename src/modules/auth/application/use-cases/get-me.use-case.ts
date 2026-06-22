import type { ISessionUser } from 'src/modules/shared/domain/i-session-user';
import { EUserStatus } from 'src/modules/users/domain/entities/user';
import type { IUserRepository } from 'src/modules/users/domain/repositories/user/i-user.repository';
import { UserNotActiveError, UserNotFoundError } from 'src/modules/users/domain/entities/user';

export class GetMeUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(userId: string): Promise<ISessionUser> {
    const user = await this.userRepository.findSessionUserById(userId);

    if (!user) {
      throw new UserNotFoundError(userId);
    }

    if (user.status !== EUserStatus.ACTIVE) {
      throw new UserNotActiveError(userId);
    }

    return user;
  }
}
