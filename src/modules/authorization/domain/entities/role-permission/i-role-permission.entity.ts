export interface IRolePermissionEntity {
  id: string;
  roleId: string;
  permissionId: string;
  createdAt: Date;
  updatedAt: Date;
}

export type IRolePermissionPublicEntity = IRolePermissionEntity;

export interface IGrantRolePermissionInput {
  roleId: string;
  permissionId: string;
}
