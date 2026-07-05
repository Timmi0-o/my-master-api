import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import type { Request } from 'express';

@Injectable()
export class InternalWebhookGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const expectedSecret = process.env.MINIO_WEBHOOK_SECRET;
    if (!expectedSecret) {
      return true;
    }

    const request = context.switchToHttp().getRequest<Request>();
    const secretHeader = request.headers['x-minio-webhook-secret'];
    const authorization = request.headers.authorization;
    const tokenFromAuth =
      typeof authorization === 'string'
        ? authorization.replace(/^Bearer\s+/i, '')
        : undefined;
    const providedSecret =
      (typeof secretHeader === 'string' ? secretHeader : undefined) ??
      tokenFromAuth;

    if (providedSecret !== expectedSecret) {
      throw new UnauthorizedException('Invalid webhook secret');
    }

    return true;
  }
}
