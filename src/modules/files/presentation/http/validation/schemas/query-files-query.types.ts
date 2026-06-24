import type { FilePurpose } from 'src/modules/files/domain/entities/file';

export interface IQueryFilesQueryPayload {
  ownerKind?: string;
  ownerId?: string;
  purpose?: FilePurpose;
  take?: number;
  skip?: number;
}
