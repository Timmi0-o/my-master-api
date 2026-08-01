import type { IGetApartmentsApplicationOutput } from 'src/modules/geo/application/dtos/apartment/get-apartments.output';
import { mapEntityHttpResponse } from 'src/modules/shared/presentation/http/http-responses/map-entity-http-response';
import { mapApartmentsToHttpResponse } from './map-apartment-http-response';

export type IGetApartmentsHttpResponse = ReturnType<
  typeof mapGetApartmentsHttpResponse
>;

export function mapGetApartmentsHttpResponse(
  output: IGetApartmentsApplicationOutput,
) {
  return mapEntityHttpResponse(mapApartmentsToHttpResponse(output.items));
}
