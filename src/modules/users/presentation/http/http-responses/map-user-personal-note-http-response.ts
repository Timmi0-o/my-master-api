import { mapEntityHttpResponse } from 'src/modules/shared/presentation/http/http-responses/map-entity-http-response';
import type { IUserPersonalNotePublicEntity } from 'src/modules/users/domain/entities/user-personal-note';

export function mapUserPersonalNoteHttpResponse(
  entity: IUserPersonalNotePublicEntity | null,
) {
  return mapEntityHttpResponse(entity);
}
