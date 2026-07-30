export type IRevokeRolePermissionHttpResponse = ReturnType<
  typeof mapRevokeRolePermissionHttpResponse
>;

export function mapRevokeRolePermissionHttpResponse() {
  return { data: { success: true as const } };
}
