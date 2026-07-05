import type { ERoleIdentifier } from '@modules/authorization/domain/entities/role';

export interface IGetMetadata {
  /** @deprecated Prefer `@Authorize` permissions and domain policies `ensure*Accessible`. */
  isStaffUser: boolean;
  roleIdentifier: ERoleIdentifier;
  permissions: readonly string[];
}
