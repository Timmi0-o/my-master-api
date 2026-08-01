import type { TransactionScope } from '@shared/domain/transactions';
import type { EAddressEntityType } from '../../entities/address/address.enums';
import type { IAddressPublicEntity } from '../../entities/address/i-address.entity';
import type { IUpsertAddressInput } from '../../entities/address/i-upsert-address.input';

export interface IAddressRepository {
  findByEntity(
    entityType: EAddressEntityType,
    entityId: string,
  ): Promise<IAddressPublicEntity | null>;

  replaceByEntity(
    input: IUpsertAddressInput,
    scope?: TransactionScope,
  ): Promise<IAddressPublicEntity>;

  deleteByEntity(
    entityType: EAddressEntityType,
    entityId: string,
    scope?: TransactionScope,
  ): Promise<void>;

  findEntityIdsByLocalityId(
    localityId: string,
    entityType: EAddressEntityType,
  ): Promise<string[]>;
}
