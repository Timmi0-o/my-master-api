import { mapDeleteSuccessHttpResponse } from 'src/modules/shared/presentation/http/response/map-delete-success-http-response';

export type IDeleteMasterServiceHttpResponse = ReturnType<typeof mapDeleteMasterServiceHttpResponse>;

export function mapDeleteMasterServiceHttpResponse() {
  return mapDeleteSuccessHttpResponse();
}
