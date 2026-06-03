import type { IUserFiltersPreset } from '../types/user-filters-preset.types';
import {
  EUserLanguage,
  EUserRole,
  EUserStatus,
} from 'src/modules/users/domain/entities/user/user.enum';
import { JSONSchemaType } from 'ajv';
import {
  dateRangeArrayFilterSchema,
  filterEnumArraySchema,
  filterStringArraySchema,
  filterUuidArraySchema,
  textSearchFilterPresetSchema,
} from 'src/modules/shared/presentation/http/validation/schemas/filter-preset.schemas';

export const userFiltersPresetSchema: JSONSchemaType<IUserFiltersPreset> = {
  type: 'object',
  properties: {
    search: { ...textSearchFilterPresetSchema, nullable: true },
    id: { ...filterUuidArraySchema, nullable: true },
    email: { ...filterStringArraySchema, nullable: true },
    username: { ...filterStringArraySchema, nullable: true },
    role: {
      ...filterEnumArraySchema(Object.values(EUserRole)),
      nullable: true,
    },
    status: {
      ...filterEnumArraySchema(Object.values(EUserStatus)),
      nullable: true,
    },
    language: {
      ...filterEnumArraySchema(Object.values(EUserLanguage)),
      nullable: true,
    },
    createdAt: { ...dateRangeArrayFilterSchema, nullable: true },
    updatedAt: { ...dateRangeArrayFilterSchema, nullable: true },
    deletedAt: { ...dateRangeArrayFilterSchema, nullable: true },
  },
  required: [],
  additionalProperties: false,
};
