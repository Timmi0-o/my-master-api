import type { IGetLocalityBySlugOrIdApplicationOutput } from 'src/modules/geo/application/dtos/locality/get-locality-by-slug-or-id.output';
import { mapEntityHttpResponse } from 'src/modules/shared/presentation/http/http-responses/map-entity-http-response';
import { mapLocalityToHttpResponse } from './map-locality-http-response';

export type IGetLocalityBySlugOrIdHttpResponse = ReturnType<
  typeof mapGetLocalityBySlugOrIdHttpResponse
>;

export function mapGetLocalityBySlugOrIdHttpResponse(
  output: IGetLocalityBySlugOrIdApplicationOutput,
) {
  return mapEntityHttpResponse(mapLocalityToHttpResponse(output));
}
