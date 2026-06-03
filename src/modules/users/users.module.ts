import { Module } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/presentation/guards/jwt-auth.guard';
import { CreateUserProfileUseCase } from './application/use-cases/user-profile/create-user-profile.use-case';
import { DeleteUserProfileByIdUseCase } from './application/use-cases/user-profile/delete-user-profile-by-id.use-case';
import { GetUserProfileByIdUseCase } from './application/use-cases/user-profile/get-user-profile-by-id.use-case';
import { GetUserProfilesUseCase } from './application/use-cases/user-profile/get-user-profiles.use-case';
import { GetMyUserProfileUseCase } from './application/use-cases/user-profile/get-my-user-profile.use-case';
import { UpdateUserProfileByIdUseCase } from './application/use-cases/user-profile/update-user-profile-by-id.use-case';
import { GetUsersUseCase } from './application/use-cases/user/get-users.use-case';
import type { IUserProfileRepository } from './domain/repositories/user-profile/i-user-profile.repository';
import { USER_PROFILE_REPOSITORY_TOKEN } from './domain/repositories/user-profile/user-profile.repository.tokens';
import type { IUserRepository } from './domain/repositories/user/i-user.repository';
import { USER_REPOSITORY_TOKEN } from './domain/repositories/user/user.repository.tokens';
import { PrismaUserProfileRepository } from './infrastructure/persistence/repositories/user-profile/prisma-user-profile.repository';
import { PrismaUserRepository } from './infrastructure/persistence/repositories/user/prisma-user.repository';
import { UserProfilesController } from './presentation/http/controllers/user-profiles.controller';
import { UsersController } from './presentation/http/controllers/users.controller';
import { UserProfileValidator } from './presentation/http/validation/user-profile.validator';
import { UserValidator } from './presentation/http/validation/user.validator';

@Module({
  controllers: [UsersController, UserProfilesController],
  providers: [
    UserValidator,
    UserProfileValidator,
    JwtAuthGuard,
    {
      provide: USER_REPOSITORY_TOKEN,
      useClass: PrismaUserRepository,
    },
    {
      provide: USER_PROFILE_REPOSITORY_TOKEN,
      useClass: PrismaUserProfileRepository,
    },
    {
      provide: GetUsersUseCase,
      useFactory: (userRepository: IUserRepository) =>
        new GetUsersUseCase(userRepository),
      inject: [USER_REPOSITORY_TOKEN],
    },
    {
      provide: GetUserProfilesUseCase,
      useFactory: (repo: IUserProfileRepository) =>
        new GetUserProfilesUseCase(repo),
      inject: [USER_PROFILE_REPOSITORY_TOKEN],
    },
    {
      provide: GetUserProfileByIdUseCase,
      useFactory: (repo: IUserProfileRepository) =>
        new GetUserProfileByIdUseCase(repo),
      inject: [USER_PROFILE_REPOSITORY_TOKEN],
    },
    {
      provide: GetMyUserProfileUseCase,
      useFactory: (repo: IUserProfileRepository) =>
        new GetMyUserProfileUseCase(repo),
      inject: [USER_PROFILE_REPOSITORY_TOKEN],
    },
    {
      provide: CreateUserProfileUseCase,
      useFactory: (repo: IUserProfileRepository) =>
        new CreateUserProfileUseCase(repo),
      inject: [USER_PROFILE_REPOSITORY_TOKEN],
    },
    {
      provide: UpdateUserProfileByIdUseCase,
      useFactory: (repo: IUserProfileRepository) =>
        new UpdateUserProfileByIdUseCase(repo),
      inject: [USER_PROFILE_REPOSITORY_TOKEN],
    },
    {
      provide: DeleteUserProfileByIdUseCase,
      useFactory: (repo: IUserProfileRepository) =>
        new DeleteUserProfileByIdUseCase(repo),
      inject: [USER_PROFILE_REPOSITORY_TOKEN],
    },
  ],
  exports: [USER_REPOSITORY_TOKEN, USER_PROFILE_REPOSITORY_TOKEN],
})
export class UsersModule {}
