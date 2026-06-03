import { BadRequestException, Injectable } from '@nestjs/common';
import { ajv } from 'src/modules/shared/presentation/http/validation/ajv-instance';
import { BaseValidator } from 'src/modules/shared/presentation/http/validation/base.validator';
import { getUsersQuerySchema } from './schemas/get-users-query.schema';
import type { IGetUsersQueryPayload } from './schemas/get-users-query.types';

const validateGetUsersQuery = ajv.compile(getUsersQuerySchema);

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
}
