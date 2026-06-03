import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { UsersModule } from '../users/users.module';
import { USER_REPOSITORY_TOKEN } from '../users/domain/repositories/user/user.repository.tokens';
import type { IUserRepository } from '../users/domain/repositories/user/i-user.repository';
import {
  REFRESH_TOKEN_REPOSITORY_TOKEN,
  SESSION_REPOSITORY_TOKEN,
} from './domain/repositories/auth.repository.tokens';
import type { IRefreshTokenRepository } from './domain/repositories/i-refresh-token.repository';
import type { ISessionRepository } from './domain/repositories/i-session.repository';
import { GetMeUseCase } from './application/use-cases/get-me.use-case';
import { LoginUseCase } from './application/use-cases/login.use-case';
import { LogoutUseCase } from './application/use-cases/logout.use-case';
import { RefreshUseCase } from './application/use-cases/refresh.use-case';
import { ValidateUserUseCase } from './application/use-cases/validate-user.use-case';
import { PrismaRefreshTokenRepository } from './infrastructure/persistence/repositories/prisma-refresh-token.repository';
import { PrismaSessionRepository } from './infrastructure/persistence/repositories/prisma-session.repository';
import { TokenService } from './infrastructure/services/token.service';
import { JwtAccessStrategy } from './infrastructure/strategies/jwt-access.strategy';
import { LocalStrategy } from './infrastructure/strategies/local.strategy';
import { AuthController } from './presentation/http/controllers/auth.controller';
import { AuthValidator } from './presentation/http/validation/auth.validator';

@Module({
  imports: [
    UsersModule,
    PassportModule.register({ session: false }),
    JwtModule.register({}),
  ],
  controllers: [AuthController],
  providers: [
    AuthValidator,
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
        userRepository: IUserRepository,
        refreshTokenRepository: IRefreshTokenRepository,
        sessionRepository: ISessionRepository,
      ) =>
        new LoginUseCase(
          tokenService,
          userRepository,
          refreshTokenRepository,
          sessionRepository,
        ),
      inject: [
        TokenService,
        USER_REPOSITORY_TOKEN,
        REFRESH_TOKEN_REPOSITORY_TOKEN,
        SESSION_REPOSITORY_TOKEN,
      ],
    },
    {
      provide: RefreshUseCase,
      useFactory: (
        tokenService: TokenService,
        userRepository: IUserRepository,
        refreshTokenRepository: IRefreshTokenRepository,
      ) =>
        new RefreshUseCase(
          tokenService,
          userRepository,
          refreshTokenRepository,
        ),
      inject: [
        TokenService,
        USER_REPOSITORY_TOKEN,
        REFRESH_TOKEN_REPOSITORY_TOKEN,
      ],
    },
    {
      provide: LogoutUseCase,
      useFactory: (
        tokenService: TokenService,
        refreshTokenRepository: IRefreshTokenRepository,
      ) => new LogoutUseCase(tokenService, refreshTokenRepository),
      inject: [TokenService, REFRESH_TOKEN_REPOSITORY_TOKEN],
    },
    {
      provide: GetMeUseCase,
      useFactory: (userRepository: IUserRepository) =>
        new GetMeUseCase(userRepository),
      inject: [USER_REPOSITORY_TOKEN],
    },
    LocalStrategy,
    JwtAccessStrategy,
  ],
  exports: [
    ValidateUserUseCase,
    LoginUseCase,
    RefreshUseCase,
    LogoutUseCase,
    GetMeUseCase,
  ],
})
export class AuthModule {}
