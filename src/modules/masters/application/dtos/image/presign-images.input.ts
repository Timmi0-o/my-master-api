import type { IMasterActorInput } from '../common/i-master-actor.input';
import type { ImageEntityType } from 'src/modules/masters/domain/entities/image';

export interface IPresignImageFileInput {
  name: string;
  sha256sum: string;
}

export interface IPresignImagesApplicationInput {
  entityType: ImageEntityType;
  entityId: string;
  files: IPresignImageFileInput[];
  actor: IMasterActorInput;
}
