import type { IFilePublicEntity } from 'src/modules/files/domain/entities/file';
import type { FindManyParams } from 'src/modules/shared/domain/query';
import type { IFileActorInput } from '../common/i-file-actor.input';

export interface IQueryFilesApplicationInput {
  actor: IFileActorInput;
  params: FindManyParams<IFilePublicEntity, Record<never, never>>;
}
