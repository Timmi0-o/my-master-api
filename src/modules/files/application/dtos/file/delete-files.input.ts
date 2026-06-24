import type { IFileActorInput } from '../common/i-file-actor.input';

export interface IDeleteFilesApplicationInput {
  fileIds: string[];
  actor: IFileActorInput;
}
