import type { FindManyParams } from '@shared/domain/query';
import type { IPermissionPublicEntity } from 'src/modules/authorization/domain/entities/permission';
import type {
  IRolePermissionRelations,
  IRolePermissionPublicEntity,
} from 'src/modules/authorization/domain/entities/role-permission';

export interface IGetRolePermissionsApplicationInput {
  roleId: string;
  params?: FindManyParams<IRolePermissionPublicEntity, IRolePermissionRelations>;
}

export type IGetRolePermissionsApplicationOutput = {
  items: IPermissionPublicEntity[];
  total: number;
};
