import {
  BadRequestException,
  HttpException,
  InternalServerErrorException,
} from '@nestjs/common';
import { DomainError } from 'src/modules/shared/domain/errors';
import { mapDomainErrorToHttp } from 'src/modules/shared/infrastructure/filters/map-domain-error';

export interface IWsErrorResponse {
  error: {
    statusCode: number;
    message: string;
  };
}

function mapHttpExceptionToWsError(exception: HttpException): IWsErrorResponse {
  const statusCode = exception.getStatus();
  const response = exception.getResponse();
  const message =
    typeof response === 'string'
      ? response
      : typeof response === 'object' &&
          response !== null &&
          'message' in response
        ? String(
            Array.isArray(response.message)
              ? response.message.join(', ')
              : response.message,
          )
        : exception.message;

  return {
    error: {
      statusCode,
      message,
    },
  };
}

export function mapWsErrorResponse(error: unknown): IWsErrorResponse {
  if (error instanceof DomainError) {
    return mapHttpExceptionToWsError(mapDomainErrorToHttp(error));
  }

  if (error instanceof HttpException) {
    return mapHttpExceptionToWsError(error);
  }

  if (error instanceof BadRequestException) {
    return mapHttpExceptionToWsError(error);
  }

  return mapHttpExceptionToWsError(
    new InternalServerErrorException('Internal server error'),
  );
}
