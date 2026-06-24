import type { IRevokeRolePermissionApplicationInput } from 'src/modules/authorization/application/dtos/role-permission/revoke-role-permission.output';

export function paramsToRevokeRolePermissionInput(
  roleId: string,
  permissionId: string,
): IRevokeRolePermissionApplicationInput {
  return { roleId, permissionId };
}
