import type { IReadRepository } from '@shared/domain/repositories';
import type { TransactionScope } from '@shared/domain/transactions';
import type { IRoleEntity, IRolePublicEntity } from '../../entities/role';

export type IRoleRepository = IReadRepository<
  IRolePublicEntity,
  string,
  Record<never, never>
> & {
  findEntityById(
    roleId: string,
    scope?: TransactionScope,
  ): Promise<IRoleEntity | null>;
};
