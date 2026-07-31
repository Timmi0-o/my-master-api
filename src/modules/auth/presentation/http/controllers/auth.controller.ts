import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import type { Request } from 'express';
import { GetMeUseCase } from '@modules/auth/application/use-cases/get-me.use-case';
import { ChangePasswordUseCase } from '@modules/auth/application/use-cases/change-password.use-case';
import { LoginUseCase } from '@modules/auth/application/use-cases/login.use-case';
import { LogoutUseCase } from '@modules/auth/application/use-cases/logout.use-case';
import { RefreshUseCase } from '@modules/auth/application/use-cases/refresh.use-case';
import { RegisterUseCase } from '@modules/auth/application/use-cases/register.use-case';
import { ResetPasswordUseCase } from '@modules/auth/application/use-cases/reset-password.use-case';
import { SendResetPasswordEmailUseCase } from '@modules/auth/application/use-cases/send-reset-password-email.use-case';
import { ValidateResetPasswordTokenUseCase } from '@modules/auth/application/use-cases/validate-reset-password-token.use-case';
import type { ILoginPayload } from '@modules/auth/domain/auth.types';
import { AuthenticatedUser } from '@modules/auth/presentation/decorators/authenticated-user.decorator';
import { JwtAuthGuard } from '@modules/auth/presentation/guards/jwt-auth.guard';
import { LocalAuthGuard } from '@modules/auth/presentation/guards/local-auth.guard';
import { changePasswordSchema } from '@modules/auth/presentation/http/validation/schemas/change-password.schema';
import { refreshTokenSchema } from '@modules/auth/presentation/http/validation/schemas/refresh-token.schema';
import { registerPayloadSchema } from '@modules/auth/presentation/http/validation/schemas/register-payload.schema';
import { resetPasswordSchema } from '@modules/auth/presentation/http/validation/schemas/reset-password.schema';
import { sendResetPasswordEmailSchema } from '@modules/auth/presentation/http/validation/schemas/send-reset-password-email.schema';
import { validateResetPasswordTokenSchema } from '@modules/auth/presentation/http/validation/schemas/validate-reset-password-token.schema';
import type {
  IChangePasswordPayload,
  IRefreshTokenInput,
  IRegisterPayload,
  IResetPasswordPayload,
  ISendResetPasswordEmailPayload,
  IValidateResetPasswordTokenPayload,
} from '@modules/auth/presentation/http/validation/schemas/auth.schema.types';
import type { IUserEntity } from '@modules/users/domain/entities/user';
import type { ISessionUser } from '@shared/domain/i-session-user';
import { PublicEndpoint } from '@shared/presentation/decorators/public-endpoint.decorator';
import { HttpBody } from '@shared/presentation/http/decorators';
import {
  buildLoginMetadataInput,
  normalizeRegisterPayload,
} from '@shared/presentation/http/helpers/normalize-auth-payload';
import {
  mapLoginHttpResponse,
  mapRefreshHttpResponse,
  mapRegisterHttpResponse,
} from '../http-responses/map-auth-response';
import { mapGetMeHttpResponse } from '../http-responses/map-get-me-response';
import { mapLogoutHttpResponse } from '../http-responses/map-logout-response';

@Controller({ path: 'auth', version: '1' })
export class AuthController {
  constructor(
    private readonly loginUseCase: LoginUseCase,
    private readonly registerUseCase: RegisterUseCase,
    private readonly refreshUseCase: RefreshUseCase,
    private readonly logoutUseCase: LogoutUseCase,
    private readonly getMeUseCase: GetMeUseCase,
    private readonly sendResetPasswordEmailUseCase: SendResetPasswordEmailUseCase,
    private readonly validateResetPasswordTokenUseCase: ValidateResetPasswordTokenUseCase,
    private readonly resetPasswordUseCase: ResetPasswordUseCase,
    private readonly changePasswordUseCase: ChangePasswordUseCase,
  ) {}

  @PublicEndpoint()
  @Post('register')
  async register(
    @HttpBody(registerPayloadSchema, {
      preprocess: normalizeRegisterPayload,
      errorMessage: 'Некорректные данные регистрации',
    })
    body: IRegisterPayload,
    @Req() req: Request,
  ) {
    const metadata = buildLoginMetadataInput(req);
    const output = await this.registerUseCase.execute(body, metadata);
    return mapRegisterHttpResponse(output);
  }

  @PublicEndpoint()
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(
    @Body() _body: ILoginPayload,
    @Req() req: Request & { user?: IUserEntity },
  ) {
    if (!req.user) {
      throw new UnauthorizedException('User is not authenticated');
    }

    const metadata = buildLoginMetadataInput(req);
    const output = await this.loginUseCase.execute(req.user, metadata);
    return mapLoginHttpResponse(output);
  }

  @PublicEndpoint()
  @Post('refresh')
  async refresh(
    @HttpBody(refreshTokenSchema, {
      errorMessage: 'Некорректный refresh token',
    })
    body: IRefreshTokenInput,
  ) {
    const output = await this.refreshUseCase.execute(body.refreshToken);
    return mapRefreshHttpResponse(output);
  }

  @PublicEndpoint()
  @Post('logout')
  async logout(
    @HttpBody(refreshTokenSchema, {
      errorMessage: 'Некорректный refresh token',
    })
    body: IRefreshTokenInput,
  ) {
    const output = await this.logoutUseCase.execute(body.refreshToken);
    return mapLogoutHttpResponse(output);
  }

  @PublicEndpoint()
  @Post('send-reset-password-email')
  async sendResetPasswordEmail(
    @HttpBody(sendResetPasswordEmailSchema, {
      errorMessage: 'Некорректный email',
    })
    body: ISendResetPasswordEmailPayload,
  ) {
    return this.sendResetPasswordEmailUseCase.execute(body.email);
  }

  @PublicEndpoint()
  @Post('validate-reset-password-token')
  async validateResetPasswordToken(
    @HttpBody(validateResetPasswordTokenSchema, {
      errorMessage: 'Некорректный токен',
    })
    body: IValidateResetPasswordTokenPayload,
  ) {
    return this.validateResetPasswordTokenUseCase.execute(body.token);
  }

  @PublicEndpoint()
  @Post('reset-password')
  async resetPassword(
    @HttpBody(resetPasswordSchema, {
      errorMessage: 'Некорректные данные сброса пароля',
    })
    body: IResetPasswordPayload,
  ) {
    return this.resetPasswordUseCase.execute(body);
  }

  @UseGuards(JwtAuthGuard)
  @Post('change-password')
  async changePassword(
    @AuthenticatedUser() user: ISessionUser,
    @HttpBody(changePasswordSchema, {
      errorMessage: 'Некорректные данные смены пароля',
    })
    body: IChangePasswordPayload,
  ) {
    return this.changePasswordUseCase.execute({
      userId: user.id,
      currentPassword: body.currentPassword,
      newPassword: body.newPassword,
    });
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async me(@AuthenticatedUser() user: ISessionUser) {
    const output = await this.getMeUseCase.execute(user.id);
    return mapGetMeHttpResponse(output);
  }
}
