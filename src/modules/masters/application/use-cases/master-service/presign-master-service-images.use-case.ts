import type { ITransactionManager } from '@shared/domain/transactions';
import { PresignedUploadUseCase } from 'src/modules/files/application/use-cases/file/presigned-upload.use-case';
import {
  ensureMasterProfileAccessible,
  ensureMasterProfileExists,
} from 'src/modules/masters/domain/entities/master-profile';
import { ensureMasterServiceExists } from 'src/modules/masters/domain/entities/master-service';
import { ensureMasterServiceMaxImagesCount } from 'src/modules/masters/domain/entities/master-service-image';
import type { IMasterProfileRepository } from 'src/modules/masters/domain/repositories/master-profile/i-master-profile.repository';
import type { IMasterServiceImageRepository } from 'src/modules/masters/domain/repositories/master-service-image/i-master-service-image.repository';
import type { IMasterServiceRepository } from 'src/modules/masters/domain/repositories/master-service/i-master-service.repository';
import type { IPresignMasterServiceImagesApplicationInput } from '../../dtos/master-service/presign-master-service-images.input';
import type { IPresignMasterServiceImagesApplicationOutput } from '../../dtos/master-service/presign-master-service-images.output';
import { toPresignedUploadFilesForMasterServiceImages } from '../../mappers/master-service/to-presigned-upload-files-for-master-service-images';

export class PresignMasterServiceImagesUseCase {
  constructor(
    private readonly transactionManager: ITransactionManager,
    private readonly masterServiceRepository: IMasterServiceRepository,
    private readonly masterProfileRepository: IMasterProfileRepository,
    private readonly masterServiceImageRepository: IMasterServiceImageRepository,
    private readonly presignedUploadUseCase: PresignedUploadUseCase,
  ) {}

  async execute(
    input: IPresignMasterServiceImagesApplicationInput,
  ): Promise<IPresignMasterServiceImagesApplicationOutput> {
    if (input.files.length === 0) {
      return [];
    }

    const service = await this.masterServiceRepository.findEntityById(
      input.masterServiceId,
    );
    ensureMasterServiceExists(service, input.masterServiceId);

    const profile = await this.masterProfileRepository.findEntityById(
      service.masterProfileId,
    );
    ensureMasterProfileExists(profile, service.masterProfileId);
    ensureMasterProfileAccessible(profile, input.actor);

    const existingImages =
      await this.masterServiceImageRepository.findByMasterServiceId(
        input.masterServiceId,
      );
    ensureMasterServiceMaxImagesCount(
      existingImages.length,
      input.files.length,
    );

    const presignedFiles = await this.presignedUploadUseCase.execute({
      actor: input.actor,
      userId: input.actor.userId,
      files: toPresignedUploadFilesForMasterServiceImages(
        input.masterServiceId,
        input.actor.userId,
        input.files,
      ),
    });

    const images = await this.transactionManager.runInTransaction((scope) =>
      this.masterServiceImageRepository.createMany(
        presignedFiles.map((file) => ({
          masterServiceId: input.masterServiceId,
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
}
