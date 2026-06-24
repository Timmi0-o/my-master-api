import type { FilePurpose } from 'src/modules/files/domain/entities/file';
import type { IFileActorInput } from '../common/i-file-actor.input';

export interface IUpdateFolderApplicationInput {
  folderId: string;
  name?: string;
  allowedPurposes?: FilePurpose[];
  actor: IFileActorInput;
}
