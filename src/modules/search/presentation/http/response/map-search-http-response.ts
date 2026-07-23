import type { ISearchByTextApplicationOutput } from 'src/modules/search/application/dtos/search-by-text.dto';
import { mapMasterProfilesToHttpResponse } from 'src/modules/masters/presentation/http/response/map-master-profile-http-response';
import { mapMasterServicesToHttpResponse } from 'src/modules/masters/presentation/http/response/map-master-service-http-response';

export type ISearchHttpResponse = ReturnType<typeof mapSearchHttpResponse>;

export function mapSearchHttpResponse(output: ISearchByTextApplicationOutput) {
  return {
    masters: mapMasterProfilesToHttpResponse(output.masters),
    services: mapMasterServicesToHttpResponse(output.services),
  };
}
