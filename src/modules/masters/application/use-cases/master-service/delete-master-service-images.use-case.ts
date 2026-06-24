import { DeleteFilesUseCase } from 'src/modules/files/application/use-cases/file/delete-files.use-case';
import { MasterServiceImageNotFoundError } from 'src/modules/masters/domain/entities/master-service-image';
import {
  ensureMasterProfileAccessible,
  ensureMasterProfileExists,
} from 'src/modules/masters/domain/entities/master-profile';
import { ensureMasterServiceExists } from 'src/modules/masters/domain/entities/master-service';
import type { IMasterProfileRepository } from 'src/modules/masters/domain/repositories/master-profile/i-master-profile.repository';
import type { IMasterServiceImageRepository } from 'src/modules/masters/domain/repositories/master-service-image/i-master-service-image.repository';
import type { IMasterServiceRepository } from 'src/modules/masters/domain/repositories/master-service/i-master-service.repository';
import type { ITransactionManager } from '@shared/domain/transactions';
import type { IDeleteMasterServiceImagesApplicationInput } from '../../dtos/master-service/delete-master-service-images.input';
import type { IDeleteMasterServiceImagesApplicationOutput } from '../../dtos/master-service/delete-master-service-images.output';

export class DeleteMasterServiceImagesUseCase {
  constructor(
    private readonly transactionManager: ITransactionManager,
    private readonly masterServiceRepository: IMasterServiceRepository,
    private readonly masterProfileRepository: IMasterProfileRepository,
    private readonly masterServiceImageRepository: IMasterServiceImageRepository,
    private readonly deleteFilesUseCase: DeleteFilesUseCase,
  ) {}

  async execute(
    input: IDeleteMasterServiceImagesApplicationInput,
  ): Promise<IDeleteMasterServiceImagesApplicationOutput> {
    if (input.fileIds.length === 0) {
      return { deletedCount: 0 };
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

    const images =
      await this.masterServiceImageRepository.findByMasterServiceIdAndFileIds(
        input.masterServiceId,
        input.fileIds,
      );

    const foundFileIds = new Set(images.map((image) => image.fileId));
    const missingFileId = input.fileIds.find(
      (fileId) => !foundFileIds.has(fileId),
    );

    if (missingFileId != null) {
      throw new MasterServiceImageNotFoundError(
        missingFileId,
        input.masterServiceId,
      );
    }

    const deletedCount = await this.transactionManager.runInTransaction(
      (scope) =>
        this.masterServiceImageRepository.deleteByMasterServiceIdAndFileIds(
          input.masterServiceId,
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
}
