import type { IAddressPublicEntity } from 'src/modules/geo/domain/entities/address';
import { mapEntityHttpResponse } from 'src/modules/shared/presentation/http/http-responses/map-entity-http-response';

export type IUpsertUserProfileAddressHttpResponse = ReturnType<
  typeof mapUpsertUserProfileAddressHttpResponse
>;

export function mapUpsertUserProfileAddressHttpResponse(
  address: IAddressPublicEntity,
) {
  return mapEntityHttpResponse(address);
}
