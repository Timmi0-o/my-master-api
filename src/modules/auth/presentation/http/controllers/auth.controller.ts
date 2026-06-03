import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  UnauthorizedException,
  UseFilters,
  UseGuards,
} from '@nestjs/common';
import type { Request } from 'express';
import { DomainExceptionFilter } from 'src/modules/shared/infrastructure/filters/domain-exception.filter';
import type { ISessionUser } from 'src/modules/shared/domain/i-session-user';
import type { IUserEntity } from 'src/modules/users/domain/entities/user';
import type {
  ILoginPayload,
  IRefreshPayload,
} from 'src/modules/auth/domain/auth.types';
import { GetMeUseCase } from 'src/modules/auth/application/use-cases/get-me.use-case';
import { LoginUseCase } from 'src/modules/auth/application/use-cases/login.use-case';
import { LogoutUseCase } from 'src/modules/auth/application/use-cases/logout.use-case';
import { RefreshUseCase } from 'src/modules/auth/application/use-cases/refresh.use-case';
import { CurrentUser } from '../../decorators/current-user.decorator';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';
import { LocalAuthGuard } from '../../guards/local-auth.guard';
import { AuthValidator } from '../validation/auth.validator';

@Controller({ path: 'auth', version: '1' })
@UseFilters(DomainExceptionFilter)
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
