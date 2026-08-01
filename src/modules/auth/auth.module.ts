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
import { EmailMessageFactory } from '@shared/infrastructure/mailer/email-message.factory';
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
import { SendVerificationEmailUseCase } from './application/use-cases/send-verification-email.use-case';
import { ValidateResetPasswordTokenUseCase } from './application/use-cases/validate-reset-password-token.use-case';
import { ValidateUserUseCase } from './application/use-cases/validate-user.use-case';
import { VerifyEmailUseCase } from './application/use-cases/verify-email.use-case';
import {
  EMAIL_VERIFICATION_TOKEN_REPOSITORY_TOKEN,
  PASSWORD_RESET_TOKEN_REPOSITORY_TOKEN,
  REFRESH_TOKEN_REPOSITORY_TOKEN,
  SESSION_REPOSITORY_TOKEN,
} from './domain/repositories/auth.repository.tokens';
import type { IEmailVerificationTokenRepository } from './domain/repositories/i-email-verification-token.repository';
import type { IPasswordResetTokenRepository } from './domain/repositories/i-password-reset-token.repository';
import type { IRefreshTokenRepository } from './domain/repositories/i-refresh-token.repository';
import type { ISessionRepository } from './domain/repositories/i-session.repository';
import { AuthGuardsModule } from './infrastructure/modules/auth-guards/auth-guards.module';
import { PrismaEmailVerificationTokenRepository } from './infrastructure/persistence/repositories/prisma-email-verification-token.repository';
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
      provide: EMAIL_VERIFICATION_TOKEN_REPOSITORY_TOKEN,
      useClass: PrismaEmailVerificationTokenRepository,
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
      provide: SendVerificationEmailUseCase,
      useFactory: (
        userRepository: IUserRepository,
        emailVerificationTokenRepository: IEmailVerificationTokenRepository,
        tokenService: TokenService,
        mailer: IMailer,
        emailMessageFactory: EmailMessageFactory,
      ) =>
        new SendVerificationEmailUseCase(
          userRepository,
          emailVerificationTokenRepository,
          tokenService,
          mailer,
          emailMessageFactory,
          loadAppWebUrl(),
        ),
      inject: [
        USER_REPOSITORY_TOKEN,
        EMAIL_VERIFICATION_TOKEN_REPOSITORY_TOKEN,
        TokenService,
        MAILER_TOKEN,
        EmailMessageFactory,
      ],
    },
    {
      provide: VerifyEmailUseCase,
      useFactory: (
        transactionManager: ITransactionManager,
        userRepository: IUserRepository,
        emailVerificationTokenRepository: IEmailVerificationTokenRepository,
        tokenService: TokenService,
      ) =>
        new VerifyEmailUseCase(
          transactionManager,
          userRepository,
          emailVerificationTokenRepository,
          tokenService,
        ),
      inject: [
        TRANSACTION_MANAGER_TOKEN,
        USER_REPOSITORY_TOKEN,
        EMAIL_VERIFICATION_TOKEN_REPOSITORY_TOKEN,
        TokenService,
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
        sendVerificationEmailUseCase: SendVerificationEmailUseCase,
      ) =>
        new RegisterUseCase(
          transactionManager,
          userRepository,
          loginUseCase,
          masterProfileRepository,
          userProfileRepository,
          sendVerificationEmailUseCase,
        ),
      inject: [
        TRANSACTION_MANAGER_TOKEN,
        USER_REPOSITORY_TOKEN,
        LoginUseCase,
        MASTER_PROFILE_REPOSITORY_TOKEN,
        USER_PROFILE_REPOSITORY_TOKEN,
        SendVerificationEmailUseCase,
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
        emailMessageFactory: EmailMessageFactory,
      ) =>
        new SendResetPasswordEmailUseCase(
          userRepository,
          passwordResetTokenRepository,
          tokenService,
          mailer,
          emailMessageFactory,
          loadAppWebUrl(),
        ),
      inject: [
        USER_REPOSITORY_TOKEN,
        PASSWORD_RESET_TOKEN_REPOSITORY_TOKEN,
        TokenService,
        MAILER_TOKEN,
        EmailMessageFactory,
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
    SendVerificationEmailUseCase,
    VerifyEmailUseCase,
  ],
})
export class AuthModule {}
