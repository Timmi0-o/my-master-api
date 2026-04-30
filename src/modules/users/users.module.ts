import { Module } from '@nestjs/common';
import { PrismaModule } from '../shared/infrastructure/persistence/prisma/prisma.module';
import { GetUsersUseCase } from './application/use-cases/user/get-users.usecase';
import { IUserRepository } from './domain/repositories/user/i-user.repository';
import {
  USER_REPOSITORY,
  UserRepository,
} from './infrastructure/repositories/user.repository';
import { UsersController } from './presentation/controllers/users.controller';

@Module({
  imports: [PrismaModule],
  controllers: [UsersController],
  providers: [
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
})
export class UsersModule {}
