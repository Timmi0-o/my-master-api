import { BadRequestException, Injectable } from '@nestjs/common';
import { ajv } from 'src/modules/shared/presentation/http/validation/ajv-instance';
import { BaseValidator } from 'src/modules/shared/presentation/http/validation/base.validator';
import { createMasterProfilePayloadSchema } from './schemas/create-master-profile-payload.schema';
import type { ICreateMasterProfilePayload } from './schemas/create-master-profile-payload.types';
import { updateMasterProfilePayloadSchema } from './schemas/update-master-profile-payload.schema';
import type { IUpdateMasterProfilePayload } from './schemas/update-master-profile-payload.types';
import { getMasterProfilesQuerySchema } from './schemas/get-master-profiles-query.schema';
import type { IGetMasterProfilesQueryPayload } from './schemas/get-master-profiles-query.types';
import { getByIdQuerySchema } from './schemas/get-by-id-query.schema';
import type { IGetByIdQueryPayload } from './schemas/get-by-id-query.types';
import { idParamSchema } from './schemas/id-param.schema';
import type { IIdParamPayload } from './schemas/id-param.types';

const validateGetMasterProfilesQuery = ajv.compile(getMasterProfilesQuerySchema);
const validateGetByIdQuery = ajv.compile(getByIdQuerySchema);
const validateIdParam = ajv.compile(idParamSchema);
const validateCreateMasterProfilePayload = ajv.compile(
  createMasterProfilePayloadSchema,
);
const validateUpdateMasterProfilePayload = ajv.compile(
  updateMasterProfilePayloadSchema,
);

@Injectable()
export class MasterProfileValidator extends BaseValidator {
  validateGetMasterProfilesQuery(
    raw: Record<string, unknown>,
  ): IGetMasterProfilesQueryPayload {
    const normalized = this.normalizeListQueryRaw(raw);
    return this.validateAndReturn<IGetMasterProfilesQueryPayload>({
      validate: validateGetMasterProfilesQuery,
      data: normalized,
      errorMessage: 'Некорректные параметры запроса списка профилей мастеров',
      logLabel: 'GetMasterProfilesQuery',
      dataForSchema: normalized,
    });
  }

  validateGetByIdQuery(raw: Record<string, unknown>): IGetByIdQueryPayload {
    return this.validateAndReturn<IGetByIdQueryPayload>({
      validate: validateGetByIdQuery,
      data: raw,
      errorMessage: 'Некорректные параметры запроса',
      logLabel: 'GetMasterProfileByIdQuery',
      dataForSchema: raw,
    });
  }

  validateIdParam(raw: Record<string, unknown>): IIdParamPayload {
    const normalized: IIdParamPayload = { id: String(raw.id ?? '') };
    return this.validateAndReturn<IIdParamPayload>({
      validate: validateIdParam,
      data: normalized,
      errorMessage: 'Некорректный идентификатор',
      logLabel: 'MasterProfileIdParam',
      dataForSchema: normalized,
    });
  }

  validateCreatePayload(
    raw: Record<string, unknown>,
  ): ICreateMasterProfilePayload {
    return this.validateAndReturn<ICreateMasterProfilePayload>({
      validate: validateCreateMasterProfilePayload,
      data: raw as unknown as ICreateMasterProfilePayload,
      errorMessage: 'Некорректный payload создания профиля мастера',
      logLabel: 'CreateMasterProfilePayload',
      dataForSchema: raw,
    });
  }

  validateUpdatePayload(
    raw: Record<string, unknown>,
  ): IUpdateMasterProfilePayload {
    return this.validateAndReturn<IUpdateMasterProfilePayload>({
      validate: validateUpdateMasterProfilePayload,
      data: raw as unknown as IUpdateMasterProfilePayload,
      errorMessage: 'Некорректный payload обновления профиля мастера',
      logLabel: 'UpdateMasterProfilePayload',
      dataForSchema: raw,
    });
  }

  private normalizeListQueryRaw(
    raw: Record<string, unknown>,
  ): IGetMasterProfilesQueryPayload {
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

    return out as IGetMasterProfilesQueryPayload;
  }
}
