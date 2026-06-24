import type { IFileActorInput } from '../common/i-file-actor.input';

export interface IRevokeFileShareApplicationInput {
  shareId: string;
  actor: IFileActorInput;
}
