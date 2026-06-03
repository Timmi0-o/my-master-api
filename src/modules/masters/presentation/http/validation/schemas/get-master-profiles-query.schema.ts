import { JSONSchemaType } from 'ajv';
import { FILTER_UUID_ARRAY_MAX_ITEMS } from 'src/constants';
import {
  idSchema,
  limitSchema,
  pageSchema,
  presetSchema,
} from 'src/modules/shared/presentation/http/validation/schemas/common.schemas';
import type { IGetMasterProfilesQueryPayload } from './get-master-profiles-query.types';
import { MASTER_PROFILE_LIST_ORDER_FIELDS } from './get-master-profiles-query.types';
import { masterProfileFiltersPresetSchema } from './master-profile-filters-preset.schema';

export const getMasterProfilesQuerySchema: JSONSchemaType<IGetMasterProfilesQueryPayload> =
  {
    type: 'object',
    properties: {
      preset: { ...presetSchema, nullable: true },
      limit: limitSchema,
      page: pageSchema,
      orderField: {
        type: 'string',
        enum: [...MASTER_PROFILE_LIST_ORDER_FIELDS],
        nullable: true,
      },
      orderDir: {
        type: 'string',
        enum: ['asc', 'desc'],
        nullable: true,
      },
      filter: { ...masterProfileFiltersPresetSchema, nullable: true },
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
