import { JSONSchemaType } from 'ajv';
import { idSchema } from 'src/modules/shared/presentation/http/validation/schemas/common.schemas';
import type { ICreateMasterServiceReviewReactionPayload } from './create-master-service-review-reaction-payload.types';

export const createMasterServiceReviewReactionPayloadSchema: JSONSchemaType<ICreateMasterServiceReviewReactionPayload> =
  {
    type: 'object',
    properties: {
      masterServiceReviewId: idSchema,
      type: { type: 'string', enum: ['LIKE', 'DISLIKE'] },
    },
    required: ['masterServiceReviewId', 'type'],
    additionalProperties: false,
  };
