import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { ValidateUserUseCase } from '../../application/use-cases/validate-user.usecase';
import { AuthValidator } from 'src/validators/auth';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly validateUserUseCase: ValidateUserUseCase,
    private readonly authValidator: AuthValidator,
  ) {
    super({ usernameField: 'identifier', passwordField: 'password' });
  }

  async validate(identifier: string, password: string) {
    const validated = this.authValidator.validateCredentials({
      identifier,
      password,
    });

    const user = await this.validateUserUseCase.execute(
      validated.identifier,
      validated.password,
    );

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return user;
  }
}
