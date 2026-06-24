import type { IUpdateFileInput } from 'src/modules/files/domain/entities/file';
import type { IFileActorInput } from '../common/i-file-actor.input';

export interface IUpdateFileApplicationInput {
  fileId: string;
  data: IUpdateFileInput;
  actor: IFileActorInput;
}
