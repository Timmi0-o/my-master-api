import type { EPermissionCategory } from 'src/modules/authorization/domain/entities/permission';

export type PermissionRow = {
  id: string;
  name: string;
  description: string | null;
  category: EPermissionCategory;
  createdAt: Date;
  updatedAt: Date;
};
