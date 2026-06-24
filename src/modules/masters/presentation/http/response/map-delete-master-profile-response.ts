import { mapDeleteSuccessHttpResponse } from 'src/modules/shared/presentation/http/response/map-delete-success-http-response';

export type IDeleteMasterProfileHttpResponse = ReturnType<typeof mapDeleteMasterProfileHttpResponse>;

export function mapDeleteMasterProfileHttpResponse() {
  return mapDeleteSuccessHttpResponse();
}
