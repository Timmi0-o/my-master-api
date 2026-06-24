import type { FilePurpose } from 'src/modules/files/domain/entities/file';

export interface IUpdateFolderPayload {
  name?: string;
  allowedPurposes?: FilePurpose[];
}
