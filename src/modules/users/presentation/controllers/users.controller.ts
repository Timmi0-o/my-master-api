import { Controller, Get, Query } from '@nestjs/common';
import type { IGetMetadata } from 'src/modules/shared/domain/decorators/i-get-metadata';
import type { IRawQuery } from 'src/modules/shared/domain/i-query.dto';
import { GetMetadata } from 'src/modules/shared/presentation/decorators/get-metadata';
import { UserValidator } from 'src/validators/users/user.validator';
import { GetUsersUseCase } from '../../application/use-cases/user/get-users.usecase';

@Controller('users')
export class UsersController {
  constructor(
    private readonly getUsersUseCase: GetUsersUseCase,
    private readonly userValidator: UserValidator,
  ) {}

  @Get()
  async getUsers(
    @Query() query: IRawQuery,
    @GetMetadata() metadata: IGetMetadata,
  ) {
    const validatedQuery = this.userValidator.validateGetUsersQuery(query);

    return await this.getUsersUseCase.execute(validatedQuery, metadata);
  }
}
