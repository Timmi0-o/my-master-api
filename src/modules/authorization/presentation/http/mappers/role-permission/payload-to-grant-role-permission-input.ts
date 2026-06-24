import type { IGrantRolePermissionApplicationInput } from 'src/modules/authorization/application/dtos/role-permission/grant-role-permission.output';
import type { IGrantRolePermissionPayload } from '../../validation/schemas/grant-role-permission-payload.types';

export function payloadToGrantRolePermissionInput(
  roleId: string,
  payload: IGrantRolePermissionPayload,
): IGrantRolePermissionApplicationInput {
  return {
    roleId,
    permissionId: payload.permissionId,
  };
}
