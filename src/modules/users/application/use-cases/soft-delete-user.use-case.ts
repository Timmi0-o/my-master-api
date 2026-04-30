import { Inject, Injectable } from '@nestjs/common';
import {
  USERS_REPOSITORY,
  UsersRepositoryPort,
} from '../users.repository.port';
import { UserNotFoundError } from '../users.errors';

@Injectable()
export class SoftDeleteUserUseCase {
  constructor(
    @Inject(USERS_REPOSITORY)
    private readonly usersRepository: UsersRepositoryPort,
  ) {}

  async execute(id: string): Promise<void> {
    const isDeleted = await this.usersRepository.softDeleteById(id);

    if (!isDeleted) {
      throw new UserNotFoundError();
    }
  }
}
