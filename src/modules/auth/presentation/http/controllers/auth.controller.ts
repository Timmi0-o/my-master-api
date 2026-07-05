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
import { LoginUseCase } from '@modules/auth/application/use-cases/login.use-case';
import { LogoutUseCase } from '@modules/auth/application/use-cases/logout.use-case';
import { RefreshUseCase } from '@modules/auth/application/use-cases/refresh.use-case';
import { RegisterUseCase } from '@modules/auth/application/use-cases/register.use-case';
import type { ILoginPayload, IRefreshPayload } from '@modules/auth/domain/auth.types';
import { AuthenticatedUser } from '@modules/auth/presentation/decorators/authenticated-user.decorator';
import { JwtAuthGuard } from '@modules/auth/presentation/guards/jwt-auth.guard';
import { LocalAuthGuard } from '@modules/auth/presentation/guards/local-auth.guard';
import { refreshTokenSchema } from '@modules/auth/presentation/http/validation/schemas/refresh-token.schema';
import { registerPayloadSchema } from '@modules/auth/presentation/http/validation/schemas/register-payload.schema';
import type { IRefreshTokenInput } from '@modules/auth/presentation/http/validation/schemas/auth.schema.types';
import type { IRegisterPayload } from '@modules/auth/presentation/http/validation/schemas/auth.schema.types';
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
} from '../response/map-auth-response';
import { mapGetMeHttpResponse } from '../response/map-get-me-response';
import { mapLogoutHttpResponse } from '../response/map-logout-response';

@Controller({ path: 'auth', version: '1' })
export class AuthController {
  constructor(
    private readonly loginUseCase: LoginUseCase,
    private readonly registerUseCase: RegisterUseCase,
    private readonly refreshUseCase: RefreshUseCase,
    private readonly logoutUseCase: LogoutUseCase,
    private readonly getMeUseCase: GetMeUseCase,
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

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async me(@AuthenticatedUser() user: ISessionUser) {
    const output = await this.getMeUseCase.execute(user.id);
    return mapGetMeHttpResponse(output);
  }
}
