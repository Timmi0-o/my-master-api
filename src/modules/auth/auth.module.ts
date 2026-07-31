import {
  IMasterProfileRepository,
  MASTER_PROFILE_REPOSITORY_TOKEN,
} from '@modules/masters/domain/repositories';
import { MasterProfileModule } from '@modules/masters/infrastructure/modules/master-profile/master-profile.module';
import { IUserProfileRepository } from '@modules/users/domain/repositories';
import { USER_PROFILE_REPOSITORY_TOKEN } from '@modules/users/domain/repositories/user-profile/user-profile.repository.tokens';
import { UserProfileModule } from '@modules/users/infrastructure/modules/user-profile/user-profile.module';
import { Module, forwardRef } from '@nestjs/common';
import type { IMailer } from '@shared/domain/mailer';
import { MAILER_TOKEN } from '@shared/domain/mailer';
import type { ITransactionManager } from '@shared/domain/transactions';
import { TRANSACTION_MANAGER_TOKEN } from '@shared/domain/transactions';
import { MailerModule } from '@shared/infrastructure/mailer/mailer.module';
import { loadAppWebUrl } from '@shared/infrastructure/mailer/mail.config';
import type { IUserRepository } from '../users/domain/repositories/user/i-user.repository';
import { USER_REPOSITORY_TOKEN } from '../users/domain/repositories/user/user.repository.tokens';
import { UserModule } from '../users/infrastructure/modules/user/user.module';
import { GetMeUseCase } from './application/use-cases/get-me.use-case';
import { ChangePasswordUseCase } from './application/use-cases/change-password.use-case';
import { LoginUseCase } from './application/use-cases/login.use-case';
import { LogoutUseCase } from './application/use-cases/logout.use-case';
import { RefreshUseCase } from './application/use-cases/refresh.use-case';
import { RegisterUseCase } from './application/use-cases/register.use-case';
import { ResetPasswordUseCase } from './application/use-cases/reset-password.use-case';
import { SendResetPasswordEmailUseCase } from './application/use-cases/send-reset-password-email.use-case';
import { ValidateResetPasswordTokenUseCase } from './application/use-cases/validate-reset-password-token.use-case';
import { ValidateUserUseCase } from './application/use-cases/validate-user.use-case';
import {
  PASSWORD_RESET_TOKEN_REPOSITORY_TOKEN,
  REFRESH_TOKEN_REPOSITORY_TOKEN,
  SESSION_REPOSITORY_TOKEN,
} from './domain/repositories/auth.repository.tokens';
import type { IPasswordResetTokenRepository } from './domain/repositories/i-password-reset-token.repository';
import type { IRefreshTokenRepository } from './domain/repositories/i-refresh-token.repository';
import type { ISessionRepository } from './domain/repositories/i-session.repository';
import { AuthGuardsModule } from './infrastructure/modules/auth-guards/auth-guards.module';
import { PrismaPasswordResetTokenRepository } from './infrastructure/persistence/repositories/prisma-password-reset-token.repository';
import { PrismaRefreshTokenRepository } from './infrastructure/persistence/repositories/prisma-refresh-token.repository';
import { PrismaSessionRepository } from './infrastructure/persistence/repositories/prisma-session.repository';
import { TokenService } from './infrastructure/services/token.service';
import { LocalStrategy } from './infrastructure/strategies/local.strategy';
import { AuthController } from './presentation/http/controllers/auth.controller';

@Module({
  imports: [
    UserModule,
    AuthGuardsModule,
    MailerModule,
    forwardRef(() => MasterProfileModule),
    forwardRef(() => UserProfileModule),
  ],
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
      provide: PASSWORD_RESET_TOKEN_REPOSITORY_TOKEN,
      useClass: PrismaPasswordResetTokenRepository,
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
        masterProfileRepository: IMasterProfileRepository,
        userProfileRepository: IUserProfileRepository,
      ) =>
        new RegisterUseCase(
          transactionManager,
          userRepository,
          loginUseCase,
          masterProfileRepository,
          userProfileRepository,
        ),
      inject: [
        TRANSACTION_MANAGER_TOKEN,
        USER_REPOSITORY_TOKEN,
        LoginUseCase,
        MASTER_PROFILE_REPOSITORY_TOKEN,
        USER_PROFILE_REPOSITORY_TOKEN,
      ],
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
    {
      provide: SendResetPasswordEmailUseCase,
      useFactory: (
        userRepository: IUserRepository,
        passwordResetTokenRepository: IPasswordResetTokenRepository,
        tokenService: TokenService,
        mailer: IMailer,
      ) =>
        new SendResetPasswordEmailUseCase(
          userRepository,
          passwordResetTokenRepository,
          tokenService,
          mailer,
          loadAppWebUrl(),
        ),
      inject: [
        USER_REPOSITORY_TOKEN,
        PASSWORD_RESET_TOKEN_REPOSITORY_TOKEN,
        TokenService,
        MAILER_TOKEN,
      ],
    },
    {
      provide: ValidateResetPasswordTokenUseCase,
      useFactory: (
        passwordResetTokenRepository: IPasswordResetTokenRepository,
        tokenService: TokenService,
      ) =>
        new ValidateResetPasswordTokenUseCase(
          passwordResetTokenRepository,
          tokenService,
        ),
      inject: [PASSWORD_RESET_TOKEN_REPOSITORY_TOKEN, TokenService],
    },
    {
      provide: ResetPasswordUseCase,
      useFactory: (
        transactionManager: ITransactionManager,
        userRepository: IUserRepository,
        refreshTokenRepository: IRefreshTokenRepository,
        passwordResetTokenRepository: IPasswordResetTokenRepository,
        validateResetPasswordTokenUseCase: ValidateResetPasswordTokenUseCase,
      ) =>
        new ResetPasswordUseCase(
          transactionManager,
          userRepository,
          refreshTokenRepository,
          passwordResetTokenRepository,
          validateResetPasswordTokenUseCase,
        ),
      inject: [
        TRANSACTION_MANAGER_TOKEN,
        USER_REPOSITORY_TOKEN,
        REFRESH_TOKEN_REPOSITORY_TOKEN,
        PASSWORD_RESET_TOKEN_REPOSITORY_TOKEN,
        ValidateResetPasswordTokenUseCase,
      ],
    },
    {
      provide: ChangePasswordUseCase,
      useFactory: (
        transactionManager: ITransactionManager,
        userRepository: IUserRepository,
        refreshTokenRepository: IRefreshTokenRepository,
      ) =>
        new ChangePasswordUseCase(
          transactionManager,
          userRepository,
          refreshTokenRepository,
        ),
      inject: [
        TRANSACTION_MANAGER_TOKEN,
        USER_REPOSITORY_TOKEN,
        REFRESH_TOKEN_REPOSITORY_TOKEN,
      ],
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
    SendResetPasswordEmailUseCase,
    ValidateResetPasswordTokenUseCase,
    ResetPasswordUseCase,
    ChangePasswordUseCase,
  ],
})
export class AuthModule {}
