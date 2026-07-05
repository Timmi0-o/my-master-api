import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { ValidateUserUseCase } from '@modules/auth/application/use-cases/validate-user.use-case';
import { validateUserSchema } from '@modules/auth/presentation/http/validation/schemas/validate-user.schema';
import { ajv } from '@shared/presentation/http/ajv';
import { normalizeAuthCredentials } from '@shared/presentation/http/helpers/normalize-auth-payload';

const validateCredentials = ajv.compile(validateUserSchema);

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly validateUserUseCase: ValidateUserUseCase) {
    super({ usernameField: 'email', passwordField: 'password' });
  }

  async validate(email: string, password: string) {
    const normalized = normalizeAuthCredentials({ email, password });

    if (!validateCredentials(normalized)) {
      throw new BadRequestException('Некорректные учетные данные');
    }

    const user = await this.validateUserUseCase.execute(
      normalized.email,
      normalized.password,
    );

    if (!user) {
      throw new UnauthorizedException('Неверный email или пароль');
    }

    return user;
  }
}
