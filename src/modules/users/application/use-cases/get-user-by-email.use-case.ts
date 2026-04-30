import { Inject, Injectable } from '@nestjs/common';
import {
  USERS_REPOSITORY,
  UsersRepositoryPort,
} from '../users.repository.port';
import { UserEntity } from '../../domain/user.entity';
import { UserNotFoundError } from '../users.errors';

@Injectable()
export class GetUserByEmailUseCase {
  constructor(
    @Inject(USERS_REPOSITORY)
    private readonly usersRepository: UsersRepositoryPort,
  ) {}

  async execute(email: string): Promise<UserEntity> {
    const user = await this.usersRepository.findByEmail(email);

    if (!user) {
      throw new UserNotFoundError();
    }

    return user;
  }
}
