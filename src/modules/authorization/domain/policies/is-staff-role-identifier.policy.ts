import { ERoleIdentifier } from '../entities/role';

const STAFF_ROLE_IDENTIFIERS = new Set<ERoleIdentifier>([
  ERoleIdentifier.ADMIN,
  ERoleIdentifier.SUPER_ADMIN,
]);

export function isStaffRoleIdentifier(roleIdentifier: ERoleIdentifier): boolean {
  return STAFF_ROLE_IDENTIFIERS.has(roleIdentifier);
}
