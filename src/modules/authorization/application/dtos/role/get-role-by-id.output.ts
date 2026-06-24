import type { FindOneParams } from '@shared/domain/query';
import type { IRolePublicEntity } from 'src/modules/authorization/domain/entities/role';

export interface IGetRoleByIdApplicationInput {
  roleId: string;
  params?: FindOneParams<IRolePublicEntity, Record<never, never>>;
}

export type IGetRoleByIdApplicationOutput = IRolePublicEntity;
