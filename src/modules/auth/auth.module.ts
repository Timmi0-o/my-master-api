import { Module } from '@nestjs/common';
import type { ITransactionManager } from '@shared/domain/transactions';
import { TRANSACTION_MANAGER_TOKEN } from '@shared/domain/transactions';
import type { IUserRepository } from '../users/domain/repositories/user/i-user.repository';
import { USER_REPOSITORY_TOKEN } from '../users/domain/repositories/user/user.repository.tokens';
import { UserModule } from '../users/infrastructure/modules/user/user.module';
import { GetMeUseCase } from './application/use-cases/get-me.use-case';
import { LoginUseCase } from './application/use-cases/login.use-case';
import { LogoutUseCase } from './application/use-cases/logout.use-case';
import { RefreshUseCase } from './application/use-cases/refresh.use-case';
import { RegisterUseCase } from './application/use-cases/register.use-case';
import { ValidateUserUseCase } from './application/use-cases/validate-user.use-case';
import {
  REFRESH_TOKEN_REPOSITORY_TOKEN,
  SESSION_REPOSITORY_TOKEN,
} from './domain/repositories/auth.repository.tokens';
import type { IRefreshTokenRepository } from './domain/repositories/i-refresh-token.repository';
import type { ISessionRepository } from './domain/repositories/i-session.repository';
import { AuthGuardsModule } from './infrastructure/modules/auth-guards/auth-guards.module';
import { PrismaRefreshTokenRepository } from './infrastructure/persistence/repositories/prisma-refresh-token.repository';
import { PrismaSessionRepository } from './infrastructure/persistence/repositories/prisma-session.repository';
import { TokenService } from './infrastructure/services/token.service';
import { LocalStrategy } from './infrastructure/strategies/local.strategy';
import { AuthController } from './presentation/http/controllers/auth.controller';

@Module({
  imports: [UserModule, AuthGuardsModule],
  controllers: [AuthController],
  providers: [
    TokenService,
    {
      provide: REFRESH_TOKEN_REPOSITORY_TOKEN,
      useClass: PrismaRefreshTokenRepository,
    },
    {
      provide: SESSION_REPOSITORY_TOKEN,
      useClass: PrismaSessionRepository,
    },
    {
      provide: ValidateUserUseCase,
      useFactory: (userRepository: IUserRepository) =>
        new ValidateUserUseCase(userRepository),
      inject: [USER_REPOSITORY_TOKEN],
    },
    {
      provide: LoginUseCase,
      useFactory: (
        tokenService: TokenService,
        transactionManager: ITransactionManager,
        userRepository: IUserRepository,
        refreshTokenRepository: IRefreshTokenRepository,
        sessionRepository: ISessionRepository,
      ) =>
        new LoginUseCase(
          tokenService,
          transactionManager,
          userRepository,
          refreshTokenRepository,
          sessionRepository,
        ),
      inject: [
        TokenService,
        TRANSACTION_MANAGER_TOKEN,
        USER_REPOSITORY_TOKEN,
        REFRESH_TOKEN_REPOSITORY_TOKEN,
        SESSION_REPOSITORY_TOKEN,
      ],
    },
    {
      provide: RegisterUseCase,
      useFactory: (
        transactionManager: ITransactionManager,
        userRepository: IUserRepository,
        loginUseCase: LoginUseCase,
      ) =>
        new RegisterUseCase(transactionManager, userRepository, loginUseCase),
      inject: [TRANSACTION_MANAGER_TOKEN, USER_REPOSITORY_TOKEN, LoginUseCase],
    },
    {
      provide: RefreshUseCase,
      useFactory: (
        tokenService: TokenService,
        transactionManager: ITransactionManager,
        userRepository: IUserRepository,
        refreshTokenRepository: IRefreshTokenRepository,
      ) =>
        new RefreshUseCase(
          tokenService,
          transactionManager,
          userRepository,
          refreshTokenRepository,
        ),
      inject: [
        TokenService,
        TRANSACTION_MANAGER_TOKEN,
        USER_REPOSITORY_TOKEN,
        REFRESH_TOKEN_REPOSITORY_TOKEN,
      ],
    },
    {
      provide: LogoutUseCase,
      useFactory: (
        tokenService: TokenService,
        transactionManager: ITransactionManager,
        refreshTokenRepository: IRefreshTokenRepository,
      ) =>
        new LogoutUseCase(
          tokenService,
          transactionManager,
          refreshTokenRepository,
        ),
      inject: [
        TokenService,
        TRANSACTION_MANAGER_TOKEN,
        REFRESH_TOKEN_REPOSITORY_TOKEN,
      ],
    },
    {
      provide: GetMeUseCase,
      useFactory: (userRepository: IUserRepository) =>
        new GetMeUseCase(userRepository),
      inject: [USER_REPOSITORY_TOKEN],
    },
    LocalStrategy,
  ],
  exports: [
    ValidateUserUseCase,
    LoginUseCase,
    RegisterUseCase,
    RefreshUseCase,
    LogoutUseCase,
    GetMeUseCase,
  ],
})
export class AuthModule {}
