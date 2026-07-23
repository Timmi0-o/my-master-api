import type { IGetFavoriteMasterServiceByIdApplicationOutput } from 'src/modules/masters/application/dtos/favorite-master-service/get-favorite-master-service-by-id.output';
import { mapFavoriteMasterServiceHttpResponse } from './map-favorite-master-service-http-response';

export function mapGetFavoriteMasterServiceByIdHttpResponse(
  output: IGetFavoriteMasterServiceByIdApplicationOutput,
) {
  return mapFavoriteMasterServiceHttpResponse(output);
}
