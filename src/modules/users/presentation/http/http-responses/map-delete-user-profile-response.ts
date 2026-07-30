import { mapDeleteSuccessHttpResponse } from 'src/modules/shared/presentation/http/http-responses/map-delete-success-http-response';

export type IDeleteUserProfileHttpResponse = ReturnType<typeof mapDeleteUserProfileHttpResponse>;

export function mapDeleteUserProfileHttpResponse() {
  return mapDeleteSuccessHttpResponse();
}
