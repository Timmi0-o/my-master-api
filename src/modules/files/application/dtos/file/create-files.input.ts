import type { ICreateFileInput } from 'src/modules/files/domain/entities/file';
import type { IFileActorInput } from '../common/i-file-actor.input';

export interface ICreateFilesApplicationInput {
  files: ICreateFileInput[];
  actor: IFileActorInput;
}
