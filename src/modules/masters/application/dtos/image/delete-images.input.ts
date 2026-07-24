import type { IMasterActorInput } from '../common/i-master-actor.input';
import type { ImageEntityType } from 'src/modules/masters/domain/entities/image';

export interface IDeleteImagesApplicationInput {
  entityType: ImageEntityType;
  entityId: string;
  fileIds: string[];
  actor: IMasterActorInput;
}
