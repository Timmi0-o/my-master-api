import { JSONSchemaType } from 'ajv';
import {
  limitSchema,
  pageSchema,
} from 'src/modules/shared/presentation/http/validation/schemas/common.schemas';
import type { IGetFeedServicesQueryPayload } from './get-feed-services-query.types';

export const getFeedServicesQuerySchema: JSONSchemaType<IGetFeedServicesQueryPayload> =
  {
    type: 'object',
    properties: {
      localityId: {
        type: 'string',
        format: 'uuid',
        nullable: true,
      },
      page: pageSchema,
      limit: limitSchema,
    },
    required: [],
    additionalProperties: false,
  };
