import { SetMetadata } from '@nestjs/common';
import type { TAuthorizeOptions } from 'src/modules/authorization/domain/auth/authorize-options';

export const AUTHORIZE_OPTIONS_KEY = 'authorize_options';

export const Authorize = (options: TAuthorizeOptions) =>
  SetMetadata(AUTHORIZE_OPTIONS_KEY, options);
