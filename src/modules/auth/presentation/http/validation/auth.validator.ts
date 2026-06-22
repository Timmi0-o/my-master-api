import { Injectable } from '@nestjs/common';
import { ajv } from 'src/modules/shared/presentation/http/validation/ajv-instance';
import { BaseValidator } from 'src/modules/shared/presentation/http/validation/base.validator';
import type {
  ILoginMetadataInput,
  IRefreshTokenInput,
  IRegisterPayload,
  IUserIdInput,
  IValidateUserInput,
} from './schemas/auth.schema.types';
import { loginMetadataSchema } from './schemas/login-metadata.schema';
import { refreshTokenSchema } from './schemas/refresh-token.schema';
import { registerPayloadSchema } from './schemas/register-payload.schema';
import { userIdSchema } from './schemas/user-id.schema';
import { validateUserSchema } from './schemas/validate-user.schema';

const validateUser = ajv.compile(validateUserSchema);
const validateRegisterPayload = ajv.compile(registerPayloadSchema);
const validateRefreshToken = ajv.compile(refreshTokenSchema);
const validateUserId = ajv.compile(userIdSchema);
const validateLoginMetadata = ajv.compile(loginMetadataSchema);

@Injectable()
export class AuthValidator extends BaseValidator {
  validateCredentials(raw: Record<string, unknown>): IValidateUserInput {
    const normalized: IValidateUserInput = {
      email: typeof raw.email === 'string' ? raw.email.trim() : '',
      password: String(raw.password ?? ''),
    };

    return this.validateAndReturn<IValidateUserInput>({
      validate: validateUser,
      data: normalized,
      errorMessage: 'Некорректные учетные данные',
      logLabel: 'AuthValidateCredentials',
      dataForSchema: normalized,
    });
  }

  validateRegisterPayload(raw: Record<string, unknown>): IRegisterPayload {
    const normalized: IRegisterPayload = {
      email: typeof raw.email === 'string' ? raw.email.trim() : '',
      username: typeof raw.username === 'string' ? raw.username.trim() : '',
      password: String(raw.password ?? ''),
    };

    return this.validateAndReturn<IRegisterPayload>({
      validate: validateRegisterPayload,
      data: normalized,
      errorMessage: 'Некорректные данные регистрации',
      logLabel: 'AuthRegisterPayload',
      dataForSchema: normalized,
    });
  }

  validateRefreshToken(raw: Record<string, unknown>): IRefreshTokenInput {
    const normalized: IRefreshTokenInput = {
      refreshToken: raw.refreshToken as string,
    };

    return this.validateAndReturn<IRefreshTokenInput>({
      validate: validateRefreshToken,
      data: normalized,
      errorMessage: 'Некорректный refresh token',
      logLabel: 'AuthRefreshToken',
      dataForSchema: normalized,
    });
  }

  validateUserId(raw: Record<string, unknown>): IUserIdInput {
    const normalized: IUserIdInput = {
      userId: raw.userId as string,
    };

    return this.validateAndReturn<IUserIdInput>({
      validate: validateUserId,
      data: normalized,
      errorMessage: 'Некорректный user id',
      logLabel: 'AuthUserId',
      dataForSchema: normalized,
    });
  }

  validateLoginMetadata(raw: Record<string, unknown>): ILoginMetadataInput {
    const normalized: ILoginMetadataInput = {
      ipAddress: raw.ipAddress as string | null | undefined,
      userAgent: raw.userAgent as string | null | undefined,
    };

    return this.validateAndReturn<ILoginMetadataInput>({
      validate: validateLoginMetadata,
      data: normalized,
      errorMessage: 'Некорректные метаданные логина',
      logLabel: 'AuthLoginMetadata',
      dataForSchema: normalized,
    });
  }
}
