import { mapEntityHttpResponse } from 'src/modules/shared/presentation/http/response/map-entity-http-response';
import type { IUserProfilePublicEntity } from 'src/modules/users/domain/entities/user-profile';

export type IGetUserProfileByIdHttpResponse = ReturnType<
  typeof mapGetUserProfileByIdHttpResponse
>;

export function mapGetUserProfileByIdHttpResponse(
  output: IUserProfilePublicEntity,
) {
  return mapEntityHttpResponse(output);
}
