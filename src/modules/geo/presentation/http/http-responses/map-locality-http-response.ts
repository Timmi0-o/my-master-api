import type { ILocalityPublicEntity } from 'src/modules/geo/domain/entities/locality/i-locality.entity';

export type ILocalityHttpResponse = ILocalityPublicEntity;

export function mapLocalityToHttpResponse(
  entity: ILocalityPublicEntity,
): ILocalityHttpResponse {
  return entity;
}

export function mapLocalitiesToHttpResponse(
  entities: ILocalityPublicEntity[],
): ILocalityHttpResponse[] {
  return entities.map(mapLocalityToHttpResponse);
}
