import {
  BadRequestException,
  type PipeTransform,
  type Type,
} from '@nestjs/common';
import type { ErrorObject, JSONSchemaType, ValidateFunction } from 'ajv';
import { ajv } from '../ajv';

export type HttpPayloadPipeOptions = {
  preprocess?: (value: unknown) => unknown;
  errorMessage?: string;
};

function formatValidationErrors(
  errors: ErrorObject[] | null | undefined,
): string {
  return (errors ?? [])
    .map((error) =>
      `${error.instancePath || '/'} ${error.message ?? ''}`.trim(),
    )
    .join('; ');
}

function formatErrorsForResponse(
  errors: ErrorObject[] | null | undefined,
): Array<Record<string, unknown>> {
  if (!errors?.length) {
    return [];
  }

  return errors.map((error) => ({
    instancePath: error.instancePath,
    schemaPath: error.schemaPath,
    keyword: error.keyword,
    message: error.message,
    params: error.params,
  }));
}

export function createHttpPayloadValidationPipe<T>(
  schema: JSONSchemaType<T>,
  options: HttpPayloadPipeOptions = {},
): Type<PipeTransform> {
  const validate: ValidateFunction<T> = ajv.compile(schema);
  const { preprocess, errorMessage = 'HTTP payload validation failed' } =
    options;

  return class HttpPayloadValidationPipe implements PipeTransform {
    transform(value: unknown): T {
      const payload = preprocess ? preprocess(value) : value;

      if (!validate(payload)) {
        const details = formatValidationErrors(validate.errors);

        throw new BadRequestException({
          message: details ? `${errorMessage}: ${details}` : errorMessage,
          errors: formatErrorsForResponse(validate.errors),
        });
      }

      return payload as T;
    }
  };
}
