import type { ERoleIdentifier } from '../entities/role';
import type { EUserStatus } from 'src/modules/users/domain/entities/user';

export interface IAuthorizationContext {
  userId: string;
  roleId: string;
  roleIdentifier: ERoleIdentifier;
  permissions: string[];
  status: EUserStatus;
}
