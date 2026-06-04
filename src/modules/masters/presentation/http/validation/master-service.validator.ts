import { BadRequestException, Injectable } from '@nestjs/common';
import { ajv } from 'src/modules/shared/presentation/http/validation/ajv-instance';
import { BaseValidator } from 'src/modules/shared/presentation/http/validation/base.validator';
import { createMasterServicePayloadSchema } from './schemas/create-master-service-payload.schema';
import type { ICreateMasterServicePayload } from './schemas/create-master-service-payload.types';
import { updateMasterServicePayloadSchema } from './schemas/update-master-service-payload.schema';
import type { IUpdateMasterServicePayload } from './schemas/update-master-service-payload.types';
import { getMasterServicesQuerySchema } from './schemas/get-master-services-query.schema';
import type { IGetMasterServicesQueryPayload } from './schemas/get-master-services-query.types';
import { getByIdQuerySchema } from './schemas/get-by-id-query.schema';
import type { IGetByIdQueryPayload } from './schemas/get-by-id-query.types';
import { idParamSchema } from './schemas/id-param.schema';
import type { IIdParamPayload } from './schemas/id-param.types';
import { getMasterServiceAvailableSlotsQuerySchema } from './schemas/get-master-service-available-slots-query.schema';
import type { IGetMasterServiceAvailableSlotsQueryPayload } from './schemas/get-master-service-available-slots-query.types';

const validateGetMasterServicesQuery = ajv.compile(getMasterServicesQuerySchema);
const validateGetByIdQuery = ajv.compile(getByIdQuerySchema);
const validateGetMasterServiceAvailableSlotsQuery = ajv.compile(
  getMasterServiceAvailableSlotsQuerySchema,
);
const validateIdParam = ajv.compile(idParamSchema);
const validateCreateMasterServicePayload = ajv.compile(
  createMasterServicePayloadSchema,
);
const validateUpdateMasterServicePayload = ajv.compile(
  updateMasterServicePayloadSchema,
);

@Injectable()
export class MasterServiceValidator extends BaseValidator {
  validateGetMasterServicesQuery(
    raw: Record<string, unknown>,
  ): IGetMasterServicesQueryPayload {
    const normalized = this.normalizeListQueryRaw(raw);
    return this.validateAndReturn<IGetMasterServicesQueryPayload>({
      validate: validateGetMasterServicesQuery,
      data: normalized,
      errorMessage: 'Некорректные параметры запроса списка услуг мастеров',
      logLabel: 'GetMasterServicesQuery',
      dataForSchema: normalized,
    });
  }

  validateGetByIdQuery(raw: Record<string, unknown>): IGetByIdQueryPayload {
    return this.validateAndReturn<IGetByIdQueryPayload>({
      validate: validateGetByIdQuery,
      data: raw,
      errorMessage: 'Некорректные параметры запроса',
      logLabel: 'GetMasterServiceByIdQuery',
      dataForSchema: raw,
    });
  }

  validateGetAvailableSlotsQuery(
    raw: Record<string, unknown>,
  ): IGetMasterServiceAvailableSlotsQueryPayload {
    return this.validateAndReturn<IGetMasterServiceAvailableSlotsQueryPayload>({
      validate: validateGetMasterServiceAvailableSlotsQuery,
      data: raw,
      errorMessage: 'Некорректные параметры запроса свободных слотов',
      logLabel: 'GetMasterServiceAvailableSlotsQuery',
      dataForSchema: raw,
    });
  }

  validateIdParam(raw: Record<string, unknown>): IIdParamPayload {
    const normalized: IIdParamPayload = { id: String(raw.id ?? '') };
    return this.validateAndReturn<IIdParamPayload>({
      validate: validateIdParam,
      data: normalized,
      errorMessage: 'Некорректный идентификатор',
      logLabel: 'MasterServiceIdParam',
      dataForSchema: normalized,
    });
  }

  validateCreatePayload(
    raw: Record<string, unknown>,
  ): ICreateMasterServicePayload {
    return this.validateAndReturn<ICreateMasterServicePayload>({
      validate: validateCreateMasterServicePayload,
      data: raw as unknown as ICreateMasterServicePayload,
      errorMessage: 'Некорректный payload создания услуги мастера',
      logLabel: 'CreateMasterServicePayload',
      dataForSchema: raw,
    });
  }

  validateUpdatePayload(
    raw: Record<string, unknown>,
  ): IUpdateMasterServicePayload {
    return this.validateAndReturn<IUpdateMasterServicePayload>({
      validate: validateUpdateMasterServicePayload,
      data: raw as unknown as IUpdateMasterServicePayload,
      errorMessage: 'Некорректный payload обновления услуги мастера',
      logLabel: 'UpdateMasterServicePayload',
      dataForSchema: raw,
    });
  }

  private normalizeListQueryRaw(
    raw: Record<string, unknown>,
  ): IGetMasterServicesQueryPayload {
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

    return out as IGetMasterServicesQueryPayload;
  }
}
