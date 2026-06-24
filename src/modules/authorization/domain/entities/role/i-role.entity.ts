import type { ERoleIdentifier } from './role.enum';

export interface IRoleEntity {
  id: string;
  name: string;
  description: string | null;
  roleIdentifier: ERoleIdentifier;
  isActive: boolean;
  isSystem: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type IRolePublicEntity = IRoleEntity;
