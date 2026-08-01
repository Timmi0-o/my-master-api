import type { IGetBuildingsApplicationOutput } from 'src/modules/geo/application/dtos/building/get-buildings.output';
import { mapEntityHttpResponse } from 'src/modules/shared/presentation/http/http-responses/map-entity-http-response';
import { mapBuildingsToHttpResponse } from './map-building-http-response';

export type IGetBuildingsHttpResponse = ReturnType<
  typeof mapGetBuildingsHttpResponse
>;

export function mapGetBuildingsHttpResponse(
  output: IGetBuildingsApplicationOutput,
) {
  return mapEntityHttpResponse(mapBuildingsToHttpResponse(output.items));
}
