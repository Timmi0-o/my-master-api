import type { IGetLocalitiesApplicationOutput } from 'src/modules/geo/application/dtos/locality/get-localities.output';
import { mapEntityHttpResponse } from 'src/modules/shared/presentation/http/http-responses/map-entity-http-response';
import { mapLocalitiesToHttpResponse } from './map-locality-http-response';

export type IGetLocalitiesHttpResponse = ReturnType<
  typeof mapGetLocalitiesHttpResponse
>;

export function mapGetLocalitiesHttpResponse(
  output: IGetLocalitiesApplicationOutput,
) {
  return mapEntityHttpResponse(mapLocalitiesToHttpResponse(output.items));
}
