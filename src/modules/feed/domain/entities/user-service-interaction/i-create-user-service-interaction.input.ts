import type { EUserServiceInteractionType } from './user-service-interaction-type.enum';

export interface ICreateUserServiceInteractionInput {
  userId: string;
  masterServiceId: string;
  type: EUserServiceInteractionType;
}
