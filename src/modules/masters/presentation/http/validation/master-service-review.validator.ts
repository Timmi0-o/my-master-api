import { BadRequestException, Injectable } from '@nestjs/common';
import { ajv } from 'src/modules/shared/presentation/http/validation/ajv-instance';
import { BaseValidator } from 'src/modules/shared/presentation/http/validation/base.validator';
import { createMasterServiceReviewPayloadSchema } from './schemas/create-master-service-review-payload.schema';
import type { ICreateMasterServiceReviewPayload } from './schemas/create-master-service-review-payload.types';
import { getByIdQuerySchema } from './schemas/get-by-id-query.schema';
import type { IGetByIdQueryPayload } from './schemas/get-by-id-query.types';
import { getMasterServiceReviewsQuerySchema } from './schemas/get-master-service-reviews-query.schema';
import type { IGetMasterServiceReviewsQueryPayload } from './schemas/get-master-service-reviews-query.types';
import { idParamSchema } from './schemas/id-param.schema';
import type { IIdParamPayload } from './schemas/id-param.types';
import { updateMasterServiceReviewPayloadSchema } from './schemas/update-master-service-review-payload.schema';
import type { IUpdateMasterServiceReviewPayload } from './schemas/update-master-service-review-payload.types';

const validateGetMasterServiceReviewsQuery = ajv.compile(
  getMasterServiceReviewsQuerySchema,
);
const validateGetByIdQuery = ajv.compile(getByIdQuerySchema);
const validateIdParam = ajv.compile(idParamSchema);
const validateCreateMasterServiceReviewPayload = ajv.compile(
  createMasterServiceReviewPayloadSchema,
);
const validateUpdateMasterServiceReviewPayload = ajv.compile(
  updateMasterServiceReviewPayloadSchema,
);

@Injectable()
export class MasterServiceReviewValidator extends BaseValidator {
  validateGetMasterServiceReviewsQuery(
    raw: Record<string, unknown>,
  ): IGetMasterServiceReviewsQueryPayload {
    const normalized = this.normalizeListQueryRaw(raw);
    return this.validateAndReturn<IGetMasterServiceReviewsQueryPayload>({
      validate: validateGetMasterServiceReviewsQuery,
      data: normalized,
      errorMessage: 'Некорректные параметры запроса списка отзывов на услуги мастера',
      logLabel: 'GetMasterServiceReviewsQuery',
      dataForSchema: normalized,
    });
  }

  validateGetByIdQuery(raw: Record<string, unknown>): IGetByIdQueryPayload {
    return this.validateAndReturn<IGetByIdQueryPayload>({
      validate: validateGetByIdQuery,
      data: raw,
      errorMessage: 'Некорректные параметры запроса',
      logLabel: 'GetMasterServiceReviewByIdQuery',
      dataForSchema: raw,
    });
  }

  validateIdParam(raw: Record<string, unknown>): IIdParamPayload {
    const normalized: IIdParamPayload = { id: String(raw.id ?? '') };
    return this.validateAndReturn<IIdParamPayload>({
      validate: validateIdParam,
      data: normalized,
      errorMessage: 'Некорректный идентификатор',
      logLabel: 'MasterServiceReviewIdParam',
      dataForSchema: normalized,
    });
  }

  validateCreatePayload(
    raw: Record<string, unknown>,
  ): ICreateMasterServiceReviewPayload {
    return this.validateAndReturn<ICreateMasterServiceReviewPayload>({
      validate: validateCreateMasterServiceReviewPayload,
      data: raw as unknown as ICreateMasterServiceReviewPayload,
      errorMessage: 'Некорректный payload создания отзыва на услугу мастера',
      logLabel: 'CreateMasterServiceReviewPayload',
      dataForSchema: raw,
    });
  }

  validateUpdatePayload(
    raw: Record<string, unknown>,
  ): IUpdateMasterServiceReviewPayload {
    return this.validateAndReturn<IUpdateMasterServiceReviewPayload>({
      validate: validateUpdateMasterServiceReviewPayload,
      data: raw as unknown as IUpdateMasterServiceReviewPayload,
      errorMessage: 'Некорректный payload обновления отзыва на услугу мастера',
      logLabel: 'UpdateMasterServiceReviewPayload',
      dataForSchema: raw,
    });
  }

  private normalizeListQueryRaw(
    raw: Record<string, unknown>,
  ): IGetMasterServiceReviewsQueryPayload {
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

    return out as IGetMasterServiceReviewsQueryPayload;
  }
}
