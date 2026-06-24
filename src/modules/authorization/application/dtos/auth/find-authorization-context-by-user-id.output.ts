import type { IAuthorizationContext } from 'src/modules/authorization/domain/auth/authorization-context.types';

export interface IFindAuthorizationContextByUserIdApplicationInput {
  userId: string;
}

export type IFindAuthorizationContextByUserIdApplicationOutput =
  IAuthorizationContext | null;
