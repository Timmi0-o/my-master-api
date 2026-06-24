import type { IFileActorInput } from '../common/i-file-actor.input';

export interface ICreateRootFolderApplicationInput {
  ownerKind: string;
  ownerId: string;
  actor: IFileActorInput;
}
