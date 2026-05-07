import { Module } from '@nestjs/common';
import { PrismaModule } from '../shared/infrastructure/persistence/prisma/prisma.module';
import { GetUsersUseCase } from './application/use-cases/user/get-users.usecase';
import { IUserRepository } from './domain/repositories/user/i-user.repository';
import {
  USER_REPOSITORY,
  UserRepository,
} from './infrastructure/repositories/user.repository';
import { UsersController } from './presentation/controllers/users.controller';
import { UserValidator } from 'src/validators/users/user.validator';
import { JwtAuthGuard } from '../auth/presentation/guards/jwt-auth.guard';

@Module({
  imports: [PrismaModule],
  controllers: [UsersController],
  providers: [
    UserValidator,
    JwtAuthGuard,
    {
      provide: USER_REPOSITORY,
      useClass: UserRepository,
    },
    {
      provide: GetUsersUseCase,
      useFactory: (userRepository: IUserRepository) =>
        new GetUsersUseCase(userRepository),
      inject: [USER_REPOSITORY],
    },
  ],
  exports: [USER_REPOSITORY],
})
export class UsersModule {}
