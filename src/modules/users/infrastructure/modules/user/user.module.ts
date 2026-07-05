import { Module } from '@nestjs/common';
import { TRANSACTION_MANAGER_TOKEN } from '@shared/domain/transactions';
import type { ITransactionManager } from '@shared/domain/transactions';
import { AuthorizationModule } from '@modules/authorization/authorization.module';
import type { IRoleRepository } from 'src/modules/authorization/domain/repositories/role/i-role.repository';
import { ROLE_REPOSITORY_TOKEN } from 'src/modules/authorization/domain/repositories/role/role.repository.tokens';
import { AssignUserRoleUseCase } from '../../../application/use-cases/user/assign-user-role.use-case';
import { GetUsersUseCase } from '../../../application/use-cases/user/get-users.use-case';
import type { IUserRepository } from '../../../domain/repositories/user/i-user.repository';
import { USER_REPOSITORY_TOKEN } from '../../../domain/repositories/user/user.repository.tokens';
import { UserRepositoryModule } from '../user-repository/user-repository.module';

@Module({
  imports: [UserRepositoryModule, AuthorizationModule],
  providers: [
    {
      provide: GetUsersUseCase,
      useFactory: (userRepository: IUserRepository) =>
        new GetUsersUseCase(userRepository),
      inject: [USER_REPOSITORY_TOKEN],
    },
    {
      provide: AssignUserRoleUseCase,
      useFactory: (
        transactionManager: ITransactionManager,
        userRepository: IUserRepository,
        roleRepository: IRoleRepository,
      ) =>
        new AssignUserRoleUseCase(
          transactionManager,
          userRepository,
          roleRepository,
        ),
      inject: [
        TRANSACTION_MANAGER_TOKEN,
        USER_REPOSITORY_TOKEN,
        ROLE_REPOSITORY_TOKEN,
      ],
    },
  ],
  exports: [
    UserRepositoryModule,
    GetUsersUseCase,
    AssignUserRoleUseCase,
  ],
})
export class UserModule {}
