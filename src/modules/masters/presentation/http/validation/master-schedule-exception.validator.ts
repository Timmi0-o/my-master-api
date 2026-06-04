import { BadRequestException, Injectable } from '@nestjs/common';
import { ajv } from 'src/modules/shared/presentation/http/validation/ajv-instance';
import { BaseValidator } from 'src/modules/shared/presentation/http/validation/base.validator';
import { createMasterScheduleExceptionPayloadSchema } from './schemas/create-master-schedule-exception-payload.schema';
import type { ICreateMasterScheduleExceptionPayload } from './schemas/create-master-schedule-exception-payload.types';
import { updateMasterScheduleExceptionPayloadSchema } from './schemas/update-master-schedule-exception-payload.schema';
import type { IUpdateMasterScheduleExceptionPayload } from './schemas/update-master-schedule-exception-payload.types';
import { getMasterScheduleExceptionsQuerySchema } from './schemas/get-master-schedule-exceptions-query.schema';
import type { IGetMasterScheduleExceptionsQueryPayload } from './schemas/get-master-schedule-exceptions-query.types';
import { getByIdQuerySchema } from './schemas/get-by-id-query.schema';
import type { IGetByIdQueryPayload } from './schemas/get-by-id-query.types';
import { idParamSchema } from './schemas/id-param.schema';
import type { IIdParamPayload } from './schemas/id-param.types';

const validateGetMasterScheduleExceptionsQuery = ajv.compile(
  getMasterScheduleExceptionsQuerySchema,
);
const validateGetByIdQuery = ajv.compile(getByIdQuerySchema);
const validateIdParam = ajv.compile(idParamSchema);
const validateCreateMasterScheduleExceptionPayload = ajv.compile(
  createMasterScheduleExceptionPayloadSchema,
);
const validateUpdateMasterScheduleExceptionPayload = ajv.compile(
  updateMasterScheduleExceptionPayloadSchema,
);

@Injectable()
export class MasterScheduleExceptionValidator extends BaseValidator {
  validateGetMasterScheduleExceptionsQuery(
    raw: Record<string, unknown>,
  ): IGetMasterScheduleExceptionsQueryPayload {
    const normalized = this.normalizeListQueryRaw(raw);
    return this.validateAndReturn<IGetMasterScheduleExceptionsQueryPayload>({
      validate: validateGetMasterScheduleExceptionsQuery,
      data: normalized,
      errorMessage:
        'Некорректные параметры запроса списка исключений расписания мастера',
      logLabel: 'GetMasterScheduleExceptionsQuery',
      dataForSchema: normalized,
    });
  }

  validateGetByIdQuery(raw: Record<string, unknown>): IGetByIdQueryPayload {
    return this.validateAndReturn<IGetByIdQueryPayload>({
      validate: validateGetByIdQuery,
      data: raw,
      errorMessage: 'Некорректные параметры запроса',
      logLabel: 'GetMasterScheduleExceptionByIdQuery',
      dataForSchema: raw,
    });
  }

  validateIdParam(raw: Record<string, unknown>): IIdParamPayload {
    const normalized: IIdParamPayload = { id: String(raw.id ?? '') };
    return this.validateAndReturn<IIdParamPayload>({
      validate: validateIdParam,
      data: normalized,
      errorMessage: 'Некорректный идентификатор',
      logLabel: 'MasterScheduleExceptionIdParam',
      dataForSchema: normalized,
    });
  }

  validateCreatePayload(
    raw: Record<string, unknown>,
  ): ICreateMasterScheduleExceptionPayload {
    return this.validateAndReturn<ICreateMasterScheduleExceptionPayload>({
      validate: validateCreateMasterScheduleExceptionPayload,
      data: raw as unknown as ICreateMasterScheduleExceptionPayload,
      errorMessage:
        'Некорректный payload создания исключения расписания мастера',
      logLabel: 'CreateMasterScheduleExceptionPayload',
      dataForSchema: raw,
    });
  }

  validateUpdatePayload(
    raw: Record<string, unknown>,
  ): IUpdateMasterScheduleExceptionPayload {
    return this.validateAndReturn<IUpdateMasterScheduleExceptionPayload>({
      validate: validateUpdateMasterScheduleExceptionPayload,
      data: raw as unknown as IUpdateMasterScheduleExceptionPayload,
      errorMessage:
        'Некорректный payload обновления исключения расписания мастера',
      logLabel: 'UpdateMasterScheduleExceptionPayload',
      dataForSchema: raw,
    });
  }

  private normalizeListQueryRaw(
    raw: Record<string, unknown>,
  ): IGetMasterScheduleExceptionsQueryPayload {
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

    return out as IGetMasterScheduleExceptionsQueryPayload;
  }
}
