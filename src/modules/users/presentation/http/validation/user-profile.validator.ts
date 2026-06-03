import { BadRequestException, Injectable } from '@nestjs/common';
import { ajv } from 'src/modules/shared/presentation/http/validation/ajv-instance';
import { BaseValidator } from 'src/modules/shared/presentation/http/validation/base.validator';
import { createUserProfilePayloadSchema } from './schemas/create-user-profile-payload.schema';
import type { ICreateUserProfilePayload } from './schemas/create-user-profile-payload.types';
import { updateUserProfilePayloadSchema } from './schemas/update-user-profile-payload.schema';
import type { IUpdateUserProfilePayload } from './schemas/update-user-profile-payload.types';
import { getUserProfilesQuerySchema } from './schemas/get-user-profiles-query.schema';
import type { IGetUserProfilesQueryPayload } from './schemas/get-user-profiles-query.types';
import { getByIdQuerySchema } from './schemas/get-by-id-query.schema';
import type { IGetByIdQueryPayload } from './schemas/get-by-id-query.types';
import { idParamSchema } from './schemas/id-param.schema';
import type { IIdParamPayload } from './schemas/id-param.types';

const validateGetUserProfilesQuery = ajv.compile(getUserProfilesQuerySchema);
const validateGetByIdQuery = ajv.compile(getByIdQuerySchema);
const validateIdParam = ajv.compile(idParamSchema);
const validateCreateUserProfilePayload = ajv.compile(
  createUserProfilePayloadSchema,
);
const validateUpdateUserProfilePayload = ajv.compile(
  updateUserProfilePayloadSchema,
);

@Injectable()
export class UserProfileValidator extends BaseValidator {
  validateGetUserProfilesQuery(
    raw: Record<string, unknown>,
  ): IGetUserProfilesQueryPayload {
    const normalized = this.normalizeListQueryRaw(raw);
    return this.validateAndReturn<IGetUserProfilesQueryPayload>({
      validate: validateGetUserProfilesQuery,
      data: normalized,
      errorMessage: 'Некорректные параметры запроса списка профилей пользователей',
      logLabel: 'GetUserProfilesQuery',
      dataForSchema: normalized,
    });
  }

  validateGetByIdQuery(raw: Record<string, unknown>): IGetByIdQueryPayload {
    return this.validateAndReturn<IGetByIdQueryPayload>({
      validate: validateGetByIdQuery,
      data: raw,
      errorMessage: 'Некорректные параметры запроса',
      logLabel: 'GetUserProfileByIdQuery',
      dataForSchema: raw,
    });
  }

  validateIdParam(raw: Record<string, unknown>): IIdParamPayload {
    const normalized: IIdParamPayload = { id: String(raw.id ?? '') };
    return this.validateAndReturn<IIdParamPayload>({
      validate: validateIdParam,
      data: normalized,
      errorMessage: 'Некорректный идентификатор',
      logLabel: 'UserProfileIdParam',
      dataForSchema: normalized,
    });
  }

  validateCreatePayload(
    raw: Record<string, unknown>,
  ): ICreateUserProfilePayload {
    return this.validateAndReturn<ICreateUserProfilePayload>({
      validate: validateCreateUserProfilePayload,
      data: raw as unknown as ICreateUserProfilePayload,
      errorMessage: 'Некорректный payload создания профиля пользователя',
      logLabel: 'CreateUserProfilePayload',
      dataForSchema: raw,
    });
  }

  validateUpdatePayload(
    raw: Record<string, unknown>,
  ): IUpdateUserProfilePayload {
    return this.validateAndReturn<IUpdateUserProfilePayload>({
      validate: validateUpdateUserProfilePayload,
      data: raw as unknown as IUpdateUserProfilePayload,
      errorMessage: 'Некорректный payload обновления профиля пользователя',
      logLabel: 'UpdateUserProfilePayload',
      dataForSchema: raw,
    });
  }

  private normalizeListQueryRaw(
    raw: Record<string, unknown>,
  ): IGetUserProfilesQueryPayload {
    const out: Record<string, unknown> = { ...raw };

    if (typeof out.filter === 'string') {
      const s = out.filter.trim();
      if (s.length === 0) {
        delete out.filter;
      } else {
        try {
          out.filter = JSON.parse(s) as unknown;
        } catch {
          throw new BadRequestException(
            'Query parameter filter must be a valid JSON object',
          );
        }
      }
    }

    if (out.requiredIds !== undefined && out.requiredIds !== null) {
      out.requiredIds = Array.isArray(out.requiredIds)
        ? out.requiredIds
        : [out.requiredIds];
    }

    return out as IGetUserProfilesQueryPayload;
  }
}
