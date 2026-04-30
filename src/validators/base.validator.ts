import {
  BadRequestException,
  Logger,
  type LoggerService,
} from '@nestjs/common';
import type { ErrorObject, ValidateFunction } from 'ajv';

export abstract class BaseValidator {
  protected readonly logger: LoggerService;

  constructor(logger?: LoggerService) {
    this.logger = logger ?? new Logger(this.constructor.name);
  }

  protected validateAndReturn<T>(params: {
    validate: ValidateFunction;
    data: T;
    errorMessage: string;
    logLabel: string;
    dataForSchema?: unknown;
  }): T {
    const { validate, data, errorMessage, logLabel, dataForSchema } = params;
    const payload = dataForSchema ?? data;

    if (!validate(payload)) {
      this.logValidationError(logLabel, validate.errors);
      throw new BadRequestException({
        message: errorMessage,
        errors: this.formatErrors(validate.errors),
      });
    }

    return data;
  }

  private logValidationError(
    label: string,
    errors: ErrorObject[] | null | undefined,
  ): void {
    this.logger.warn(`${label}: ${JSON.stringify(errors)}`);
  }

  private formatErrors(
    errors: ErrorObject[] | null | undefined,
  ): Array<Record<string, unknown>> {
    if (!errors?.length) return [];
    return errors.map((e) => ({
      instancePath: e.instancePath,
      schemaPath: e.schemaPath,
      keyword: e.keyword,
      message: e.message,
      params: e.params,
    }));
  }
}
