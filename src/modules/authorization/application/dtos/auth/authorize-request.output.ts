import type { TAuthorizeOptions } from 'src/modules/authorization/domain/auth/authorize-options';
import type { IAuthorizedCaller } from 'src/modules/authorization/domain/auth/authorized-caller.types';

export interface IAuthorizeRequestApplicationInput {
  userId?: string | null;
  options: TAuthorizeOptions;
}

export type IAuthorizeRequestApplicationOutput = IAuthorizedCaller;
