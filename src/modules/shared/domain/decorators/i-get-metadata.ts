import type { ERoleIdentifier } from 'src/modules/authorization/domain/entities/role';

export interface IGetMetadata {
  isStaffUser: boolean;
  roleIdentifier: ERoleIdentifier;
  permissions: readonly string[];
}
