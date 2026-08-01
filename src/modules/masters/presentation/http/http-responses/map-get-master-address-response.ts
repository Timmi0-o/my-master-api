import type { IAddressPublicEntity } from 'src/modules/geo/domain/entities/address';
import { mapEntityHttpResponse } from 'src/modules/shared/presentation/http/http-responses/map-entity-http-response';

export type IGetMasterAddressHttpResponse = ReturnType<
  typeof mapGetMasterAddressHttpResponse
>;

export function mapGetMasterAddressHttpResponse(
  address: IAddressPublicEntity | null,
) {
  return mapEntityHttpResponse(address);
}
