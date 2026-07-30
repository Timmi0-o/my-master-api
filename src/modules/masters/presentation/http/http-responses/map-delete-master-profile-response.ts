import { mapDeleteSuccessHttpResponse } from 'src/modules/shared/presentation/http/http-responses/map-delete-success-http-response';

export type IDeleteMasterProfileHttpResponse = ReturnType<typeof mapDeleteMasterProfileHttpResponse>;

export function mapDeleteMasterProfileHttpResponse() {
  return mapDeleteSuccessHttpResponse();
}
