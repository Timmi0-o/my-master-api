import type { IFolderEntity } from 'src/modules/files/domain/entities/folder';
import type { IFileActorInput } from '../common/i-file-actor.input';

export interface IGetFolderApplicationInput {
  ownerKind: string;
  ownerId: string;
  path: string;
  actor: IFileActorInput;
}
