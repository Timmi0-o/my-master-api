import { Controller, Get, Query } from '@nestjs/common';
import { UserValidator } from 'src/validators/users/user.validator';
import { GetUsersUseCase } from '../../application/use-cases/user/get-users.usecase';

@Controller('users')
export class UsersController {
  constructor(
    private readonly getUsersUseCase: GetUsersUseCase,
    private readonly userValidator: UserValidator,
  ) {}

  @Get()
  async getUsers(@Query() query: Record<string, unknown>) {
    const validated = this.userValidator.validateGetUsersQuery(query);

    return await this.getUsersUseCase.execute({
      ...validated,
      isStaffUser: false,
    });
  }
}
