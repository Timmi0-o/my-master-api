export interface ILocalityEntity {
  id: string;
  slug: string;
  name: string;
  type: string;
  main: boolean;
  countryId: string;
  regionId: string;
  descriptions: string | null;
}

export type ILocalityPublicEntity = ILocalityEntity;
