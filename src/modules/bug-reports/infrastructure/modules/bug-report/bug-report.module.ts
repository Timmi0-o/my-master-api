import { Module } from '@nestjs/common';
import { TRANSACTION_MANAGER_TOKEN } from '@shared/domain/transactions';
import type { ITransactionManager } from '@shared/domain/transactions';
import { CreateBugReportUseCase } from 'src/modules/bug-reports/application/use-cases/bug-report/create-bug-report.use-case';
import { PresignBugReportImagesUseCase } from 'src/modules/bug-reports/application/use-cases/bug-report/presign-bug-report-images.use-case';
import {
  BUG_REPORT_REPOSITORY_TOKEN,
  type IBugReportRepository,
} from 'src/modules/bug-reports/domain/repositories/bug-report';
import { PrismaBugReportRepository } from 'src/modules/bug-reports/infrastructure/persistence/repositories/bug-report/prisma-bug-report.repository';
import { PresignedUploadUseCase } from 'src/modules/files/application/use-cases/file/presigned-upload.use-case';
import { FilesModule } from 'src/modules/files/files.module';
import { IMAGE_REPOSITORY_TOKEN } from 'src/modules/masters/domain/repositories/image/image.repository.tokens';
import type { IImageRepository } from 'src/modules/masters/domain/repositories/image/i-image.repository';
import { ImageModule } from 'src/modules/masters/infrastructure/modules/image/image.module';

@Module({
  imports: [FilesModule, ImageModule],
  providers: [
    {
      provide: BUG_REPORT_REPOSITORY_TOKEN,
      useClass: PrismaBugReportRepository,
    },
    {
      provide: CreateBugReportUseCase,
      useFactory: (
        transactionManager: ITransactionManager,
        bugReportRepo: IBugReportRepository,
      ) => new CreateBugReportUseCase(transactionManager, bugReportRepo),
      inject: [TRANSACTION_MANAGER_TOKEN, BUG_REPORT_REPOSITORY_TOKEN],
    },
    {
      provide: PresignBugReportImagesUseCase,
      useFactory: (
        transactionManager: ITransactionManager,
        bugReportRepo: IBugReportRepository,
        imageRepo: IImageRepository,
        presignedUploadUseCase: PresignedUploadUseCase,
      ) =>
        new PresignBugReportImagesUseCase(
          transactionManager,
          bugReportRepo,
          imageRepo,
          presignedUploadUseCase,
        ),
      inject: [
        TRANSACTION_MANAGER_TOKEN,
        BUG_REPORT_REPOSITORY_TOKEN,
        IMAGE_REPOSITORY_TOKEN,
        PresignedUploadUseCase,
      ],
    },
  ],
  exports: [
    BUG_REPORT_REPOSITORY_TOKEN,
    CreateBugReportUseCase,
    PresignBugReportImagesUseCase,
  ],
})
export class BugReportModule {}
