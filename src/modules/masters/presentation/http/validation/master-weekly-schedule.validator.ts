import { BadRequestException, Injectable } from '@nestjs/common';
import { ajv } from 'src/modules/shared/presentation/http/validation/ajv-instance';
import { BaseValidator } from 'src/modules/shared/presentation/http/validation/base.validator';
import { createMasterWeeklySchedulePayloadSchema } from './schemas/create-master-weekly-schedule-payload.schema';
import type { ICreateMasterWeeklySchedulePayload } from './schemas/create-master-weekly-schedule-payload.types';
import { getByIdQuerySchema } from './schemas/get-by-id-query.schema';
import type { IGetByIdQueryPayload } from './schemas/get-by-id-query.types';
import { getMasterWeeklySchedulesQuerySchema } from './schemas/get-master-weekly-schedules-query.schema';
import type { IGetMasterWeeklySchedulesQueryPayload } from './schemas/get-master-weekly-schedules-query.types';
import { idParamSchema } from './schemas/id-param.schema';
import type { IIdParamPayload } from './schemas/id-param.types';
import { updateMasterWeeklySchedulePayloadSchema } from './schemas/update-master-weekly-schedule-payload.schema';
import type { IUpdateMasterWeeklySchedulePayload } from './schemas/update-master-weekly-schedule-payload.types';

const validateGetMasterWeeklySchedulesQuery = ajv.compile(
  getMasterWeeklySchedulesQuerySchema,
);
const validateGetByIdQuery = ajv.compile(getByIdQuerySchema);
const validateIdParam = ajv.compile(idParamSchema);
const validateCreateMasterWeeklySchedulePayload = ajv.compile(
  createMasterWeeklySchedulePayloadSchema,
);
const validateUpdateMasterWeeklySchedulePayload = ajv.compile(
  updateMasterWeeklySchedulePayloadSchema,
);

@Injectable()
export class MasterWeeklyScheduleValidator extends BaseValidator {
  validateGetMasterWeeklySchedulesQuery(
    raw: Record<string, unknown>,
  ): IGetMasterWeeklySchedulesQueryPayload {
    const normalized = this.normalizeListQueryRaw(raw);
    return this.validateAndReturn<IGetMasterWeeklySchedulesQueryPayload>({
      validate: validateGetMasterWeeklySchedulesQuery,
      data: normalized,
      errorMessage:
        'Некорректные параметры запроса списка недельного расписания мастера',
      logLabel: 'GetMasterWeeklySchedulesQuery',
      dataForSchema: normalized,
    });
  }

  validateGetByIdQuery(raw: Record<string, unknown>): IGetByIdQueryPayload {
    return this.validateAndReturn<IGetByIdQueryPayload>({
      validate: validateGetByIdQuery,
      data: raw,
      errorMessage: 'Некорректные параметры запроса',
      logLabel: 'GetMasterWeeklyScheduleByIdQuery',
      dataForSchema: raw,
    });
  }

  validateIdParam(raw: Record<string, unknown>): IIdParamPayload {
    const normalized: IIdParamPayload = { id: String(raw.id ?? '') };
    return this.validateAndReturn<IIdParamPayload>({
      validate: validateIdParam,
      data: normalized,
      errorMessage: 'Некорректный идентификатор',
      logLabel: 'MasterWeeklyScheduleIdParam',
      dataForSchema: normalized,
    });
  }

  validateCreatePayload(
    raw: Record<string, unknown>,
  ): ICreateMasterWeeklySchedulePayload {
    return this.validateAndReturn<ICreateMasterWeeklySchedulePayload>({
      validate: validateCreateMasterWeeklySchedulePayload,
      data: raw as unknown as ICreateMasterWeeklySchedulePayload,
      errorMessage:
        'Некорректный payload создания интервала недельного расписания',
      logLabel: 'CreateMasterWeeklySchedulePayload',
      dataForSchema: raw,
    });
  }

  validateUpdatePayload(
    raw: Record<string, unknown>,
  ): IUpdateMasterWeeklySchedulePayload {
    return this.validateAndReturn<IUpdateMasterWeeklySchedulePayload>({
      validate: validateUpdateMasterWeeklySchedulePayload,
      data: raw as unknown as IUpdateMasterWeeklySchedulePayload,
      errorMessage:
        'Некорректный payload обновления интервала недельного расписания',
      logLabel: 'UpdateMasterWeeklySchedulePayload',
      dataForSchema: raw,
    });
  }

  private normalizeListQueryRaw(
    raw: Record<string, unknown>,
  ): IGetMasterWeeklySchedulesQueryPayload {
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

    return out as IGetMasterWeeklySchedulesQueryPayload;
  }
}
