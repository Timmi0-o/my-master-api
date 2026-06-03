import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { Response } from 'express';
import { DomainError } from 'src/modules/shared/domain/errors';
import { mapDomainErrorToHttp } from './map-domain-error';

@Catch(DomainError)
export class DomainExceptionFilter implements ExceptionFilter<DomainError> {
  catch(exception: DomainError, host: ArgumentsHost): void {
    const httpException = mapDomainErrorToHttp(exception);
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const status = httpException.getStatus();
    const exceptionResponse = httpException.getResponse();
    const message =
      typeof exceptionResponse === 'string'
        ? exceptionResponse
        : typeof exceptionResponse === 'object' &&
            exceptionResponse !== null &&
            'message' in exceptionResponse
          ? String(
              Array.isArray(exceptionResponse.message)
                ? exceptionResponse.message.join(', ')
                : exceptionResponse.message,
            )
          : exception.message;

    response.status(status).json({
      result: null,
      error: {
        statusCode: status,
        message,
      },
    });
  }
}
