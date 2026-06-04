import { BadRequestException, Injectable } from '@nestjs/common';
import { ajv } from 'src/modules/shared/presentation/http/validation/ajv-instance';
import { BaseValidator } from 'src/modules/shared/presentation/http/validation/base.validator';
import { getAppointmentChatsQuerySchema } from './schemas/get-appointment-chats-query.schema';
import type { IGetAppointmentChatsQueryPayload } from './schemas/get-appointment-chats-query.types';
import { getByIdQuerySchema } from './schemas/get-by-id-query.schema';
import type { IGetByIdQueryPayload } from './schemas/get-by-id-query.types';
import { idParamSchema } from './schemas/id-param.schema';
import type { IIdParamPayload } from './schemas/id-param.types';

const validateGetAppointmentChatsQuery = ajv.compile(getAppointmentChatsQuerySchema);
const validateGetByIdQuery = ajv.compile(getByIdQuerySchema);
const validateIdParam = ajv.compile(idParamSchema);

@Injectable()
export class AppointmentChatValidator extends BaseValidator {
  validateGetAppointmentChatsQuery(
    raw: Record<string, unknown>,
  ): IGetAppointmentChatsQueryPayload {
    const normalized = this.normalizeListQueryRaw(raw);
    return this.validateAndReturn<IGetAppointmentChatsQueryPayload>({
      validate: validateGetAppointmentChatsQuery,
      data: normalized,
      errorMessage: 'Некорректные параметры запроса списка чатов записей',
      logLabel: 'GetAppointmentChatsQuery',
      dataForSchema: normalized,
    });
  }

  validateGetByIdQuery(raw: Record<string, unknown>): IGetByIdQueryPayload {
    return this.validateAndReturn<IGetByIdQueryPayload>({
      validate: validateGetByIdQuery,
      data: raw,
      errorMessage: 'Некорректные параметры запроса',
      logLabel: 'GetAppointmentChatByIdQuery',
      dataForSchema: raw,
    });
  }

  validateIdParam(raw: Record<string, unknown>): IIdParamPayload {
    const normalized: IIdParamPayload = { id: String(raw.id ?? '') };
    return this.validateAndReturn<IIdParamPayload>({
      validate: validateIdParam,
      data: normalized,
      errorMessage: 'Некорректный идентификатор',
      logLabel: 'AppointmentChatIdParam',
      dataForSchema: normalized,
    });
  }

  private normalizeListQueryRaw(
    raw: Record<string, unknown>,
  ): IGetAppointmentChatsQueryPayload {
    const out: Record<string, unknown> = { ...raw };
    if (typeof out.filter === 'string') {
      const s = out.filter.trim();
      if (s.length === 0) delete out.filter;
      else {
        try { out.filter = JSON.parse(s); }
        catch { throw new BadRequestException('Query parameter filter must be a valid JSON object'); }
      }
    }
    if (out.requiredIds !== undefined && out.requiredIds !== null) {
      out.requiredIds = Array.isArray(out.requiredIds) ? out.requiredIds : [out.requiredIds];
    }
    return out as IGetAppointmentChatsQueryPayload;
  }
}
