import type { ITransactionManager } from '@shared/domain/transactions';
import { PresignedUploadUseCase } from 'src/modules/files/application/use-cases/file/presigned-upload.use-case';
import {
  ensureBugReportExists,
} from 'src/modules/bug-reports/domain/entities/bug-report';
import type { IBugReportRepository } from 'src/modules/bug-reports/domain/repositories/bug-report';
import {
  ensureImageMaxCount,
  ImageEntityType,
} from 'src/modules/masters/domain/entities/image';
import { toPresignedUploadFilesForEntityImages } from 'src/modules/masters/application/mappers/image/to-presigned-upload-files-for-entity-images';
import type { IImageRepository } from 'src/modules/masters/domain/repositories/image/i-image.repository';
import type { IPresignBugReportImagesApplicationInput } from '../../dtos/bug-report/presign-bug-report-images.input';
import type { IPresignBugReportImagesApplicationOutput } from '../../dtos/bug-report/presign-bug-report-images.output';

export class PresignBugReportImagesUseCase {
  constructor(
    private readonly transactionManager: ITransactionManager,
    private readonly bugReportRepository: IBugReportRepository,
    private readonly imageRepository: IImageRepository,
    private readonly presignedUploadUseCase: PresignedUploadUseCase,
  ) {}

  async execute(
    input: IPresignBugReportImagesApplicationInput,
  ): Promise<IPresignBugReportImagesApplicationOutput> {
    if (input.files.length === 0) {
      return [];
    }

    const bugReport = await this.bugReportRepository.findEntityById(
      input.bugReportId,
    );
    ensureBugReportExists(bugReport, input.bugReportId);

    const existingImages = await this.imageRepository.findByEntity(
      ImageEntityType.BUG_REPORT,
      input.bugReportId,
    );
    ensureImageMaxCount(
      ImageEntityType.BUG_REPORT,
      existingImages.length,
      input.files.length,
    );

    const uploadedBy = bugReport.reporterUserId ?? bugReport.id;

    const presignedFiles = await this.presignedUploadUseCase.execute({
      actor: {
        userId: uploadedBy,
        isStaffUser: false,
      },
      userId: uploadedBy,
      files: toPresignedUploadFilesForEntityImages(
        ImageEntityType.BUG_REPORT,
        input.bugReportId,
        uploadedBy,
        input.files,
      ),
    });

    const images = await this.transactionManager.runInTransaction((scope) =>
      this.imageRepository.createMany(
        presignedFiles.map((file) => ({
          entityType: ImageEntityType.BUG_REPORT,
          entityId: input.bugReportId,
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
