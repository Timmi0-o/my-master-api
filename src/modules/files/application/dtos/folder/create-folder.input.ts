import type { FilePurpose } from 'src/modules/files/domain/entities/file';
import type { IFileActorInput } from '../common/i-file-actor.input';

export interface ICreateFolderApplicationInput {
  ownerKind: string;
  ownerId: string;
  name: string;
  parentId?: string | null;
  allowedPurposes?: FilePurpose[];
  actor: IFileActorInput;
}
