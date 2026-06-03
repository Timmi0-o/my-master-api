import { Controller, Get, Query, UseFilters, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/modules/auth/presentation/guards/jwt-auth.guard';
import { DomainExceptionFilter } from 'src/modules/shared/infrastructure/filters/domain-exception.filter';
import type { IGetMetadata } from 'src/modules/shared/domain/decorators/i-get-metadata';
import type { IRawQuery } from 'src/modules/shared/domain/i-query.dto';
import { GetMetadata } from 'src/modules/shared/presentation/decorators/get-metadata';
import { GetUsersUseCase } from 'src/modules/users/application/use-cases/user/get-users.use-case';
import { queryToFindManyParams } from '../mappers/query-to-find-many-params.mapper';
import { mapGetUsersHttpResponse } from '../response/map-get-users-response';
import { UserValidator } from '../validation/user.validator';

@Controller({ path: 'users', version: '1' })
@UseFilters(DomainExceptionFilter)
@UseGuards(JwtAuthGuard)
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
    const payload = this.userValidator.validateGetUsersQuery(query);
    const params = queryToFindManyParams(payload, metadata);
    const output = await this.getUsersUseCase.execute(params);
    return mapGetUsersHttpResponse(output, payload);
  }
}
