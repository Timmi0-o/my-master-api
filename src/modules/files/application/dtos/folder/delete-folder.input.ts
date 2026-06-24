import type { IFileActorInput } from '../common/i-file-actor.input';

export interface IDeleteFolderApplicationInput {
  folderId: string;
  actor: IFileActorInput;
}
