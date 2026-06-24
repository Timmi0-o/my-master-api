import type { IFilePublicEntity } from 'src/modules/files/domain/entities/file';
import type { FindOneParams } from 'src/modules/shared/domain/query';
import type { IFileActorInput } from '../common/i-file-actor.input';

export interface IGetFileApplicationInput {
  fileId: string;
  actor: IFileActorInput;
  params?: FindOneParams<IFilePublicEntity, Record<never, never>>;
}
