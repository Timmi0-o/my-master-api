import { Query } from '@nestjs/common';
import type { JSONSchemaType } from 'ajv';
import {
  createHttpPayloadValidationPipe,
  type HttpPayloadPipeOptions,
} from '../pipes/http-payload-validation.pipe';

export const HttpQuery = <T>(
  schema: JSONSchemaType<T>,
  options?: HttpPayloadPipeOptions,
): ParameterDecorator => Query(createHttpPayloadValidationPipe(schema, options));
