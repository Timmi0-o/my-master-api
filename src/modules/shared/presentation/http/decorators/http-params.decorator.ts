import { Param } from '@nestjs/common';
import type { JSONSchemaType } from 'ajv';
import {
  createHttpPayloadValidationPipe,
  type HttpPayloadPipeOptions,
} from '../pipes/http-payload-validation.pipe';

export const HttpParams = <T>(
  schema: JSONSchemaType<T>,
  options?: HttpPayloadPipeOptions,
): ParameterDecorator => Param(createHttpPayloadValidationPipe(schema, options));
