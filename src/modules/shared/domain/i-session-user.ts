import { EUserRole, EUserStatus } from 'src/modules/users/domain/entities/user';

export interface ISessionUser {
  id: string;
  email: string;
  username: string;
  role: EUserRole;
  status: EUserStatus;
}
