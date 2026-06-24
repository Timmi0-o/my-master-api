import type { ERoleIdentifier } from 'src/modules/authorization/domain/entities/role';

export type RoleRow = {
  id: string;
  name: string;
  description: string | null;
  roleIdentifier: ERoleIdentifier;
  isActive: boolean;
  isSystem: boolean;
  createdAt: Date;
  updatedAt: Date;
};
