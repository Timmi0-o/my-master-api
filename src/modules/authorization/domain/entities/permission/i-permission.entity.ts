import type { EPermissionCategory } from './permission.enum';

export interface IPermissionEntity {
  id: string;
  name: string;
  description: string | null;
  category: EPermissionCategory;
  createdAt: Date;
  updatedAt: Date;
}

export type IPermissionPublicEntity = IPermissionEntity;
