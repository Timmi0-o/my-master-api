import { BadRequestException, Injectable } from '@nestjs/common';
import { ajv } from 'src/modules/shared/presentation/http/validation/ajv-instance';
import { BaseValidator } from 'src/modules/shared/presentation/http/validation/base.validator';
import { assignUserRolePayloadSchema } from './schemas/assign-user-role-payload.schema';
import type { IAssignUserRolePayload } from './schemas/assign-user-role-payload.types';
import { getUsersQuerySchema } from './schemas/get-users-query.schema';
import type { IGetUsersQueryPayload } from './schemas/get-users-query.types';
import { idParamSchema } from './schemas/id-param.schema';
import type { IIdParamPayload } from './schemas/id-param.types';

const validateGetUsersQuery = ajv.compile(getUsersQuerySchema);
const validateIdParam = ajv.compile(idParamSchema);
const validateAssignUserRolePayload = ajv.compile(assignUserRolePayloadSchema);

@Injectable()
export class UserValidator extends BaseValidator {
  validateGetUsersQuery(raw: Record<string, unknown>): IGetUsersQueryPayload {
    const normalized = this.normalizeGetUsersQueryRaw(raw);
    return this.validateAndReturn<IGetUsersQueryPayload>({
      validate: validateGetUsersQuery,
      data: normalized,
      errorMessage: 'Некорректные параметры запроса списка пользователей',
      logLabel: 'GetUsersQuery',
      dataForSchema: normalized,
    });
  }

  private normalizeGetUsersQueryRaw(
    raw: Record<string, unknown>,
  ): IGetUsersQueryPayload {
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

    return out as IGetUsersQueryPayload;
  }

  validateIdParam(raw: Record<string, unknown>): IIdParamPayload {
    const normalized: IIdParamPayload = { id: String(raw.id ?? '') };
    return this.validateAndReturn<IIdParamPayload>({
      validate: validateIdParam,
      data: normalized,
      errorMessage: 'Некорректный идентификатор пользователя',
      logLabel: 'UserIdParam',
      dataForSchema: normalized,
    });
  }

  validateAssignUserRolePayload(
    raw: Record<string, unknown>,
  ): IAssignUserRolePayload {
    return this.validateAndReturn<IAssignUserRolePayload>({
      validate: validateAssignUserRolePayload,
      data: raw as unknown as IAssignUserRolePayload,
      errorMessage: 'Некорректное тело запроса смены роли',
      logLabel: 'AssignUserRolePayload',
      dataForSchema: raw,
    });
  }
}
