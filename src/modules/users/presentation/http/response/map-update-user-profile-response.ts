import { mapEntityHttpResponse } from 'src/modules/shared/presentation/http/response/map-entity-http-response';
import type { IUserProfilePublicEntity } from 'src/modules/users/domain/entities/user-profile';

export type IUpdateUserProfileHttpResponse = ReturnType<typeof mapUpdateUserProfileHttpResponse>;

export function mapUpdateUserProfileHttpResponse(output: IUserProfilePublicEntity) {
  return mapEntityHttpResponse(output);
}
