import { Module } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/presentation/guards/jwt-auth.guard';
import { GetUsersUseCase } from './application/use-cases/user/get-users.use-case';
import type { IUserRepository } from './domain/repositories/user/i-user.repository';
import { USER_REPOSITORY_TOKEN } from './domain/repositories/user/user.repository.tokens';
import { PrismaUserRepository } from './infrastructure/persistence/repositories/user/prisma-user.repository';
import { UsersController } from './presentation/http/controllers/users.controller';
import { UserValidator } from './presentation/http/validation/user.validator';

@Module({
  controllers: [UsersController],
  providers: [
    UserValidator,
    JwtAuthGuard,
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
  exports: [USER_REPOSITORY_TOKEN],
})
export class UsersModule {}
