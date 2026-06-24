import {
  FileAccessLevel,
  FilePurpose,
  FileStatus,
} from '../../../domain/entities/file';
import type { IFileRepository } from '../../../domain/repositories/file/i-file.repository';
import type { IFileUploaderPort } from '../../ports/i-file-uploader.port';
import type { IPresignedUploadApplicationInput } from '../../dtos/file/presigned-upload.input';
import type { IPresignedUploadApplicationOutput } from '../../dtos/file/presigned-upload.output';

export class PresignedUploadUseCase {
  constructor(
    private readonly fileRepository: IFileRepository,
    private readonly uploader: IFileUploaderPort,
  ) {}

  async execute(
    input: IPresignedUploadApplicationInput,
  ): Promise<IPresignedUploadApplicationOutput> {
    const userId = input.userId ?? input.actor.userId;
    const signedEntries = await Promise.all(
      input.files.map((file) =>
        this.uploader.getPresignedUrl(
          { name: file.name, sha256sum: file.sha256sum },
          { ownerKind: file.ownerKind, ownerId: file.ownerId },
        ),
      ),
    );

    const created = await this.fileRepository.insertMany(
      input.files.map((file, index) => {
        const signed = signedEntries[index];
        return {
          folderId: file.folderId ?? null,
          uploadedBy: file.uploadedBy ?? userId,
          fileName: signed.slug,
          originalName: file.name,
          mimeType: '',
          fileSize: BigInt(0),
          fileUrl: signed.fileUrl,
          checksum: file.sha256sum ?? null,
          status: FileStatus.PENDING,
          fileType: file.fileType,
          ownerType: file.ownerType,
          ownerKind: file.ownerKind,
          ownerId: file.ownerId,
          accessLevel: file.accessLevel,
          purpose: file.purpose ?? FilePurpose.OTHER,
          metadata: null,
          tags: file.tags ?? [],
        };
      }),
    );

    return created.map((file, index) => ({
      fileId: file.id,
      name: file.originalName,
      path: file.fileUrl,
      url: signedEntries[index].url,
    }));
  }
}
