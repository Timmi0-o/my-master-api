import { DeleteFilesUseCase } from 'src/modules/files/application/use-cases/file/delete-files.use-case';
import {
  ImageEntityType,
  ImageNotFoundError,
} from 'src/modules/masters/domain/entities/image';
import {
  ensureMasterProfileAccessible,
  ensureMasterProfileExists,
} from 'src/modules/masters/domain/entities/master-profile';
import { ensureMasterServiceExists } from 'src/modules/masters/domain/entities/master-service';
import type { IImageRepository } from 'src/modules/masters/domain/repositories/image/i-image.repository';
import type { IMasterProfileRepository } from 'src/modules/masters/domain/repositories/master-profile/i-master-profile.repository';
import type { IMasterServiceRepository } from 'src/modules/masters/domain/repositories/master-service/i-master-service.repository';
import type { ITransactionManager } from '@shared/domain/transactions';
import type { IDeleteImagesApplicationInput } from '../../dtos/image/delete-images.input';
import type { IDeleteImagesApplicationOutput } from '../../dtos/image/delete-images.output';

export class DeleteImagesUseCase {
  constructor(
    private readonly transactionManager: ITransactionManager,
    private readonly masterServiceRepository: IMasterServiceRepository,
    private readonly masterProfileRepository: IMasterProfileRepository,
    private readonly imageRepository: IImageRepository,
    private readonly deleteFilesUseCase: DeleteFilesUseCase,
  ) {}

  async execute(
    input: IDeleteImagesApplicationInput,
  ): Promise<IDeleteImagesApplicationOutput> {
    if (input.fileIds.length === 0) {
      return { deletedCount: 0 };
    }

    await this.ensureEntityAccessible(input);

    const images = await this.imageRepository.findByEntityAndFileIds(
      input.entityType,
      input.entityId,
      input.fileIds,
    );

    const foundFileIds = new Set(images.map((image) => image.fileId));
    const missingFileId = input.fileIds.find(
      (fileId) => !foundFileIds.has(fileId),
    );

    if (missingFileId != null) {
      throw new ImageNotFoundError(
        missingFileId,
        input.entityType,
        input.entityId,
      );
    }

    const deletedCount = await this.transactionManager.runInTransaction(
      (scope) =>
        this.imageRepository.deleteByEntityAndFileIds(
          input.entityType,
          input.entityId,
          input.fileIds,
          scope,
        ),
    );

    await this.deleteFilesUseCase.execute({
      fileIds: input.fileIds,
      actor: input.actor,
    });

    return { deletedCount };
  }

  private async ensureEntityAccessible(
    input: IDeleteImagesApplicationInput,
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
