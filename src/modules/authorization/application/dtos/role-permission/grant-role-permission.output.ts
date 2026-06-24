export interface IGrantRolePermissionApplicationInput {
  roleId: string;
  permissionId: string;
}

export type IGrantRolePermissionApplicationOutput = {
  id: string;
  roleId: string;
  permissionId: string;
  createdAt: Date;
  updatedAt: Date;
};
