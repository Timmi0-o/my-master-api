import { BadRequestException, Injectable } from '@nestjs/common';
import { ajv } from 'src/validators/ajv-instance';
import { BaseValidator } from 'src/validators/base.validator';
import {
  getUsersQuerySchema,
  type IGetUsersQueryDto,
} from 'src/validators/schemas/users/get-users-query.schema';

const validateGetUsersQuery = ajv.compile(getUsersQuerySchema);

@Injectable()
export class UserValidator extends BaseValidator {
  validateGetUsersQuery(raw: Record<string, unknown>): IGetUsersQueryDto {
    const normalized = this.normalizeGetUsersQueryRaw(raw);
    return this.validateAndReturn<IGetUsersQueryDto>({
      validate: validateGetUsersQuery,
      data: normalized,
      errorMessage: 'Некорректные параметры запроса списка пользователей',
      logLabel: 'GetUsersQuery',
      dataForSchema: normalized,
    });
  }

  /**
   * Query: приводим filter (JSON-строка) и requiredIds к виду, ожидаемому схемой.
   */
  private normalizeGetUsersQueryRaw(
    raw: Record<string, unknown>,
  ): IGetUsersQueryDto {
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

    return out;
  }
}
