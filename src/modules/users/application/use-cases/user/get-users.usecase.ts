import { Injectable } from '@nestjs/common';
import { IUserEntity } from 'src/modules/users/domain/entities';
import type { IUserRepository } from '../../../domain/repositories/user/i-user.repository';

@Injectable()
export class GetUsersUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(): Promise<IUserEntity[]> {
    return await this.userRepository.findMany();
  }
}
