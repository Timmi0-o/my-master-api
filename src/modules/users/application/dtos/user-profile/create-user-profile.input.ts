import type { IUserActorInput } from '../common/i-user-actor.input';

export interface ICreateUserProfileApplicationInput {
  displayName: string;
  rating: number;
  userId?: string;
  actor: IUserActorInput;
}
