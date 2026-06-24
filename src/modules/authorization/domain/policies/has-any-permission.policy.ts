export function hasAnyPermission(
  grantedPermissions: readonly string[],
  requiredPermissions: readonly string[],
): boolean {
  if (requiredPermissions.length === 0) {
    return true;
  }

  const granted = new Set(grantedPermissions);
  return requiredPermissions.some((permission) => granted.has(permission));
}
