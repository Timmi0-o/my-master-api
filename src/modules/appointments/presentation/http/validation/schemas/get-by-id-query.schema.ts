import { JSONSchemaType } from 'ajv';
import { presetSchema } from 'src/modules/shared/presentation/http/validation/schemas/common.schemas';
import type { IGetByIdQueryPayload } from './get-by-id-query.types';

export const getByIdQuerySchema: JSONSchemaType<IGetByIdQueryPayload> = {
  type: 'object',
  properties: {
    preset: { ...presetSchema, nullable: true },
  },
  required: [],
  additionalProperties: false,
};
