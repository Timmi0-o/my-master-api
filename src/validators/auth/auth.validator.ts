import { Injectable } from '@nestjs/common';
import { ajv } from 'src/validators/ajv-instance';
import { BaseValidator } from 'src/validators/base.validator';
import type {
  ILoginMetadataInput,
  IRefreshTokenInput,
  IUserIdInput,
  IValidateUserInput,
} from '../schemas/auth';
import {
  loginMetadataSchema,
  refreshTokenSchema,
  userIdSchema,
  validateUserSchema,
} from '../schemas/auth';

const validateUser = ajv.compile(validateUserSchema);
const validateRefreshToken = ajv.compile(refreshTokenSchema);
const validateUserId = ajv.compile(userIdSchema);
const validateLoginMetadata = ajv.compile(loginMetadataSchema);

@Injectable()
export class AuthValidator extends BaseValidator {
  validateCredentials(raw: Record<string, unknown>): IValidateUserInput {
    const normalized: IValidateUserInput = {
      identifier: raw.identifier as string,
      password: raw.password as string,
    };

    return this.validateAndReturn<IValidateUserInput>({
      validate: validateUser,
      data: normalized,
      errorMessage: 'Некорректные учетные данные',
      logLabel: 'AuthValidateCredentials',
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
