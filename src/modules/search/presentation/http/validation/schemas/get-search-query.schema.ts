import { JSONSchemaType } from 'ajv';
import { FILTER_TEXT_SEARCH_MAX_LENGTH } from 'src/constants';
import { EMasterServiceCategory } from 'src/modules/masters/domain/entities/master-service';
import { SEARCH_SORT_VALUES } from 'src/modules/search/application/dtos/search-by-text.dto';
import {
  limitSchema,
  pageSchema,
} from 'src/modules/shared/presentation/http/validation/schemas/common.schemas';
import type { IGetSearchQueryPayload } from './get-search-query.types';

export const getSearchQuerySchema: JSONSchemaType<IGetSearchQueryPayload> = {
  type: 'object',
  properties: {
    q: {
      type: 'string',
      minLength: 1,
      maxLength: FILTER_TEXT_SEARCH_MAX_LENGTH,
      nullable: true,
    },
    category: {
      type: 'string',
      enum: Object.values(EMasterServiceCategory),
      nullable: true,
    },
    localityId: {
      type: 'string',
      format: 'uuid',
      nullable: true,
    },
    minPrice: {
      type: 'number',
      minimum: 0,
      nullable: true,
    },
    maxPrice: {
      type: 'number',
      minimum: 0,
      nullable: true,
    },
    minRating: {
      type: 'number',
      minimum: 0,
      maximum: 5,
      nullable: true,
    },
    sort: {
      type: 'string',
      enum: [...SEARCH_SORT_VALUES],
      nullable: true,
    },
    page: pageSchema,
    limit: limitSchema,
  },
  required: [],
  additionalProperties: false,
};
