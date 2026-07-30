import { mapDeleteSuccessHttpResponse } from 'src/modules/shared/presentation/http/http-responses/map-delete-success-http-response';

export type IDeleteMasterServiceHttpResponse = ReturnType<typeof mapDeleteMasterServiceHttpResponse>;

export function mapDeleteMasterServiceHttpResponse() {
  return mapDeleteSuccessHttpResponse();
}
