import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthValidator } from 'src/modules/auth/presentation/http/validation/auth.validator';
import { ValidateUserUseCase } from '../../application/use-cases/validate-user.use-case';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly validateUserUseCase: ValidateUserUseCase,
    private readonly authValidator: AuthValidator,
  ) {
    super({ usernameField: 'email', passwordField: 'password' });
  }

  async validate(email: string, password: string) {
    const validated = this.authValidator.validateCredentials({ email, password });

    const user = await this.validateUserUseCase.execute(
      validated.email,
      validated.password,
    );

    if (!user) {
      throw new UnauthorizedException('Неверный email или пароль');
    }
    return user;
  }
}
