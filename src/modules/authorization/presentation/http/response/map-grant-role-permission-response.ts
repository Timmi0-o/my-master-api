import type { IGrantRolePermissionApplicationOutput } from 'src/modules/authorization/application/dtos/role-permission/grant-role-permission.output';

export type IGrantRolePermissionHttpResponse = ReturnType<
  typeof mapGrantRolePermissionHttpResponse
>;

export function mapGrantRolePermissionHttpResponse(
  output: IGrantRolePermissionApplicationOutput,
) {
  return { data: output };
}
