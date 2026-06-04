import { BadRequestException, Injectable } from '@nestjs/common';
import { ajv } from 'src/modules/shared/presentation/http/validation/ajv-instance';
import { BaseValidator } from 'src/modules/shared/presentation/http/validation/base.validator';
import { createAppointmentChatMessagePayloadSchema } from './schemas/create-appointment-chat-message-payload.schema';
import type { ICreateAppointmentChatMessagePayload } from './schemas/create-appointment-chat-message-payload.types';
import { getAppointmentChatMessagesQuerySchema } from './schemas/get-appointment-chat-messages-query.schema';
import type { IGetAppointmentChatMessagesQueryPayload } from './schemas/get-appointment-chat-messages-query.types';
import { getByIdQuerySchema } from './schemas/get-by-id-query.schema';
import type { IGetByIdQueryPayload } from './schemas/get-by-id-query.types';
import { idParamSchema } from './schemas/id-param.schema';
import type { IIdParamPayload } from './schemas/id-param.types';

const validateGetMessagesQuery = ajv.compile(getAppointmentChatMessagesQuerySchema);
const validateGetByIdQuery = ajv.compile(getByIdQuerySchema);
const validateIdParam = ajv.compile(idParamSchema);
const validateCreatePayload = ajv.compile(createAppointmentChatMessagePayloadSchema);

@Injectable()
export class AppointmentChatMessageValidator extends BaseValidator {
  validateGetAppointmentChatMessagesQuery(
    raw: Record<string, unknown>,
  ): IGetAppointmentChatMessagesQueryPayload {
    const normalized = this.normalizeListQueryRaw(raw);
    return this.validateAndReturn<IGetAppointmentChatMessagesQueryPayload>({
      validate: validateGetMessagesQuery,
      data: normalized,
      errorMessage: 'Некорректные параметры запроса списка сообщений',
      logLabel: 'GetAppointmentChatMessagesQuery',
      dataForSchema: normalized,
    });
  }

  validateGetByIdQuery(raw: Record<string, unknown>): IGetByIdQueryPayload {
    return this.validateAndReturn<IGetByIdQueryPayload>({
      validate: validateGetByIdQuery,
      data: raw,
      errorMessage: 'Некорректные параметры запроса',
      logLabel: 'GetAppointmentChatMessageByIdQuery',
      dataForSchema: raw,
    });
  }

  validateIdParam(raw: Record<string, unknown>): IIdParamPayload {
    const normalized: IIdParamPayload = { id: String(raw.id ?? '') };
    return this.validateAndReturn<IIdParamPayload>({
      validate: validateIdParam,
      data: normalized,
      errorMessage: 'Некорректный идентификатор',
      logLabel: 'AppointmentChatMessageIdParam',
      dataForSchema: normalized,
    });
  }

  validateCreatePayload(
    raw: Record<string, unknown>,
  ): ICreateAppointmentChatMessagePayload {
    return this.validateAndReturn<ICreateAppointmentChatMessagePayload>({
      validate: validateCreatePayload,
      data: raw as unknown as ICreateAppointmentChatMessagePayload,
      errorMessage: 'Некорректный payload создания сообщения',
      logLabel: 'CreateAppointmentChatMessagePayload',
      dataForSchema: raw,
    });
  }

  private normalizeListQueryRaw(
    raw: Record<string, unknown>,
  ): IGetAppointmentChatMessagesQueryPayload {
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
    return out as IGetAppointmentChatMessagesQueryPayload;
  }
}
