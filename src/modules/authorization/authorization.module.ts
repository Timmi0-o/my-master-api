import { Module } from '@nestjs/common';
import { AuthGuardsModule } from '@modules/auth/infrastructure/modules/auth-guards/auth-guards.module';
import type { ITransactionManager } from '@shared/domain/transactions';
import { TRANSACTION_MANAGER_TOKEN } from '@shared/domain/transactions';
import { AuthorizeRequestUseCase } from './application/use-cases/auth/authorize-request.use-case';
import { FindAuthorizationContextByUserIdUseCase } from './application/use-cases/auth/find-authorization-context-by-user-id.use-case';
import { GetPermissionsUseCase } from './application/use-cases/permission/get-permissions.use-case';
import { GetRolePermissionsUseCase } from './application/use-cases/role-permission/get-role-permissions.use-case';
import { GrantRolePermissionUseCase } from './application/use-cases/role-permission/grant-role-permission.use-case';
import { RevokeRolePermissionUseCase } from './application/use-cases/role-permission/revoke-role-permission.use-case';
import { GetRoleByIdUseCase } from './application/use-cases/role/get-role-by-id.use-case';
import { GetRolesUseCase } from './application/use-cases/role/get-roles.use-case';
import { AUTHORIZATION_CONTEXT_REPOSITORY_TOKEN } from './domain/repositories/authorization-context/authorization-context.repository.tokens';
import type { IAuthorizationContextRepository } from './domain/repositories/authorization-context/i-authorization-context.repository';
import type { IPermissionRepository } from './domain/repositories/permission/i-permission.repository';
import { PERMISSION_REPOSITORY_TOKEN } from './domain/repositories/permission/permission.repository.tokens';
import type { IRolePermissionRepository } from './domain/repositories/role-permission/i-role-permission.repository';
import { ROLE_PERMISSION_REPOSITORY_TOKEN } from './domain/repositories/role-permission/role-permission.repository.tokens';
import type { IRoleRepository } from './domain/repositories/role/i-role.repository';
import { ROLE_REPOSITORY_TOKEN } from './domain/repositories/role/role.repository.tokens';
import { PrismaAuthorizationContextRepository } from './infrastructure/persistence/repositories/authorization-context/prisma-authorization-context.repository';
import { PrismaPermissionRepository } from './infrastructure/persistence/repositories/permission/prisma-permission.repository';
import { PrismaRolePermissionRepository } from './infrastructure/persistence/repositories/role-permission/prisma-role-permission.repository';
import { PrismaRoleRepository } from './infrastructure/persistence/repositories/role/prisma-role.repository';
import { AuthorizeGuard } from './presentation/guards/authorize.guard';
import { PermissionsController } from './presentation/http/controllers/permissions.controller';
import { RolePermissionsController } from './presentation/http/controllers/role-permissions.controller';
import { RolesController } from './presentation/http/controllers/roles.controller';

@Module({
  imports: [AuthGuardsModule],
  controllers: [
    PermissionsController,
    RolesController,
    RolePermissionsController,
  ],
  providers: [
    AuthorizeGuard,
    {
      provide: ROLE_REPOSITORY_TOKEN,
      useClass: PrismaRoleRepository,
    },
    {
      provide: PERMISSION_REPOSITORY_TOKEN,
      useClass: PrismaPermissionRepository,
    },
    {
      provide: ROLE_PERMISSION_REPOSITORY_TOKEN,
      useClass: PrismaRolePermissionRepository,
    },
    {
      provide: AUTHORIZATION_CONTEXT_REPOSITORY_TOKEN,
      useClass: PrismaAuthorizationContextRepository,
    },
    {
      provide: GetPermissionsUseCase,
      useFactory: (permissionRepository: IPermissionRepository) =>
        new GetPermissionsUseCase(permissionRepository),
      inject: [PERMISSION_REPOSITORY_TOKEN],
    },
    {
      provide: GetRolesUseCase,
      useFactory: (roleRepository: IRoleRepository) =>
        new GetRolesUseCase(roleRepository),
      inject: [ROLE_REPOSITORY_TOKEN],
    },
    {
      provide: GetRoleByIdUseCase,
      useFactory: (roleRepository: IRoleRepository) =>
        new GetRoleByIdUseCase(roleRepository),
      inject: [ROLE_REPOSITORY_TOKEN],
    },
    {
      provide: GetRolePermissionsUseCase,
      useFactory: (
        roleRepository: IRoleRepository,
        rolePermissionRepository: IRolePermissionRepository,
      ) =>
        new GetRolePermissionsUseCase(roleRepository, rolePermissionRepository),
      inject: [ROLE_REPOSITORY_TOKEN, ROLE_PERMISSION_REPOSITORY_TOKEN],
    },
    {
      provide: GrantRolePermissionUseCase,
      useFactory: (
        transactionManager: ITransactionManager,
        roleRepository: IRoleRepository,
        permissionRepository: IPermissionRepository,
        rolePermissionRepository: IRolePermissionRepository,
      ) =>
        new GrantRolePermissionUseCase(
          transactionManager,
          roleRepository,
          permissionRepository,
          rolePermissionRepository,
        ),
      inject: [
        TRANSACTION_MANAGER_TOKEN,
        ROLE_REPOSITORY_TOKEN,
        PERMISSION_REPOSITORY_TOKEN,
        ROLE_PERMISSION_REPOSITORY_TOKEN,
      ],
    },
    {
      provide: RevokeRolePermissionUseCase,
      useFactory: (
        transactionManager: ITransactionManager,
        roleRepository: IRoleRepository,
        permissionRepository: IPermissionRepository,
        rolePermissionRepository: IRolePermissionRepository,
      ) =>
        new RevokeRolePermissionUseCase(
          transactionManager,
          roleRepository,
          permissionRepository,
          rolePermissionRepository,
        ),
      inject: [
        TRANSACTION_MANAGER_TOKEN,
        ROLE_REPOSITORY_TOKEN,
        PERMISSION_REPOSITORY_TOKEN,
        ROLE_PERMISSION_REPOSITORY_TOKEN,
      ],
    },
    {
      provide: FindAuthorizationContextByUserIdUseCase,
      useFactory: (
        authorizationContextRepository: IAuthorizationContextRepository,
      ) =>
        new FindAuthorizationContextByUserIdUseCase(
          authorizationContextRepository,
        ),
      inject: [AUTHORIZATION_CONTEXT_REPOSITORY_TOKEN],
    },
    {
      provide: AuthorizeRequestUseCase,
      useFactory: (
        authorizationContextRepository: IAuthorizationContextRepository,
      ) => new AuthorizeRequestUseCase(authorizationContextRepository),
      inject: [AUTHORIZATION_CONTEXT_REPOSITORY_TOKEN],
    },
  ],
  exports: [
    AuthorizeGuard,
    ROLE_REPOSITORY_TOKEN,
    PERMISSION_REPOSITORY_TOKEN,
    ROLE_PERMISSION_REPOSITORY_TOKEN,
    AUTHORIZATION_CONTEXT_REPOSITORY_TOKEN,
    GetPermissionsUseCase,
    GetRolesUseCase,
    GetRoleByIdUseCase,
    GetRolePermissionsUseCase,
    GrantRolePermissionUseCase,
    RevokeRolePermissionUseCase,
    FindAuthorizationContextByUserIdUseCase,
    AuthorizeRequestUseCase,
  ],
})
export class AuthorizationModule {}
