import { JSONSchemaType } from 'ajv';
import {
  FILTER_ENUM_ARRAY_MAX_ITEMS,
  FILTER_STRING_ARRAY_MAX_ITEMS,
  FILTER_STRING_ITEM_MAX_LENGTH,
  FILTER_TEXT_SEARCH_MAX_LENGTH,
  FILTER_UUID_ARRAY_MAX_ITEMS,
} from 'src/constants';
import type {
  IDateRangeArrayFilter,
  IStringArrayFilter,
  ITextSearchFilterPreset,
} from 'src/modules/shared/application/presets/common/filter-preset.types';

import { idSchema } from './common.schemas';

export const modeFilterSchema = {
  type: 'string' as const,
  enum: ['OR', 'AND'] as const,
  nullable: true as const,
};

export function filterEnumArraySchema(enumValues: readonly string[]): {
  type: 'object';
  properties: {
    value: {
      type: 'array';
      items: { type: 'string'; enum: string[] };
      minItems: number;
      maxItems: number;
    };
    mode: typeof modeFilterSchema;
  };
  required: ['value'];
  additionalProperties: false;
} {
  return {
    type: 'object',
    properties: {
      value: {
        type: 'array',
        items: { type: 'string', enum: [...enumValues] },
        minItems: 1,
        maxItems: FILTER_ENUM_ARRAY_MAX_ITEMS,
      },
      mode: modeFilterSchema,
    },
    required: ['value'],
    additionalProperties: false,
  };
}

export const filterUuidArraySchema: JSONSchemaType<IStringArrayFilter> = {
  type: 'object',
  properties: {
    value: {
      type: 'array',
      items: idSchema,
      minItems: 1,
      maxItems: FILTER_UUID_ARRAY_MAX_ITEMS,
    },
    mode: modeFilterSchema,
  },
  required: ['value'],
  additionalProperties: false,
};

export const filterStringArraySchema: JSONSchemaType<IStringArrayFilter> = {
  type: 'object',
  properties: {
    value: {
      type: 'array',
      items: { type: 'string', maxLength: FILTER_STRING_ITEM_MAX_LENGTH },
      minItems: 1,
      maxItems: FILTER_STRING_ARRAY_MAX_ITEMS,
    },
    mode: modeFilterSchema,
  },
  required: ['value'],
  additionalProperties: false,
};

export const textSearchFilterModeSchema = {
  type: 'string' as const,
  enum: ['STRICT', 'PARTIAL'] as const,
  nullable: true as const,
};

export const textSearchFilterPresetSchema: JSONSchemaType<ITextSearchFilterPreset> =
  {
    type: 'object',
    properties: {
      value: {
        type: 'string',
        minLength: 1,
        maxLength: FILTER_TEXT_SEARCH_MAX_LENGTH,
      },
      mode: textSearchFilterModeSchema,
    },
    required: ['value'],
    additionalProperties: false,
  };

export const dateRangeArrayFilterSchema: JSONSchemaType<IDateRangeArrayFilter> =
  {
    type: 'object',
    properties: {
      value: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            lt: { type: 'string', format: 'date-time', nullable: true },
            lte: { type: 'string', format: 'date-time', nullable: true },
            gt: { type: 'string', format: 'date-time', nullable: true },
            gte: { type: 'string', format: 'date-time', nullable: true },
          },
          required: [],
          additionalProperties: false,
        },
        minItems: 1,
      },
    },
    required: ['value'],
    additionalProperties: false,
  };
