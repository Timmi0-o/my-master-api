import type { ERoleIdentifier } from '../entities/role';

export interface IAuthorizedCaller {
  userId: string;
  roleId: string;
  roleIdentifier: ERoleIdentifier;
  permissions: string[];
}
