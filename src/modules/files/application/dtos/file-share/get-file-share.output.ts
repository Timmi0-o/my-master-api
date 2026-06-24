import type { IFilePublicEntity } from 'src/modules/files/domain/entities/file';
import type { IFileShareEntity } from 'src/modules/files/domain/entities/file-share/i-file-share.entity';

export interface IGetFileShareApplicationOutput {
  share: IFileShareEntity;
  file: IFilePublicEntity;
}
