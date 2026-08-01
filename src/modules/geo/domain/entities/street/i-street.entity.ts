export interface IStreetEntity {
  id: string;
  slug: string;
  name: string;
  localityId: string | null;
  descriptions: string | null;
}

export type IStreetPublicEntity = IStreetEntity;
