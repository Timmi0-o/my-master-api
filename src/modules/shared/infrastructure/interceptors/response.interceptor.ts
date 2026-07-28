import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable, map } from 'rxjs';
import { SKIP_RESPONSE_WRAP_KEY } from '../../presentation/decorators/skip-response-wrap.decorator';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  constructor(private readonly reflector: Reflector) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const skipWrap = this.reflector.getAllAndOverride<boolean>(
      SKIP_RESPONSE_WRAP_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (skipWrap) {
      return next.handle();
    }

    return next.handle().pipe(
      map((data) => {
        if (
          data &&
          typeof data === 'object' &&
          Object.prototype.hasOwnProperty.call(data, 'result')
        ) {
          return data as unknown;
        }

        return { result: data as unknown };
      }),
    );
  }
}
