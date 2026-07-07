import {
  ArgumentsHost,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';
import { Request, Response } from 'express';
import {
  ILoggerSymbol,
  type ILoggerService,
} from '../../domain/services/i-logger.service';

@Injectable()
export class GlobalExceptionFilter implements ExceptionFilter {
  constructor(@Inject(ILoggerSymbol) private readonly logger: ILoggerService) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    const context = host.switchToHttp();
    const response = context.getResponse<Response>();
    const request = context.getRequest<Request>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const exceptionResponse =
      exception instanceof HttpException ? exception.getResponse() : null;

    const message = this.resolveMessage(exceptionResponse, exception);

    this.logger.error(
      `${request.method}`,
      JSON.stringify({
        statusCode: status,
        path: request.url,
        method: request.method,
        message,
      }),
      'GlobalExceptionFilter',
    );

    response.status(status).json({
      result: null,
      error: {
        statusCode: status,
        message,
      },
    });
  }

  private resolveMessage(
    exceptionResponse: unknown,
    exception: unknown,
  ): string {
    if (typeof exceptionResponse === 'string') {
      return exceptionResponse;
    }

    if (
      exceptionResponse &&
      typeof exceptionResponse === 'object' &&
      'message' in exceptionResponse
    ) {
      const message = exceptionResponse.message;

      if (Array.isArray(message)) {
        return message.join(', ');
      }

      if (typeof message === 'string') {
        return message;
      }
    }

    if (exception instanceof Error) {
      return exception.message;
    }

    return 'Internal server error';
  }
}
