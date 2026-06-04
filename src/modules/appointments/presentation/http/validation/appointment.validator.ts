import { BadRequestException, Injectable } from '@nestjs/common';
import { ajv } from 'src/modules/shared/presentation/http/validation/ajv-instance';
import { BaseValidator } from 'src/modules/shared/presentation/http/validation/base.validator';
import { createAppointmentPayloadSchema } from './schemas/create-appointment-payload.schema';
import type { ICreateAppointmentPayload } from './schemas/create-appointment-payload.types';
import { updateAppointmentPayloadSchema } from './schemas/update-appointment-payload.schema';
import type { IUpdateAppointmentPayload } from './schemas/update-appointment-payload.types';
import { getAppointmentsQuerySchema } from './schemas/get-appointments-query.schema';
import type { IGetAppointmentsQueryPayload } from './schemas/get-appointments-query.types';
import { getByIdQuerySchema } from './schemas/get-by-id-query.schema';
import type { IGetByIdQueryPayload } from './schemas/get-by-id-query.types';
import { idParamSchema } from './schemas/id-param.schema';
import type { IIdParamPayload } from './schemas/id-param.types';

const validateGetAppointmentsQuery = ajv.compile(getAppointmentsQuerySchema);
const validateGetByIdQuery = ajv.compile(getByIdQuerySchema);
const validateIdParam = ajv.compile(idParamSchema);
const validateCreateAppointmentPayload = ajv.compile(createAppointmentPayloadSchema);
const validateUpdateAppointmentPayload = ajv.compile(updateAppointmentPayloadSchema);

@Injectable()
export class AppointmentValidator extends BaseValidator {
  validateGetAppointmentsQuery(
    raw: Record<string, unknown>,
  ): IGetAppointmentsQueryPayload {
    const normalized = this.normalizeListQueryRaw(raw);
    return this.validateAndReturn<IGetAppointmentsQueryPayload>({
      validate: validateGetAppointmentsQuery,
      data: normalized,
      errorMessage: 'Некорректные параметры запроса списка записей',
      logLabel: 'GetAppointmentsQuery',
      dataForSchema: normalized,
    });
  }

  validateGetByIdQuery(raw: Record<string, unknown>): IGetByIdQueryPayload {
    return this.validateAndReturn<IGetByIdQueryPayload>({
      validate: validateGetByIdQuery,
      data: raw,
      errorMessage: 'Некорректные параметры запроса',
      logLabel: 'GetAppointmentByIdQuery',
      dataForSchema: raw,
    });
  }

  validateIdParam(raw: Record<string, unknown>): IIdParamPayload {
    const normalized: IIdParamPayload = { id: String(raw.id ?? '') };
    return this.validateAndReturn<IIdParamPayload>({
      validate: validateIdParam,
      data: normalized,
      errorMessage: 'Некорректный идентификатор',
      logLabel: 'AppointmentIdParam',
      dataForSchema: normalized,
    });
  }

  validateCreatePayload(raw: Record<string, unknown>): ICreateAppointmentPayload {
    return this.validateAndReturn<ICreateAppointmentPayload>({
      validate: validateCreateAppointmentPayload,
      data: raw as unknown as ICreateAppointmentPayload,
      errorMessage: 'Некорректный payload создания записи',
      logLabel: 'CreateAppointmentPayload',
      dataForSchema: raw,
    });
  }

  validateUpdatePayload(raw: Record<string, unknown>): IUpdateAppointmentPayload {
    return this.validateAndReturn<IUpdateAppointmentPayload>({
      validate: validateUpdateAppointmentPayload,
      data: raw as unknown as IUpdateAppointmentPayload,
      errorMessage: 'Некорректный payload обновления записи',
      logLabel: 'UpdateAppointmentPayload',
      dataForSchema: raw,
    });
  }

  private normalizeListQueryRaw(
    raw: Record<string, unknown>,
  ): IGetAppointmentsQueryPayload {
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

    return out as IGetAppointmentsQueryPayload;
  }
}
