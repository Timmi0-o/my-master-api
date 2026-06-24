import type { FindManyParams } from '@shared/domain/query';
import type { IPermissionPublicEntity } from 'src/modules/authorization/domain/entities/permission';

export type IGetPermissionsApplicationInput = FindManyParams<
  IPermissionPublicEntity,
  Record<never, never>
>;

export type IGetPermissionsApplicationOutput = {
  items: IPermissionPublicEntity[];
  total: number;
};
