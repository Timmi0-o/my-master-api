import { Module, forwardRef } from '@nestjs/common';
import type { ITransactionManager } from '@shared/domain/transactions';
import { TRANSACTION_MANAGER_TOKEN } from '@shared/domain/transactions';
import { DeleteFilesUseCase } from 'src/modules/files/application/use-cases/file/delete-files.use-case';
import { PresignedUploadUseCase } from 'src/modules/files/application/use-cases/file/presigned-upload.use-case';
import { FilesModule } from 'src/modules/files/files.module';
import type { IUserProfileRepository } from 'src/modules/users/domain/repositories/user-profile/i-user-profile.repository';
import { USER_PROFILE_REPOSITORY_TOKEN } from 'src/modules/users/domain/repositories/user-profile/user-profile.repository.tokens';
import { UserProfileModule } from 'src/modules/users/infrastructure/modules/user-profile/user-profile.module';
import { DeleteImagesUseCase } from '../../../application/use-cases/image/delete-images.use-case';
import { PresignImagesUseCase } from '../../../application/use-cases/image/presign-images.use-case';
import type { IImageRepository } from '../../../domain/repositories/image/i-image.repository';
import { IMAGE_REPOSITORY_TOKEN } from '../../../domain/repositories/image/image.repository.tokens';
import type { IMasterProfileRepository } from '../../../domain/repositories/master-profile/i-master-profile.repository';
import { MASTER_PROFILE_REPOSITORY_TOKEN } from '../../../domain/repositories/master-profile/master-profile.repository.tokens';
import type { IMasterServiceRepository } from '../../../domain/repositories/master-service/i-master-service.repository';
import { MASTER_SERVICE_REPOSITORY_TOKEN } from '../../../domain/repositories/master-service/master-service.repository.tokens';
import { PrismaImageRepository } from '../../persistence/repositories/image/prisma-image.repository';
import { MasterProfileModule } from '../master-profile/master-profile.module';
import { MasterServiceModule } from '../master-service/master-service.module';

@Module({
  imports: [
    FilesModule,
    forwardRef(() => MasterProfileModule),
    forwardRef(() => MasterServiceModule),
    forwardRef(() => UserProfileModule),
  ],
  providers: [
    {
      provide: IMAGE_REPOSITORY_TOKEN,
      useClass: PrismaImageRepository,
    },
    {
      provide: PresignImagesUseCase,
      useFactory: (
        transactionManager: ITransactionManager,
        serviceRepo: IMasterServiceRepository,
        profileRepo: IMasterProfileRepository,
        userProfileRepo: IUserProfileRepository,
        imageRepo: IImageRepository,
        presignedUploadUseCase: PresignedUploadUseCase,
      ) =>
        new PresignImagesUseCase(
          transactionManager,
          serviceRepo,
          profileRepo,
          userProfileRepo,
          imageRepo,
          presignedUploadUseCase,
        ),
      inject: [
        TRANSACTION_MANAGER_TOKEN,
        MASTER_SERVICE_REPOSITORY_TOKEN,
        MASTER_PROFILE_REPOSITORY_TOKEN,
        USER_PROFILE_REPOSITORY_TOKEN,
        IMAGE_REPOSITORY_TOKEN,
        PresignedUploadUseCase,
      ],
    },
    {
      provide: DeleteImagesUseCase,
      useFactory: (
        transactionManager: ITransactionManager,
        serviceRepo: IMasterServiceRepository,
        profileRepo: IMasterProfileRepository,
        userProfileRepo: IUserProfileRepository,
        imageRepo: IImageRepository,
        deleteFilesUseCase: DeleteFilesUseCase,
      ) =>
        new DeleteImagesUseCase(
          transactionManager,
          serviceRepo,
          profileRepo,
          userProfileRepo,
          imageRepo,
          deleteFilesUseCase,
        ),
      inject: [
        TRANSACTION_MANAGER_TOKEN,
        MASTER_SERVICE_REPOSITORY_TOKEN,
        MASTER_PROFILE_REPOSITORY_TOKEN,
        USER_PROFILE_REPOSITORY_TOKEN,
        IMAGE_REPOSITORY_TOKEN,
        DeleteFilesUseCase,
      ],
    },
  ],
  exports: [IMAGE_REPOSITORY_TOKEN, PresignImagesUseCase, DeleteImagesUseCase],
})
export class ImageModule {}
