import type { ITransactionManager } from '@shared/domain/transactions';
import { PresignedUploadUseCase } from 'src/modules/files/application/use-cases/file/presigned-upload.use-case';
import {
  ensureImageMaxCount,
  ImageEntityType,
} from 'src/modules/masters/domain/entities/image';
import {
  ensureMasterProfileAccessible,
  ensureMasterProfileExists,
} from 'src/modules/masters/domain/entities/master-profile';
import { ensureMasterServiceExists } from 'src/modules/masters/domain/entities/master-service';
import type { IImageRepository } from 'src/modules/masters/domain/repositories/image/i-image.repository';
import type { IMasterProfileRepository } from 'src/modules/masters/domain/repositories/master-profile/i-master-profile.repository';
import type { IMasterServiceRepository } from 'src/modules/masters/domain/repositories/master-service/i-master-service.repository';
import type { IPresignImagesApplicationInput } from '../../dtos/image/presign-images.input';
import type { IPresignImagesApplicationOutput } from '../../dtos/image/presign-images.output';
import { toPresignedUploadFilesForEntityImages } from '../../mappers/image/to-presigned-upload-files-for-entity-images';

export class PresignImagesUseCase {
  constructor(
    private readonly transactionManager: ITransactionManager,
    private readonly masterServiceRepository: IMasterServiceRepository,
    private readonly masterProfileRepository: IMasterProfileRepository,
    private readonly imageRepository: IImageRepository,
    private readonly presignedUploadUseCase: PresignedUploadUseCase,
  ) {}

  async execute(
    input: IPresignImagesApplicationInput,
  ): Promise<IPresignImagesApplicationOutput> {
    if (input.files.length === 0) {
      return [];
    }

    await this.ensureEntityAccessible(input);

    const existingImages = await this.imageRepository.findByEntity(
      input.entityType,
      input.entityId,
    );
    ensureImageMaxCount(
      input.entityType,
      existingImages.length,
      input.files.length,
    );

    const presignedFiles = await this.presignedUploadUseCase.execute({
      actor: input.actor,
      userId: input.actor.userId,
      files: toPresignedUploadFilesForEntityImages(
        input.entityType,
        input.entityId,
        input.actor.userId,
        input.files,
      ),
    });

    const images = await this.transactionManager.runInTransaction((scope) =>
      this.imageRepository.createMany(
        presignedFiles.map((file) => ({
          entityType: input.entityType,
          entityId: input.entityId,
          fileId: file.fileId,
        })),
        scope,
      ),
    );

    return presignedFiles.map((file, index) => ({
      imageId: images[index].id,
      fileId: file.fileId,
      name: file.name,
      path: file.path,
      url: file.url,
    }));
  }

  private async ensureEntityAccessible(
    input: IPresignImagesApplicationInput,
  ): Promise<void> {
    if (input.entityType === ImageEntityType.MASTER_SERVICE) {
      const service = await this.masterServiceRepository.findEntityById(
        input.entityId,
      );
      ensureMasterServiceExists(service, input.entityId);

      const profile = await this.masterProfileRepository.findEntityById(
        service.masterProfileId,
      );
      ensureMasterProfileExists(profile, service.masterProfileId);
      ensureMasterProfileAccessible(profile, input.actor);
      return;
    }

    if (input.entityType === ImageEntityType.MASTER_PROFILE_AVATAR) {
      const profile = await this.masterProfileRepository.findEntityById(
        input.entityId,
      );
      ensureMasterProfileExists(profile, input.entityId);
      ensureMasterProfileAccessible(profile, input.actor);
    }
  }
}
