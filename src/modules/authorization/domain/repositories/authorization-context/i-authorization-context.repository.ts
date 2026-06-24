import type { IAuthorizationContext } from '../../auth/authorization-context.types';

export interface IAuthorizationContextRepository {
  findByUserId(userId: string): Promise<IAuthorizationContext | null>;
}
