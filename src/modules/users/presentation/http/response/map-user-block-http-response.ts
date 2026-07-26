import { mapEntityHttpResponse } from 'src/modules/shared/presentation/http/response/map-entity-http-response';
import type { IUserBlockPublicEntity } from 'src/modules/users/domain/entities/user-block';

export function mapUserBlockHttpResponse(entity: IUserBlockPublicEntity) {
  return mapEntityHttpResponse(entity);
}
