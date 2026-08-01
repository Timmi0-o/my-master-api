import type { IStreetPublicEntity } from 'src/modules/geo/domain/entities/street/i-street.entity';

export type IStreetHttpResponse = IStreetPublicEntity;

export function mapStreetToHttpResponse(
  entity: IStreetPublicEntity,
): IStreetHttpResponse {
  return entity;
}

export function mapStreetsToHttpResponse(
  entities: IStreetPublicEntity[],
): IStreetHttpResponse[] {
  return entities.map(mapStreetToHttpResponse);
}
