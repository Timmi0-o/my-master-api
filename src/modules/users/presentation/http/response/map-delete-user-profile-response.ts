import { mapDeleteSuccessHttpResponse } from 'src/modules/shared/presentation/http/response/map-delete-success-http-response';

export type IDeleteUserProfileHttpResponse = ReturnType<typeof mapDeleteUserProfileHttpResponse>;

export function mapDeleteUserProfileHttpResponse() {
  return mapDeleteSuccessHttpResponse();
}
