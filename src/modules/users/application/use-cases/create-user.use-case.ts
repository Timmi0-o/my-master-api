import { Inject, Injectable } from '@nestjs/common';
import {
  CreateUserRecord,
  USERS_REPOSITORY,
  UsersRepositoryPort,
} from '../users.repository.port';
import { UserEntity } from '../../domain/user.entity';

@Injectable()
export class CreateUserUseCase {
  constructor(
    @Inject(USERS_REPOSITORY)
    private readonly usersRepository: UsersRepositoryPort,
  ) {}

  execute(input: CreateUserRecord): Promise<UserEntity> {
    return this.usersRepository.create(input);
  }
}
