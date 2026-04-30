import { Controller, Get } from '@nestjs/common';
import { GetUsersUseCase } from '../../application/use-cases/user/get-users.usecase';
import { IUserEntity } from '../../domain/entities';

@Controller('users')
export class UsersController {
  constructor(private readonly getUsersUseCase: GetUsersUseCase) {}

  @Get()
  async getUsers(): Promise<IUserEntity[]> {
    return await this.getUsersUseCase.execute();
  }
}
