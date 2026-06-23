import { JSONSchemaType } from 'ajv';
import { FILTER_UUID_ARRAY_MAX_ITEMS } from 'src/constants';
import {
  idSchema,
  limitSchema,
  pageSchema,
  presetSchema,
} from 'src/modules/shared/presentation/http/validation/schemas/common.schemas';
import type { IGetMyServicesQueryPayload } from './get-my-services-query.types';
import { MY_MASTER_SERVICE_LIST_ORDER_FIELDS } from './get-my-services-query.types';
import { myMasterServiceFiltersPresetSchema } from './my-master-service-filters-preset.schema';

export const getMyServicesQuerySchema: JSONSchemaType<IGetMyServicesQueryPayload> =
  {
    type: 'object',
    properties: {
      preset: { ...presetSchema, nullable: true },
      limit: limitSchema,
      page: pageSchema,
      orderField: {
        type: 'string',
        enum: [...MY_MASTER_SERVICE_LIST_ORDER_FIELDS],
        nullable: true,
      },
      orderDir: {
        type: 'string',
        enum: ['asc', 'desc'],
        nullable: true,
      },
      filter: { ...myMasterServiceFiltersPresetSchema, nullable: true },
      requiredIds: {
        type: 'array',
        items: idSchema,
        nullable: true,
        maxItems: FILTER_UUID_ARRAY_MAX_ITEMS,
      },
    },
    required: [],
    additionalProperties: false,
  };
