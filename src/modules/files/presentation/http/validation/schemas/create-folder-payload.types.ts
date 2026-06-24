import type { FilePurpose } from 'src/modules/files/domain/entities/file';

export interface ICreateFolderPayload {
  ownerKind: string;
  ownerId: string;
  name: string;
  parentId?: string | null;
  allowedPurposes?: FilePurpose[];
}
