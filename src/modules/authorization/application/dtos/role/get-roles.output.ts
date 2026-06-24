import type { FindManyParams } from '@shared/domain/query';
import type { IRolePublicEntity } from 'src/modules/authorization/domain/entities/role';

export type IGetRolesApplicationInput = FindManyParams<
  IRolePublicEntity,
  Record<never, never>
>;

export type IGetRolesApplicationOutput = {
  items: IRolePublicEntity[];
  total: number;
};
