import { mapEntityHttpResponse } from 'src/modules/shared/presentation/http/response/map-entity-http-response';
import type { IUserPersonalNotePublicEntity } from 'src/modules/users/domain/entities/user-personal-note';

export function mapGetUserPersonalNoteByReferenceHttpResponse(
  entity: IUserPersonalNotePublicEntity | null,
) {
  return mapEntityHttpResponse({ item: entity });
}
