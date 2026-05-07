import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthValidator } from 'src/validators/auth';
import { UsersModule } from '../users/users.module';
import { GetMeUseCase } from './application/use-cases/get-me.usecase';
import { LoginUseCase } from './application/use-cases/login.usecase';
import { LogoutUseCase } from './application/use-cases/logout.usecase';
import { RefreshUseCase } from './application/use-cases/refresh.usecase';
import { ValidateUserUseCase } from './application/use-cases/validate-user.usecase';
import { TokenService } from './infrastructure/services/token.service';
import { JwtAccessStrategy } from './infrastructure/strategies/jwt-access.strategy';
import { LocalStrategy } from './infrastructure/strategies/local.strategy';
import { AuthController } from './presentation/controllers/auth.controller';

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
    ValidateUserUseCase,
    LoginUseCase,
    RefreshUseCase,
    LogoutUseCase,
    GetMeUseCase,
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
