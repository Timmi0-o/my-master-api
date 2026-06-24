import type { IMasterActorInput } from '../common/i-master-actor.input';

export interface IDeleteMasterServiceImagesApplicationInput {
  masterServiceId: string;
  fileIds: string[];
  actor: IMasterActorInput;
}
