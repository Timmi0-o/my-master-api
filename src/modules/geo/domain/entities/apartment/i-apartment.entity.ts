export interface IApartmentEntity {
  id: string;
  name: string;
  number: string | null;
  buildingId: string;
}

export type IApartmentPublicEntity = IApartmentEntity;
