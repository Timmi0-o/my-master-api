import { Body } from '@nestjs/common';
import type { JSONSchemaType } from 'ajv';
import {
  createHttpPayloadValidationPipe,
  type HttpPayloadPipeOptions,
} from '../pipes/http-payload-validation.pipe';

export const HttpBody = <T>(
  schema: JSONSchemaType<T>,
  options?: HttpPayloadPipeOptions,
): ParameterDecorator => Body(createHttpPayloadValidationPipe(schema, options));
