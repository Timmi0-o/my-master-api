import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import type { ISessionUser } from 'src/modules/shared/domain/i-session-user';
import { EUserStatus } from 'src/modules/users/domain/entities/user';
import type { IUserRepository } from 'src/modules/users/domain/repositories/user/i-user.repository';
import { USER_REPOSITORY } from 'src/modules/users/infrastructure/repositories/user.repository';

@Injectable()
export class GetMeUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(userId: string): Promise<ISessionUser> {
    const user = await this.userRepository.findSessionUserById(userId);

    if (!user || user.status !== EUserStatus.ACTIVE) {
      throw new UnauthorizedException('User is not active');
    }

    return user;
  }
}
