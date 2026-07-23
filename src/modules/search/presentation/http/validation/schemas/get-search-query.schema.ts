import { JSONSchemaType } from 'ajv';
import { FILTER_TEXT_SEARCH_MAX_LENGTH } from 'src/constants';
import { EMasterServiceCategory } from 'src/modules/masters/domain/entities/master-service';
import { limitSchema } from 'src/modules/shared/presentation/http/validation/schemas/common.schemas';
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
    limit: limitSchema,
  },
  required: [],
  additionalProperties: false,
};
