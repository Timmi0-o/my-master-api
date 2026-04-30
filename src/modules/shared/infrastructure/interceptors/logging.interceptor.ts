import {
  CallHandler,
  ExecutionContext,
  Inject,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { Observable, tap } from 'rxjs';
import type { ILoggerService } from '../../domain/services/i-logger.service';
import { ILoggerSymbol } from '../../domain/services/i-logger.service';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(@Inject(ILoggerSymbol) private readonly logger: ILoggerService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const request = context.switchToHttp().getRequest<Request>();
    const response = context.switchToHttp().getResponse<Response>();

    const { method, url, query, params } = request;
    const userAgent = request.get('user-agent') || '';
    const start = Date.now();

    this.logger.debug(
      `→ ${method} ${url}`,
      JSON.stringify({
        query,
        params,
        userAgent,
      }),
      'LoggingInterceptor',
    );

    return next.handle().pipe(
      tap(() => {
        const duration = Date.now() - start;
        const statusCode = response.statusCode;

        this.logger.debug(
          `← ${method} ${url} [${statusCode}] ${duration}ms`,
          JSON.stringify({
            statusCode,
            duration,
          }),
          'LoggingInterceptor',
        );
      }),
    );
  }
}
