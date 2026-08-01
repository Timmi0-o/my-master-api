import type { IAddressPublicEntity } from 'src/modules/geo/domain/entities/address';
import { mapEntityHttpResponse } from 'src/modules/shared/presentation/http/http-responses/map-entity-http-response';

export type IUpsertMasterAddressHttpResponse = ReturnType<
  typeof mapUpsertMasterAddressHttpResponse
>;

export function mapUpsertMasterAddressHttpResponse(
  address: IAddressPublicEntity,
) {
  return mapEntityHttpResponse(address);
}
