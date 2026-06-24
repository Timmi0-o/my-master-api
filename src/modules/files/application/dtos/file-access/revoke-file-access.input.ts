import type { IFileActorInput } from '../common/i-file-actor.input';

export interface IRevokeFileAccessApplicationInput {
  fileId: string;
  accessId: string;
  actor: IFileActorInput;
}
