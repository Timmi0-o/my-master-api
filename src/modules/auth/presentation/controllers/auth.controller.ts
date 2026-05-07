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
import type {
  ILoginPayload,
  IRefreshPayload,
} from 'src/modules/auth/domain/auth.types';
import type { ISessionUser } from 'src/modules/shared/domain/i-session-user';
import type { IUserEntity } from 'src/modules/users/domain/entities/user';
import { AuthValidator } from 'src/validators/auth';
import { GetMeUseCase } from '../../application/use-cases/get-me.usecase';
import { LoginUseCase } from '../../application/use-cases/login.usecase';
import { LogoutUseCase } from '../../application/use-cases/logout.usecase';
import { RefreshUseCase } from '../../application/use-cases/refresh.usecase';
import { CurrentUser } from '../decorators/current-user.decorator';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { LocalAuthGuard } from '../guards/local-auth.guard';

@Controller({ path: 'auth', version: '1' })
export class AuthController {
  constructor(
    private readonly loginUseCase: LoginUseCase,
    private readonly refreshUseCase: RefreshUseCase,
    private readonly logoutUseCase: LogoutUseCase,
    private readonly getMeUseCase: GetMeUseCase,
    private readonly authValidator: AuthValidator,
  ) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(
    @Body() _body: ILoginPayload,
    @Req() req: Request & { user?: IUserEntity },
  ) {
    if (!req.user) {
      throw new UnauthorizedException('User is not authenticated');
    }

    const metadata = this.authValidator.validateLoginMetadata({
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'] ?? null,
    });

    return this.loginUseCase.execute(req.user, metadata);
  }

  @Post('refresh')
  async refresh(@Body() body: IRefreshPayload) {
    const validated = this.authValidator.validateRefreshToken({
      refreshToken: body.refreshToken,
    });
    return this.refreshUseCase.execute(validated.refreshToken);
  }

  @Post('logout')
  async logout(@Body() body: IRefreshPayload) {
    const validated = this.authValidator.validateRefreshToken({
      refreshToken: body.refreshToken,
    });
    return this.logoutUseCase.execute(validated.refreshToken);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async me(@CurrentUser() user: ISessionUser | null) {
    if (!user) {
      throw new UnauthorizedException('User is not authenticated');
    }

    const validated = this.authValidator.validateUserId({ userId: user.id });
    return this.getMeUseCase.execute(validated.userId);
  }
}
