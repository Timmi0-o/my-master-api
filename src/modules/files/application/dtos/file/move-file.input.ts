import type { IFileActorInput } from '../common/i-file-actor.input';

export interface IMoveFileApplicationInput {
  fileId: string;
  folderId: string | null;
  actor: IFileActorInput;
}
