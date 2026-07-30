import type { ICreateFavoriteMasterServiceApplicationOutput } from 'src/modules/masters/application/dtos/favorite-master-service/create-favorite-master-service.output';
import { mapFavoriteMasterServiceHttpResponse } from './map-favorite-master-service-http-response';

export function mapCreateFavoriteMasterServiceHttpResponse(
  output: ICreateFavoriteMasterServiceApplicationOutput,
) {
  return mapFavoriteMasterServiceHttpResponse(output);
}
