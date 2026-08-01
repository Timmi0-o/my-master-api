import type { IGetStreetsApplicationOutput } from 'src/modules/geo/application/dtos/street/get-streets.output';
import { mapEntityHttpResponse } from 'src/modules/shared/presentation/http/http-responses/map-entity-http-response';
import { mapStreetsToHttpResponse } from './map-street-http-response';

export type IGetStreetsHttpResponse = ReturnType<typeof mapGetStreetsHttpResponse>;

export function mapGetStreetsHttpResponse(output: IGetStreetsApplicationOutput) {
  return mapEntityHttpResponse(mapStreetsToHttpResponse(output.items));
}
