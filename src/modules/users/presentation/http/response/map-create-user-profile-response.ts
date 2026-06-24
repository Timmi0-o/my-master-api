import { mapEntityHttpResponse } from 'src/modules/shared/presentation/http/response/map-entity-http-response';
import type { IUserProfilePublicEntity } from 'src/modules/users/domain/entities/user-profile';

export type ICreateUserProfileHttpResponse = ReturnType<typeof mapCreateUserProfileHttpResponse>;

export function mapCreateUserProfileHttpResponse(output: IUserProfilePublicEntity) {
  return mapEntityHttpResponse(output);
}
