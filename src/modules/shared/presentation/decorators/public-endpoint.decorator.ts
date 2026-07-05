import { SetMetadata } from '@nestjs/common';

export const PUBLIC_ENDPOINT_KEY = 'public_endpoint';

export const PublicEndpoint = (): MethodDecorator =>
  SetMetadata(PUBLIC_ENDPOINT_KEY, true);
