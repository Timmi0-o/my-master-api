import type { IFileActorInput } from '../common/i-file-actor.input';

export interface IGetFilesByIdsApplicationInput {
  fileIds: string[];
  actor: IFileActorInput;
}
