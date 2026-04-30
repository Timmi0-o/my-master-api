import { Inject, Injectable } from '@nestjs/common';
import { UserEntity } from '../../domain/user.entity';
import {
  USERS_REPOSITORY,
  UsersRepositoryPort,
} from '../users.repository.port';

@Injectable()
export class ListUsersUseCase {
  constructor(
    @Inject(USERS_REPOSITORY)
    private readonly usersRepository: UsersRepositoryPort,
  ) {}

  execute(limit: number, offset: number): Promise<UserEntity[]> {
    return this.usersRepository.findMany({
      take: limit,
      skip: offset,
    });
  }
}
