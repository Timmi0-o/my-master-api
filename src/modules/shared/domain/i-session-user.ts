import { ERoleIdentifier } from 'src/modules/authorization/domain/entities/role';
import { EUserStatus } from 'src/modules/users/domain/entities/user';

export interface ISessionUser {
  id: string;
  email: string;
  username: string;
  roleId: string;
  roleIdentifier: ERoleIdentifier;
  permissions: readonly string[];
  status: EUserStatus;
}
