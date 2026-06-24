export type {
  IGrantRolePermissionInput,
  IRolePermissionEntity,
  IRolePermissionPublicEntity,
} from './i-role-permission.entity';
export type { IRolePermissionRelations } from './role-permission-select-fields';
export { ROLE_PERMISSION_SELECT_FIELDS } from './role-permission-select-fields';
export {
  RolePermissionAlreadyExistsError,
  RolePermissionNotFoundError,
} from './errors/role-permission.errors';
