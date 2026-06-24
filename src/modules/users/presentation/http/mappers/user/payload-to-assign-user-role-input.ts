import type { IAssignUserRoleApplicationInput } from 'src/modules/users/application/dtos/user/assign-user-role.input';
import type { ISessionUser } from 'src/modules/shared/domain/i-session-user';
import type { IAssignUserRolePayload } from '../../validation/schemas/assign-user-role-payload.types';
import { toUserActor } from '../shared/to-user-actor';

export function payloadToAssignUserRoleInput(
  userId: string,
  payload: IAssignUserRolePayload,
  sessionUser: ISessionUser,
  isStaffUser: boolean,
): IAssignUserRoleApplicationInput {
  return {
    userId,
    roleId: payload.roleId,
    actor: toUserActor(sessionUser, isStaffUser),
  };
}
