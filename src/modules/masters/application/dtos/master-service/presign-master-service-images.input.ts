import type { IMasterActorInput } from '../common/i-master-actor.input';

export interface IPresignMasterServiceImageFileInput {
  name: string;
  sha256sum: string;
}

export interface IPresignMasterServiceImagesApplicationInput {
  masterServiceId: string;
  files: IPresignMasterServiceImageFileInput[];
  actor: IMasterActorInput;
}
