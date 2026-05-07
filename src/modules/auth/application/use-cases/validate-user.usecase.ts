import { ForbiddenException, Inject, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import type { IUserEntity } from 'src/modules/users/domain/entities/user';
import { EUserStatus } from 'src/modules/users/domain/entities/user';
import type { IUserRepository } from 'src/modules/users/domain/repositories/user/i-user.repository';
import { USER_REPOSITORY } from 'src/modules/users/infrastructure/repositories/user.repository';

@Injectable()
export class ValidateUserUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(
    identifier: string,
    password: string,
  ): Promise<IUserEntity | null> {
    const user = await this.userRepository.findByEmailOrUsername(identifier);
    if (!user || user.deletedAt) return null;

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) return null;

    if (user.status !== EUserStatus.ACTIVE) {
      throw new ForbiddenException('User is not active');
    }

    return user;
  }
}
