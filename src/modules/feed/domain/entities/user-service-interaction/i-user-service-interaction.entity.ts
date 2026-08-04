import type { EUserServiceInteractionType } from './user-service-interaction-type.enum';

export interface IUserServiceInteractionEntity {
  id: string;
  userId: string;
  masterServiceId: string;
  type: EUserServiceInteractionType;
  createdAt: Date;
}

export type IUserServiceInteractionPublicEntity = IUserServiceInteractionEntity;
