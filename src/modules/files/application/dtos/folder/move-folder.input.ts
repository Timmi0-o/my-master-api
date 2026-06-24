import type { IFileActorInput } from '../common/i-file-actor.input';

export interface IMoveFolderApplicationInput {
  folderId: string;
  parentId: string;
  actor: IFileActorInput;
}
