import { Module } from '@nestjs/common';
import type { IUserRepository } from '../../../domain/repositories/user/i-user.repository';
import { USER_REPOSITORY_TOKEN } from '../../../domain/repositories/user/user.repository.tokens';
import { GetUsersUseCase } from '../../../application/use-cases/user/get-users.use-case';
import { PrismaUserRepository } from '../../persistence/repositories/user/prisma-user.repository';
import { UserValidator } from '../../../presentation/http/validation/user.validator';

@Module({
  providers: [
    UserValidator,
    {
      provide: USER_REPOSITORY_TOKEN,
      useClass: PrismaUserRepository,
    },
    {
      provide: GetUsersUseCase,
      useFactory: (userRepository: IUserRepository) =>
        new GetUsersUseCase(userRepository),
      inject: [USER_REPOSITORY_TOKEN],
    },
  ],
  exports: [USER_REPOSITORY_TOKEN, UserValidator, GetUsersUseCase],
})
export class UserModule {}
