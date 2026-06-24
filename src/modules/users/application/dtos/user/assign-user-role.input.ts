import type { IUserActorInput } from '../common/i-user-actor.input';

export interface IAssignUserRoleApplicationInput {
  userId: string;
  roleId: string;
  actor: IUserActorInput;
}
