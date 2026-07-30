import type { IUserActorInput } from '../common/i-user-actor.input';

export interface IGetUserPersonalNoteByReferenceApplicationInput {
  referenceUserId: string;
  actor: IUserActorInput;
}
